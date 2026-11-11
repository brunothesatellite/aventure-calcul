#!/usr/bin/env node
/* ============================================================
   smoke-navigateur.mjs — vérification de bout en bout, sans
   dépendance : lance Edge (ou Chrome) en headless, ouvre
   index.html en file://, parcourt tous les écrans et vérifie
   qu'aucune erreur console n'apparaît.

   Usage :
     node tools/smoke-navigateur.mjs
     NAVIGATEUR="C:\\...\\chrome.exe" node tools/smoke-navigateur.mjs
   ============================================================ */
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ICI = path.dirname(fileURLToPath(import.meta.url));
const INDEX = path.join(ICI, "..", "index.html");
const PORT = 9333;

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
if (!existsSync(INDEX)) {
  console.error("✗ index.html introuvable : " + INDEX);
  process.exit(1);
}

const profil = mkdtempSync(path.join(tmpdir(), "archipel-smoke-"));
const url = pathToFileURL(INDEX).href;

const processus = spawn(navigateur, [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--allow-file-access-from-files",
  "--remote-debugging-port=" + PORT,
  "--user-data-dir=" + profil,
  "about:blank"
], { stdio: "ignore" });

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function cible() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch("http://127.0.0.1:" + PORT + "/json/list");
      const liste = await r.json();
      const page = liste.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch (e) { /* le port n'écoute pas encore */ }
    await dormir(250);
  }
  throw new Error("Le navigateur n'a pas ouvert son port de débogage");
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.attente = new Map();
    this.erreurs = [];
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.attente.has(msg.id)) {
        const { resolve, reject } = this.attente.get(msg.id);
        this.attente.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
        return;
      }
      if (msg.method === "Runtime.exceptionThrown") {
        const d = msg.params.exceptionDetails;
        this.erreurs.push("exception : " + (d.exception?.description || d.text));
      }
      if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
        this.erreurs.push("console.error : " + msg.params.args.map((a) => a.value ?? a.description ?? "").join(" "));
      }
      if (msg.method === "Log.entryAdded" && msg.params.entry.level === "error") {
        this.erreurs.push("log : " + msg.params.entry.text);
      }
    });
  }

  envoyer(method, params = {}) {
    const id = ++this.id;
    const promesse = new Promise((resolve, reject) => this.attente.set(id, { resolve, reject }));
    this.ws.send(JSON.stringify({ id, method, params }));
    return promesse;
  }

  async evaluer(expression, awaitPromise = false) {
    const r = await this.envoyer("Runtime.evaluate", {
      expression,
      awaitPromise,
      returnByValue: true
    });
    if (r.exceptionDetails) {
      throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    }
    return r.result.value;
  }
}

function echec(message) {
  console.error("✗ " + message);
}

