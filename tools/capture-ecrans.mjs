#!/usr/bin/env node
/* ============================================================
   capture-ecrans.mjs — captures d'écran pour la revue visuelle
   et le README. Même approche que smoke-navigateur.mjs : Edge en
   headless, protocole DevTools, aucune dépendance.

   Usage :
     node tools/capture-ecrans.mjs
     node tools/capture-ecrans.mjs docs/captures
   ============================================================ */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ICI = path.dirname(fileURLToPath(import.meta.url));
const INDEX = path.join(ICI, "..", "index.html");
const SORTIE = path.resolve(process.argv[2] || path.join(ICI, "..", "docs", "captures"));
const PORT = 9344;

const CANDIDATS = [
  process.env.NAVIGATEUR,
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
].filter(Boolean);

const navigateur = CANDIDATS.find((p) => existsSync(p));
if (!navigateur) {
  console.error("✗ Navigateur introuvable. Définis NAVIGATEUR=chemin\\vers\\edge.exe");
  process.exit(1);
}

mkdirSync(SORTIE, { recursive: true });
const profil = mkdtempSync(path.join(tmpdir(), "archipel-capture-"));

const processus = spawn(navigateur, [
  "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
  "--allow-file-access-from-files", "--remote-debugging-port=" + PORT,
  "--user-data-dir=" + profil, "about:blank"
], { stdio: "ignore" });

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function cible() {
  for (let i = 0; i < 40; i++) {
    try {
      const liste = await (await fetch("http://127.0.0.1:" + PORT + "/json/list")).json();
      const page = liste.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch (e) { /* pas encore prêt */ }
    await dormir(250);
  }
  throw new Error("Port de débogage indisponible");
}

class Cdp {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.attente = new Map();
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.attente.has(msg.id)) {
        const { resolve, reject } = this.attente.get(msg.id);
        this.attente.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message)); else resolve(msg.result);
      }
    });
  }
  envoyer(method, params = {}) {
    const id = ++this.id;
    const p = new Promise((resolve, reject) => this.attente.set(id, { resolve, reject }));
    this.ws.send(JSON.stringify({ id, method, params }));
    return p;
  }
  evaluer(expression, awaitPromise = false) {
    return this.envoyer("Runtime.evaluate", { expression, awaitPromise, returnByValue: true })
      .then((r) => r.result.value);
  }
}

const ECRANS = [
  ["home", null, "accueil"],
  ["profils", null, "profils"],
  ["map", null, "carte"],
  ["ile", { id: "addition" }, "ile-addition"],
  ["ile", { id: "multiplication" }, "ile-multiplication"],
  ["essai", { ileId: "addition" }, "atelier"],
  ["essai", { ileId: "division", niveauId: "division-3" }, "atelier-division"],
  ["carnet", null, "carnet"],
  ["boutique", null, "boutique"],
  ["reglages", null, "reglages"]
];