async function main() {
  const wsUrl = await cible();
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.addEventListener("open", res, { once: true });
    ws.addEventListener("error", rej, { once: true });
  });

  const cdp = new Cdp(ws);
  await cdp.envoyer("Runtime.enable");
  await cdp.envoyer("Log.enable");
  await cdp.envoyer("Page.enable");
  await cdp.envoyer("Page.navigate", { url });

  /* Attendre la fin du chargement. */
  let pret = false;
  for (let i = 0; i < 60; i++) {
    try {
      if (await cdp.evaluer("document.readyState") === "complete") { pret = true; break; }
    } catch (e) { /* le document n'existe pas encore */ }
    await dormir(250);
  }
  if (!pret) throw new Error("La page ne s'est pas chargée");
  await dormir(400);

  const rapport = await cdp.evaluer(`(async () => {
    const Q = window.Quete;
    const out = { etapes: [], erreurs: [] };
    const pas = (nom, ok, detail) => out.etapes.push({ nom, ok: !!ok, detail: detail || "" });
    const pause = (ms) => new Promise((r) => setTimeout(r, ms));

    pas("namespace Quete", !!window.Quete);
    pas("4 îles", Q.ordreIles().length === 4, Q.ordreIles().map((i) => i.id).join(", "));
    pas("compétences", Q.competences().length >= 30, Q.competences().length + " compétences");
    pas("énoncés", Q.tousLesEnonces().length >= 20, Q.tousLesEnonces().length + " énoncés");
    pas("écran initial sans profil", Q.router.ecran === "home", Q.router.ecran);

    Q.jeu.nouveau("Test", "pirate");
    pas("profil créé", Q.jeu.aProfil(), (Q.etat.profil || {}).nom);
    pas("sauvegarde locale", !!localStorage.getItem("archipel-calculs:v2"));

    const ecrans = [
      ["map", null],
      ["ile", { id: "addition" }],
      ["essai", { ileId: "addition" }],
      ["essai", { ileId: "division", niveauId: "division-3" }],
      ["carnet", null],
      ["boutique", null],
      ["tables", null],
      ["reglages", null],
      ["parent", null],
      ["home", null]
    ];

    for (const [nom, params] of ecrans) {
      Q.router.go(nom, params || {});
      await pause(60);
      const el = document.getElementById("screen-" + nom);
      const html = el ? el.innerHTML : "";
      const casse = /Oups|Erreur d'affichage/.test(html);
      pas("écran " + nom + (params && params.niveauId ? "/" + params.niveauId : ""),
        html.length > 200 && !casse, html.length + " caractères");
    }

    /* ---- Atelier : les quatre îles sont inspectables ---- */
    Q.router.go("essai");
    const boutonsIles = document.querySelectorAll("#screen-essai [data-ile]");
    pas("atelier : 4 îles", boutonsIles.length === 4, boutonsIles.length + " boutons");
    const versDivision = Array.prototype.slice.call(boutonsIles)
      .find((b) => b.getAttribute("data-ile") === "division");
    if (versDivision) {
      versDivision.click();
      pas("atelier : bascule vers la division",
        /Port du Partage/.test(document.getElementById("screen-essai").innerHTML));
    }

    /* ---- Réglages : voix et vitesse de lecture ---- */
    Q.router.go("reglages");
    const selecteurVoix = document.querySelector("#choix-voix");
    const messageVoix = /voix de cet appareil|synthèse vocale/.test(document.getElementById("screen-reglages").textContent);
    pas("réglage de la voix", !!selecteurVoix || messageVoix,
      selecteurVoix ? selecteurVoix.options.length + " voix proposées" : "message d'indisponibilité");
    if (selecteurVoix && selecteurVoix.options.length > 1) {
      const libelles = Array.prototype.slice.call(selecteurVoix.options, 1)
        .map((o) => o.textContent.trim());
      const courts = libelles.map((l) => l.split(" — ")[0]);
      const propres = courts.every((l) => l.length > 1 &&
        !/Microsoft|Online|Natural|Multilingual|fr-/i.test(l));
      pas("voix : prénoms seuls", propres, courts.slice(0, 4).join(", ") +
        (courts.length > 4 ? "…" : ""));
      pas("voix : libellés uniques", new Set(libelles).size === libelles.length,
        libelles.length + " entrées");
    }
    const reglette = document.querySelector("#vitesse-voix");
    pas("réglette de vitesse", !!reglette);
    if (reglette) {
      reglette.value = "120";
      reglette.dispatchEvent(new Event("input"));
      reglette.dispatchEvent(new Event("change"));
      pas("vitesse enregistrée", Number(Q.etat.reglages.voixVitesse) === 1.2,
        Q.etat.reglages.voixVitesse + "×");
    }

    /* Générateur : 50 tirages valides pour chaque énoncé. */
    let total = 0, echecs = 0;
    Q.tousLesEnonces().forEach((g) => {
      const s = Q.generateur.stats(g, 50);
      total += s.reussis;
      if (s.reussis < 50) { echecs++; out.erreurs.push(g.id + " : " + (s.erreurs[0] || "tirages incomplets")); }
    });
    pas("générateur (50 tirages par énoncé)", echecs === 0, total + " tirages");

    /* Les formes de question doivent toutes être produites. */
    const qcm = Q.session.construire({ ileId: "addition", niveauId: "addition-1", mode: "niveau" });
    pas("QCM à 3 choix", qcm && qcm.questions.every((x) => x.type === "qcm" && x.options.length === 3),
      qcm ? qcm.questions.map((x) => x.type).join(",") : "nulle");

    const pave = Q.session.construire({ ileId: "addition", niveauId: "addition-3", mode: "niveau" });
    pas("pavé numérique", pave && pave.questions.some((x) => x.type === "saisie"),
      pave ? pave.questions.map((x) => x.type).join(",") : "nulle");

    const div = Q.session.construire({ ileId: "division", niveauId: "division-3", mode: "niveau" });
    const avecReste = div ? div.questions.filter((x) => x.competence === "div.reste") : [];
    pas("division : deux champs ou potence",
      avecReste.length >= 2 && avecReste.every((x) =>
        x.type === "potence" || (x.champs && x.champs.length === 2)),
      avecReste.map((x) => x.type).join(","));
    const gabaritsPotence = Q.tousLesEnonces().filter((g) => g.mode === "potence");
    pas("13 gabarits de division posée", gabaritsPotence.length === 13,
      gabaritsPotence.length + " gabarits");

    /* Le gabarit posé doit produire une question posée (test direct,
       car une quête de 5 questions ne le tire pas forcément). */
    const gabaritPose = Q.enonce("mul-pose-13");
    pas("calcul posé (gabarit)", !!(gabaritPose && Q.exercices.construire(gabaritPose).type === "pose"));

    let poseDansQuete = false;
    for (let i = 0; i < 12 && !poseDansQuete; i++) {
      const essai = Q.session.construire({ ileId: "multiplication", niveauId: "multiplication-4", mode: "niveau" });
      poseDansQuete = !!essai && essai.questions.some((x) => x.type === "pose");
    }
    pas("calcul posé dans une quête", poseDansQuete);

    /* Le cahier de retenues : cases présentes, correction pré-remplie,
       et pas de cases inutiles en multiplication. */
    const exemplePose = { nombres: { a: 147, b: 238 }, operation: "+", reponse: 385 };
    const htmlPose = Q.exercices.poseHTML(exemplePose);
    const nbCases = (htmlPose.match(/data-marque=/g) || []).length;
    pas("cases de retenues", nbCases === 4, nbCases + " cases");
    pas("retenue attendue en correction",
      /pose__case[^"]*pleine/.test(Q.exercices.poseHTML(exemplePose, { corrige: true })));
    const exempleFois = { nombres: { a: 47, b: 3 }, operation: "×", reponse: 141 };
    const reportsFois = Q.exercices.reportsPose(exempleFois);
    pas("retenues de multiplication",
      reportsFois.haut[1] === 2 && reportsFois.haut[2] === 1 &&
      /data-cycle="9"/.test(Q.exercices.poseHTML(exempleFois)),
      JSON.stringify(reportsFois));

    /* Soustraction posée : méthode par compensation. */
    const exempleSub = { nombres: { a: 452, b: 187 }, operation: "−", reponse: 265 };
    pas("cases en soustraction", /data-marque=/.test(Q.exercices.poseHTML(exempleSub)));
    const marquesSub = Q.exercices.marquesPose(exempleSub);
    pas("emprunts détectés", Array.isArray(marquesSub) && marquesSub.some((m) => m === 1),
      JSON.stringify(marquesSub));
    const reportsSub = Q.exercices.reportsPose(exempleSub);
    pas("compensation : +10 en haut, +1 en bas",
      reportsSub.haut[0] === 1 && reportsSub.bas[1] === 1 &&
      reportsSub.haut[1] === 1 && reportsSub.bas[2] === 1,
      JSON.stringify(reportsSub));
    pas("emprunt attendu en correction",
      /pose__case[^"]*pleine/.test(Q.exercices.poseHTML(exempleSub, { corrige: true })));

    /* Division posée : potence et résultats intermédiaires. */
    const divPose = Q.exercices.etapesDivision(632, 4);
    pas("division posée : quotient et reste",
      divPose.quotient === "158" && divPose.reste === 0,
      divPose.quotient + " r " + divPose.reste);
    pas("division posée : produits successifs",
      divPose.steps.map((s) => s.produit).join(",") === "4,20,32",
      divPose.steps.map((s) => s.produit).join(","));
    pas("division posée : différences successives",
      divPose.steps.map((s) => s.difference).join(",") === "2,3,0",
      divPose.steps.map((s) => s.difference).join(","));
    const htmlPotence = Q.exercices.potenceHTML({ nombres: { a: 632, b: 4 } });
    pas("potence : 11 cases à remplir",
      (htmlPotence.match(/data-role=/g) || []).length === 11,
      (htmlPotence.match(/data-role=/g) || []).length + " cases");
    pas("potence : chiffres descendus",
      (htmlPotence.match(/potence__chiffre--descendu/g) || []).length === 2);

    /* Variété : une quête ne doit pas répéter huit fois la même histoire. */
    const variete = Q.session.construire({ ileId: "addition", niveauId: "addition-1", mode: "niveau" });
    const formulations = new Set(variete.questions.map((q) => q.gabaritId + "|" + q.variante));
    pas("formulations variées dans une quête", formulations.size >= 5,
      formulations.size + " formulations pour " + variete.questions.length + " questions");

    const melange = Q.session.construire({ ileId: "multiplication", niveauId: "multiplication-4", mode: "niveau" });
    const niveaux = new Set(melange.questions.map((q) => q.niveau));
    pas("rappel des niveaux précédents", niveaux.size >= 2, "niveaux " + [...niveaux].join(", "));

    /* ---- Salle des tables : une partie complète ---- */
    Q.router.go("tables");
    const boutonTable = document.querySelector('[data-table="7"]');
    pas("salle des tables : menu", !!boutonTable);
    if (boutonTable) {
      boutonTable.click();
      let toursTable = 0, okTable = true;
      while (Q.router.ecran === "tables" && !document.querySelector(".resultat") && toursTable < 12) {
        toursTable++;
        const fort = document.querySelector(".texte-enonce strong");
        if (!fort) { okTable = false; break; }
        const parts = fort.textContent.split("×").map((s) => Number(s.trim()));
        String(parts[0] * parts[1]).split("").forEach((c) => {
          const touche = document.querySelector('[data-chiffre="' + c + '"]');
          if (touche) touche.click();
        });
        document.querySelector('[data-action="valider"]').click();
        const suite = document.querySelector("[data-suite]");
        if (suite) suite.click();
      }
      pas("salle des tables : partie jouée", okTable && toursTable === 10, toursTable + " questions");
      const bilanTables = document.getElementById("screen-tables").textContent;
      pas("salle des tables : bilan 10/10", bilanTables.indexOf("10/10") !== -1);
      const recordTable = (Q.etat.tables["7"] || {}).record;
      pas("salle des tables : record enregistré", recordTable === 10, "record " + recordTable);
      Q.ui.fermerModale();
    }
    Q.router.go("map");

    /* ---- Quête réellement jouée dans le DOM (QCM) ---- */
    Q.router.go("ile", { id: "addition" });
    const bouton = document.querySelector('[data-niveau="addition-1"]');
    pas("bouton Jouer", !!bouton);
    if (bouton) {
      bouton.click();
      pas("écran de quête", Q.router.ecran === "quete", Q.router.ecran);
      let tours = 0, ok = true, raison = "";
      while (Q.router.ecran === "quete" && tours < 12) {
        tours++;
        const q = Q.etat.quest.questions[Q.etat.quest.index];
        const opt = document.querySelector('[data-choix="' + q.reponse + '"]');
        if (!opt) { ok = false; raison = "option absente (" + q.type + " · " + q.gabaritId + ")"; break; }
        opt.click();
        const suite = document.querySelector("[data-suite]");
        if (!suite) { ok = false; raison = "pas de bouton Continuer"; break; }
        suite.click();
      }
      pas("quête QCM jouée au clic", ok && Q.router.ecran === "resultat", raison || tours + " questions");
      const prog = Q.etat.progression["addition-1"] || {};
      pas("étoiles enregistrées", prog.etoiles === 3, prog.etoiles + " étoile(s)");
      pas("or et série", Q.etat.or > 0 && Q.etat.serie.record >= 8,
        Q.etat.or + " pièces, série " + Q.etat.serie.record);
    }
    Q.ui.fermerModale();

    /* ---- Erreur, feedback, aide d'un familier, puis réussite ---- */
    Q.etat.familiers = ["crabe-compteur"];
    const mauvaise = Q.session.construire({ ileId: "addition", niveauId: "addition-1", mode: "niveau" });
    Q.etat.quest = mauvaise;
    Q.router.go("quete");
    const q0 = mauvaise.questions[0];
    const faux = Array.prototype.slice.call(document.querySelectorAll(".option"))
      .find((b) => Number(b.getAttribute("data-choix")) !== q0.reponse);
    if (faux) {
      faux.click();
      const feedback = document.querySelector("#zone-feedback");
      pas("feedback sur erreur", feedback && /feedback--ko/.test(feedback.innerHTML) &&
        feedback.textContent.trim().length > 20,
        feedback ? feedback.textContent.trim().slice(0, 48) : "vide");
      pas("choix fautif désactivé", faux.disabled);

      const aide = document.querySelector('[data-aide="decomposer"]');
      pas("aide du familier présente", !!aide);
      if (aide) {
        aide.click();
        const f2 = document.querySelector("#zone-feedback");
        pas("décomposition affichée", f2 && f2.textContent.trim().length > 20,
          f2 ? f2.textContent.trim().slice(0, 48) : "vide");
      }
    }
    const bonne = document.querySelector('[data-choix="' + q0.reponse + '"]');
    if (bonne) {
      bonne.click();
      pas("continuer après réussite", !!document.querySelector("[data-suite]"));
      document.querySelector("[data-suite]").click();
      pas("passage à la question suivante", Q.etat.quest.index === 1, "index " + Q.etat.quest.index);
    }
    Q.etat.quest = null;

    /* ---- Quêtes jouées par le moteur (pavé, reste, posé) ---- */
    function jouerMoteur(options) {
      const quete = Q.session.construire(options);
      if (!quete) return null;
      Q.etat.quest = quete;
      let garde = 0;
      while (!quete.fini && garde++ < 20) {
        const q = quete.questions[quete.index];
        const r = Q.session.repondre(q.reponse);
        if (!r || !r.correct || q.essais !== 1) return null;
        Q.session.suivante();
      }
      const res = quete.resultat;
      if (!res) return null;
      Q.jeu.enregistrerQuete(res.ileId, res.niveauId, res);
      if (res.gardien) {
        const ile = Q.ile(res.ileId);
        if (ile) Q.jeu.ajouterPointe(ile.operation);
      }
      Q.etat.quest = null;
      Q.jeu.sauver();
      return res;
    }

    const rPave = jouerMoteur({ ileId: "addition", niveauId: "addition-3", mode: "niveau" });
    pas("quête pavé réussie", rPave && rPave.total === 8 && rPave.etoiles === 3,
      rPave ? rPave.total + " questions · " + rPave.etoiles + " ★" : "échec");

    const rReste = jouerMoteur({ ileId: "division", niveauId: "division-3", mode: "niveau" });
    pas("quête division avec reste", rReste && rReste.total === 8,
      rReste ? rReste.total + " questions" : "échec");

    const rPose = jouerMoteur({ ileId: "multiplication", niveauId: "multiplication-4", mode: "niveau" });
    pas("quête avec calcul posé", rPose && rPose.total === 8,
      rPose ? rPose.total + " questions" : "échec");

    /* Cases de retenues réellement cliquables dans l'écran de quête. */
    const qPose = Q.exercices.construire(Q.enonce("add-pose-05"));
    Q.etat.quest = {
      ileId: "addition", niveauId: "addition-3", mode: "niveau", operation: "addition",
      creeLe: Date.now(), questions: [qPose], index: 0,
      aides: { eliminer: 0, decomposer: 0, astuce: 0, indice: 0 }, orGagne: 0, fini: false
    };
    Q.router.go("quete");
    const caseRetenue = document.querySelector('#screen-quete [data-marque][data-valeur="0"]') ||
      document.querySelector("#screen-quete [data-marque]");
    pas("case de retenue à l'écran", !!caseRetenue);
    if (caseRetenue) {
      const depart = caseRetenue.getAttribute("data-valeur");
      caseRetenue.click();
      const attendue = Number(depart) > 0 ? "0" : "1";
      pas("case de retenue cochée",
        caseRetenue.getAttribute("data-valeur") === attendue &&
        caseRetenue.textContent.trim() === (attendue === "1" ? "1" : ""),
        "valeur " + caseRetenue.getAttribute("data-valeur"));
      caseRetenue.click();
      pas("case de retenue effacée",
        Number(caseRetenue.getAttribute("data-valeur")) === 0 &&
        !caseRetenue.classList.contains("pleine"),
        "valeur " + caseRetenue.getAttribute("data-valeur"));
    }

    /* Saisie de droite à gauche : 905 se tape 5, puis 0, puis 9. */
    const attenduPose = String(qPose.reponse);
    attenduPose.split("").reverse().forEach(function (c) {
      const touche = document.querySelector('#screen-quete [data-chiffre="' + c + '"]');
      if (touche) touche.click();
    });
    const affiche = document.getElementById("pose-resultat");
    pas("saisie de droite à gauche", !!affiche && affiche.textContent === attenduPose,
      affiche ? affiche.textContent + " (attendu " + attenduPose + ")" : "absent");

    /* Potence de division réellement jouée dans l'écran de quête. */
    const qPotence = Q.exercices.construire(Q.enonce("div-reste-25"));
    Q.etat.quest = {
      ileId: "division", niveauId: "division-3", mode: "niveau", operation: "division",
      creeLe: Date.now(), questions: [qPotence], index: 0,
      aides: { eliminer: 0, decomposer: 0, astuce: 0, indice: 0 }, orGagne: 0, fini: false
    };
    Q.router.go("quete");
    const casesPotence = Array.prototype.slice.call(
      document.querySelectorAll("#screen-quete [data-role]"));
    pas("potence à l'écran", qPotence.type === "potence" && casesPotence.length >= 6,
      qPotence.type + " · " + casesPotence.length + " cases");

    /* Une case fausse compte comme un essai, même avec le bon quotient. */
    const parOrdre = Array.prototype.slice.call(document.querySelectorAll("#screen-quete [data-role]"))
      .sort((a, b) => Number(a.getAttribute("data-ordre")) - Number(b.getAttribute("data-ordre")));
    parOrdre.forEach(function (b, i) {
      const d = i === 0 ? String((Number(b.getAttribute("data-attendu")) + 1) % 10) : b.getAttribute("data-attendu");
      b.click();
      const touche = document.querySelector('#screen-quete [data-chiffre="' + d + '"]');
      if (touche) touche.click();
    });
    document.querySelector("#screen-quete [data-action='valider']").click();
    pas("potence : case fausse signalée",
      document.querySelectorAll("#screen-quete .potence__case.faux").length === 1,
      document.querySelectorAll("#screen-quete .potence__case.faux").length + " fausse(s)");
    pas("potence : premier essai raté", !qPotence.termine);
    document.querySelectorAll("#screen-quete .potence__case.faux").forEach(function (b) {
      b.click();
      const touche = document.querySelector('#screen-quete [data-chiffre="' + b.getAttribute("data-attendu") + '"]');
      if (touche) touche.click();
    });
    document.querySelector("#screen-quete [data-action='valider']").click();
    pas("potence : réussie après correction", qPotence.reussi === true && !!qPotence.premierCoup === false,
      "reussi " + qPotence.reussi);

    /* Deuxième potence : deux échecs révèlent le calcul corrigé. */
    const qPotence2 = Q.exercices.construire(Q.enonce("div-reste-26"));
    Q.etat.quest = {
      ileId: "division", niveauId: "division-3", mode: "niveau", operation: "division",
      creeLe: Date.now(), questions: [qPotence2], index: 0,
      aides: { eliminer: 0, decomposer: 0, astuce: 0, indice: 0 }, orGagne: 0, fini: false
    };
    Q.router.go("quete");
    Array.prototype.slice.call(document.querySelectorAll("#screen-quete [data-role]"))
      .forEach(function (b) {
        b.click();
        const d = String((Number(b.getAttribute("data-attendu")) + 1) % 10);
        const touche = document.querySelector('#screen-quete [data-chiffre="' + d + '"]');
        if (touche) touche.click();
      });
    document.querySelector("#screen-quete [data-action='valider']").click();
    document.querySelector("#screen-quete [data-action='valider']").click();
    pas("potence : correction révélée",
      qPotence2.termine === true &&
      document.querySelectorAll("#screen-quete .potence__case--corrigee").length > 0,
      qPotence2.termine + " · " +
      document.querySelectorAll("#screen-quete .potence__case--corrigee").length + " cases corrigées");

    /* Niveau 4 : potence exacte, la réponse reste un nombre. */
    const qExacte = Q.exercices.construire(Q.enonce("div-barques-04"));
    Q.etat.quest = {
      ileId: "division", niveauId: "division-4", mode: "niveau", operation: "division",
      creeLe: Date.now(), questions: [qExacte], index: 0,
      aides: { eliminer: 0, decomposer: 0, astuce: 0, indice: 0 }, orGagne: 0, fini: false
    };
    Q.router.go("quete");
    Array.prototype.slice.call(document.querySelectorAll("#screen-quete [data-role]"))
      .sort((a, b) => Number(a.getAttribute("data-ordre")) - Number(b.getAttribute("data-ordre")))
      .forEach(function (b) {
        b.click();
        const touche = document.querySelector('#screen-quete [data-chiffre="' + b.getAttribute("data-attendu") + '"]');
        if (touche) touche.click();
      });
    document.querySelector("#screen-quete [data-action='valider']").click();
    pas("potence exacte niveau 4",
      qExacte.type === "potence" && typeof qExacte.reponse === "number" && qExacte.reussi === true,
      qExacte.type + " · réponse " + qExacte.reponse + " · reussi " + qExacte.reussi);

    const rPartage = jouerMoteur({ ileId: "division", niveauId: "division-4", mode: "niveau" });
    pas("quête partage (mixte)", rPartage && rPartage.total === 8,
      rPartage ? rPartage.total + " questions" : "échec");

    Q.etat.quest = null;
    Q.router.go("map");

    /* ---- Gardien : pointe et absence de niveau fantôme ---- */
    const rGardien = jouerMoteur({ ileId: "addition", niveauId: null, mode: "gardien" });
    pas("Gardien jouable", rGardien && rGardien.gardien && rGardien.total === 8,
      rGardien ? rGardien.total + " questions" : "échec");
    pas("pointe du Gardien", Q.etat.pointes.indexOf("addition") !== -1, Q.etat.pointes.join(", "));
    pas("pas de niveau fantôme", !Object.prototype.hasOwnProperty.call(Q.etat.progression, "null"),
      Object.keys(Q.etat.progression).join(", "));

    /* ---- Révision du jour (SRS) ---- */
    Q.etat.srs["add.dans10"] = { boite: 1, du: 0, vus: 2, reussites: 2, echecs: 0 };
    Q.router.go("map");
    const btnRevision = document.querySelector('[data-action="revision"]');
    pas("bouton Réviser du jour", !!btnRevision);
    if (btnRevision) {
      btnRevision.click();
      pas("quête de révision", Q.router.ecran === "quete" && Q.etat.quest.mode === "revision",
        Q.etat.quest ? Q.etat.quest.mode + " · " + Q.etat.quest.questions.length + " questions" : "nulle");
      Q.etat.quest = null;
    }

    /* ---- Mode test : parcours réel dans l'interface ---- */
    Q.etat.pin = "1234";
    Q.parentDebloque = true;
    Q.router.go("parent");
    pas("carte de chaleur", !!document.querySelector("#screen-parent .chaleur"));
    pas("erreurs par famille",
      /Erreurs par famille/.test(document.getElementById("screen-parent").textContent));
    const btnDebloquer = document.querySelector('[data-action="debloquer"]');
    pas("bouton Tout débloquer", !!btnDebloquer);
    if (btnDebloquer) {
      btnDebloquer.click();
      const valider = document.querySelector('.modale [data-action="0"]');
      pas("confirmation demandée", !!valider);
      if (valider) {
        valider.click();
        await pause(80);
        pas("mode test activé", !!Q.etat.testDeblocage && Q.etat.pointes.length === 4,
          Q.etat.pointes.length + "/4 pointes");
        const btnAnnuler = document.querySelector('[data-action="annuler-deblocage"]');
        pas("bouton de restauration", !!btnAnnuler);
        if (btnAnnuler) {
          btnAnnuler.click();
          await pause(80);
          pas("mode test désactivé", !Q.etat.testDeblocage);
        }
      }
    }

    /* ---- Mode test : logique de sauvegarde/restauration ---- */
    const avant = JSON.stringify(Q.etat.progression);
    Q.jeu.debloquerTout();
    const ouvertes = Q.curriculum().ordre.every((id) => Q.jeu.ileDebloquee(id));
    pas("tout débloquer", ouvertes && Q.etat.pointes.length === 4,
      Q.etat.pointes.length + "/4 pointes");
    Q.jeu.annulerDeblocage();
    pas("progression restaurée", JSON.stringify(Q.etat.progression) === avant && !Q.etat.testDeblocage,
      Q.etat.testDeblocage ? "mode test encore actif" : "ok");

    pas("aucune exception retenue", out.erreurs.length === 0, out.erreurs.join(" | "));
    return out;
  })()`, true);

  /* Persistance : on recharge la page et on vérifie que le profil revient. */
  await cdp.envoyer("Page.reload");
  let recharge = false;
  for (let i = 0; i < 40; i++) {
    try {
      if (await cdp.evaluer("document.readyState") === "complete") { recharge = true; break; }
    } catch (e) { /* le document est en cours de remplacement */ }
    await dormir(250);
  }
  await dormir(400);
  const apres = recharge
    ? await cdp.evaluer(`(() => { const Q = window.Quete; return { profil: Q.jeu.aProfil(), nom: (Q.etat.profil || {}).nom || "", ecran: Q.router.ecran, vitesse: (Q.etat.reglages || {}).voixVitesse }; })()`)
    : null;
  rapport.etapes.push({
    nom: "profil et réglages après rechargement",
    ok: !!(apres && apres.profil && apres.nom === "Test" && apres.ecran === "map" && Number(apres.vitesse) === 1.2),
    detail: apres ? apres.nom + " · écran " + apres.ecran + " · vitesse " + apres.vitesse : "page non rechargée"
  });

  console.log("");
  console.log("L'Archipel des Calculs — test navigateur");
  console.log("=".repeat(52));
  rapport.etapes.forEach((e) => console.log((e.ok ? "✓ " : "✗ ") + e.nom + (e.detail ? "  ·  " + e.detail : "")));

  const erreurs = rapport.etapes.filter((e) => !e.ok);
  const erreursConsole = cdp.erreurs;

  if (erreursConsole.length) {
    console.log("");
    console.log("Erreurs console");
    console.log("-".repeat(52));
    erreursConsole.forEach((e) => console.log("✗ " + e));
  }

  console.log("");
  if (erreurs.length || erreursConsole.length) {
    console.log("Bilan : " + erreurs.length + " étape(s) en échec, " + erreursConsole.length + " erreur(s) console.");
    process.exitCode = 1;
  } else {
    console.log("Bilan : " + rapport.etapes.length + " étapes OK, aucune erreur console. ✓");
  }

  ws.close();
}

main()
  .catch((e) => { echec(e.message); process.exitCode = 1; })
  .finally(async () => {
    await dormir(200);
    processus.kill();
    await dormir(300);
    try { rmSync(profil, { recursive: true, force: true }); } catch (e) { /* verrou Windows */ }
  });