async function main() {
  const ws = new WebSocket(await cible());
  await new Promise((res, rej) => {
    ws.addEventListener("open", res, { once: true });
    ws.addEventListener("error", rej, { once: true });
  });
  const cdp = new Cdp(ws);
  await cdp.envoyer("Runtime.enable");
  await cdp.envoyer("Page.enable");
  await cdp.envoyer("Emulation.setDeviceMetricsOverride", {
    width: 1180, height: 900, deviceScaleFactor: 1, mobile: false
  });
  await cdp.envoyer("Page.navigate", { url: pathToFileURL(INDEX).href });

  for (let i = 0; i < 60; i++) {
    try { if (await cdp.evaluer("document.readyState") === "complete") break; } catch (e) { /* … */ }
    await dormir(250);
  }
  await dormir(400);

  await cdp.evaluer(`(() => {
    const Q = window.Quete;
    Q.jeu.nouveau("Malo", "pirate");
    Q.etat.or = 340;
    Q.etat.orGagne = 340;
    Q.etat.pointes = ["addition"];
    Q.etat.progression = {
      "addition-1": { etoiles: 3, meilleur: 8, quetes: 3 },
      "addition-2": { etoiles: 2, meilleur: 7, quetes: 2 },
      "addition-3": { etoiles: 1, meilleur: 6, quetes: 1 }
    };
    Q.etat.familiers = ["crabe-compteur"];
    const voix = Q.audio.listerVoix();
    if (voix.length) Q.etat.reglages.voixNom = voix[0].nom;
    Q.jeu.sauver();
  })()`);

  async function capturer(nom) {
    const { data } = await cdp.envoyer("Page.captureScreenshot", { format: "png" });
    const fichier = path.join(SORTIE, nom + ".png");
    writeFileSync(fichier, Buffer.from(data, "base64"));
    console.log("✓ " + fichier);
  }

  for (const [ecran, params, nom] of ECRANS) {
    await cdp.evaluer(`window.Quete.router.go(${JSON.stringify(ecran)}, ${JSON.stringify(params || {})})`);
    await dormir(250);
    await capturer(nom);
  }

  /* Écrans de quête : on compose une vraie quête et on saute à la
     question du type voulu. */
  await cdp.evaluer(`(() => {
    const Q = window.Quete;
    const quete = Q.session.construire({ ileId: "addition", niveauId: "addition-1", mode: "niveau" });
    Q.etat.quest = quete;
    Q.router.go("quete");
  })()`);
  await dormir(250);
  await capturer("quete-qcm");

  await cdp.evaluer(`(() => {
    const Q = window.Quete;
    const quete = Q.session.construire({ ileId: "addition", niveauId: "addition-3", mode: "niveau" });
    let i = quete.questions.findIndex((q) => q.type === "saisie");
    quete.index = i < 0 ? 0 : i;
    Q.etat.quest = quete;
    Q.router.go("quete");
  })()`);
  await dormir(250);
  await capturer("quete-pave");

  await cdp.evaluer(`(() => {
    const Q = window.Quete;
    const quete = Q.session.construire({ ileId: "multiplication", niveauId: "multiplication-4", mode: "niveau" });
    let i = quete.questions.findIndex((q) => q.type === "pose");
    quete.index = i < 0 ? 0 : i;
    Q.etat.quest = quete;
    Q.router.go("quete");
  })()`);
  await dormir(250);
  await capturer("quete-pose");

  await cdp.evaluer(`(() => {
    const Q = window.Quete;
    const quete = Q.session.construire({ ileId: "division", niveauId: "division-3", mode: "niveau" });
    let i = quete.questions.findIndex((q) => q.champs && q.champs.length === 2);
    quete.index = i < 0 ? 0 : i;
    Q.etat.quest = quete;
    Q.router.go("quete");
  })()`);
  await dormir(250);
  await capturer("quete-reste");

  /* Bilan de quête : une quête jouée puis affichée. */
  await cdp.evaluer(`(() => {
    const Q = window.Quete;
    const quete = Q.session.construire({ ileId: "addition", niveauId: "addition-1", mode: "niveau" });
    Q.etat.quest = quete;
    let garde = 0;
    while (!quete.fini && garde++ < 20) {
      const q = quete.questions[quete.index];
      if (quete.index === 0) q.essais = 1;
      Q.session.repondre(q.reponse);
      Q.session.suivante();
    }
    Q.router.go("resultat", { resultat: quete.resultat });
  })()`);
  await dormir(300);
  await capturer("resultat");

  /* Espace parent : tableau de bord (PIN posé, session débloquée). */
  await cdp.evaluer(`(() => {
    const Q = window.Quete;
    Q.etat.pin = "1234";
    Q.parentDebloque = true;
    Q.jeu.sauver();
    Q.router.go("parent");
  })()`);
  await dormir(250);
  await cdp.evaluer("window.scrollTo(0, 700)");
  await dormir(150);
  await capturer("parent");

  ws.close();
}

main()
  .catch((e) => { console.error("✗ " + e.message); process.exitCode = 1; })
  .finally(async () => {
    await dormir(200);
    processus.kill();
    await dormir(300);
    try { rmSync(profil, { recursive: true, force: true }); } catch (e) { /* verrou Windows */ }
  });
