#!/usr/bin/env node
/* ============================================================
   lint-enonces.js — vérifie TOUS les énoncés sur N tirages

   Sur du contenu généré, un bug est probabiliste : une borne trop
   large ne se voit pas sur trois exemples. On tire donc 500 fois
   chaque gabarit et on vérifie le texte ET la réponse.

   Usage :
     node tools/lint-enonces.js
     node tools/lint-enonces.js --tirages=200
     node tools/lint-enonces.js --exemples=3
     node tools/lint-enonces.js --seulement=addition

   Sort en code 1 si une erreur est détectée (utilisable en hook),
   en code 0 si seuls des avertissements subsistent.
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RACINE = path.join(__dirname, "..");
const args = process.argv.slice(2);

function option(nom, defaut) {
  const a = args.find((x) => x.startsWith("--" + nom + "="));
  if (!a) return defaut;
  const v = a.split("=")[1];
  const n = parseInt(v, 10);
  return isNaN(n) ? v : n;
}

const TIRAGES = option("tirages", 500);
const EXEMPLES = option("exemples", 0);
const SEULEMENT = option("seulement", null);

/* ---------- Chargement du contenu dans un contexte isolé ---------- */

function charger() {
  const sandbox = { window: {}, console };
  sandbox.globalThis = sandbox;
  const contexte = vm.createContext(sandbox);

  const fichiers = [
    "content/registry.js",
    "content/competences.js",
    ...fs.readdirSync(path.join(RACINE, "content/iles")).sort()
      .map((f) => "content/iles/" + f),
    ...fs.readdirSync(path.join(RACINE, "content/enonces")).sort()
      .map((f) => "content/enonces/" + f),
    "content/curriculum.js",
    "engine/generateur.js"
  ];

  for (const rel of fichiers) {
    const abs = path.join(RACINE, rel);
    if (!fs.existsSync(abs)) throw new Error("Fichier introuvable : " + rel);
    const code = fs.readFileSync(abs, "utf8");
    try {
      vm.runInContext(code, contexte, { filename: rel });
    } catch (e) {
      throw new Error("Chargement de " + rel + " : " + e.message);
    }
  }

  return sandbox.window.Quete;
}

/* ---------- Garde-fous numériques ---------- */

/* Plafonds par opération et par mode. Volontairement larges : ce
   sont des filets de sécurité, pas la règle pédagogique fine (qui
   vit dans les contraintes de chaque gabarit). */
const PLAFONDS = {
  addition: { tete: 1000, pose: 4000 },
  soustraction: { tete: 1000, pose: 4000 },
  multiplication: { tete: 200, pose: 4000 },
  division: { tete: 200, pose: 400 }
};

const SYMBOLES = ["+", "−", "×", "÷"];

function verifierSymboleEspace(enonce) {
  /* En mode calcul, un symbole doit être isolé par des espaces,
     sinon la lecture orale et la mise en page en colonnes cassent. */
  for (const s of SYMBOLES) {
    const i = enonce.indexOf(s);
    if (i === -1) continue;
    const avant = enonce[i - 1];
    const apres = enonce[i + 1];
    if (avant !== " " || apres !== " ") {
      return "symbole « " + s + " » non entouré d'espaces : " + enonce;
    }
  }
  return null;
}

function nombresAffiches(instance) {
  /* Seuls les nombres réellement écrits dans l'énoncé comptent :
     un nombre tiré mais non affiché (le diviseur d'un énoncé
     « combien de parts ? ») n'aide pas l'enfant à deviner. */
  const jetons = (instance.modele || "").match(/\{[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
  return jetons
    .map((j) => instance.nombres[j.slice(1)])
    .filter((v) => typeof v === "number");
}

/* ---------- Vérification ---------- */

function verifierGabarit(Q, gabarit, tirages) {
  const erreurs = [];
  const avertissements = [];
  const instances = [];
  const textes = new Set();
  const reponses = [];

  /* Toutes les formulations doivent être valides, pas seulement
     celles qui sortent au tirage. */
  const formulations = Array.isArray(gabarit.enonces) && gabarit.enonces.length
    ? gabarit.enonces
    : [gabarit.enonce];
  const noms = Object.keys(gabarit.nombres || {});
  formulations.forEach((v) => {
    const souci = verifierSymboleEspace(v);
    if (souci) erreurs.push(souci);
    const jetons = v.match(/\{[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
    jetons.forEach((j) => {
      if (noms.indexOf(j.slice(1)) === -1) {
        erreurs.push("nombre « " + j.slice(1) + " » absent de nombres : " + v);
      }
    });
  });

  for (let i = 0; i < tirages; i++) {
    let x;
    try {
      x = Q.generateur.tirer(gabarit);
    } catch (e) {
      erreurs.push("tirage " + (i + 1) + " : " + e.message);
      break;
    }
    instances.push(x);
    textes.add(x.texte);

    if (x.texte.indexOf("{") !== -1) erreurs.push("accolade non remplacée : " + x.texte);
    if (/undefined|NaN|null/.test(x.texte)) erreurs.push("texte suspect : " + x.texte);
    if (/\s{2,}/.test(x.texte)) erreurs.push("double espace : " + x.texte);
    if (!x.texteOral || x.texteOral.indexOf("{") !== -1) erreurs.push("texteOral invalide");

    const valeurs = typeof x.reponse === "number" ? [x.reponse] : Object.values(x.reponse);
    valeurs.forEach((v) => reponses.push(v));

    if (typeof x.reponse === "number") {
      const plafond = gabarit.plafond || (PLAFONDS[gabarit.ile] || {})[x.mode] || 4000;
      if (x.reponse > plafond) {
        erreurs.push("réponse " + x.reponse + " au-dessus du plafond " + x.mode + " (" + plafond + ")");
      }
    }

    /* La réponse ne doit pas être donnée par l'énoncé. */
    const affiches = nombresAffiches(x);
    const rep = typeof x.reponse === "number" ? [x.reponse] : Object.values(x.reponse);
    rep.forEach((r) => {
      if (affiches.indexOf(r) !== -1) {
        avertissements.push("réponse " + r + " déjà écrite dans l'énoncé (« " + x.texte.slice(0, 60) + "… »)");
      }
    });
  }

  if (instances.length && textes.size < 5) {
    avertissements.push("seulement " + textes.size + " texte(s) différent(s) sur " +
      instances.length + " tirages : le gabarit varie-t-il assez ?");
  }

  return {
    erreurs: [...new Set(erreurs)],
    avertissements: [...new Set(avertissements)],
    instances,
    distincts: textes.size,
    min: reponses.length ? Math.min(...reponses) : null,
    max: reponses.length ? Math.max(...reponses) : null
  };
}

/* ---------- Affichage ---------- */

function pad(s, n) {
  s = String(s);
  return s + " ".repeat(Math.max(0, n - s.length));
}

function main() {
  let Q;
  try {
    Q = charger();
  } catch (e) {
    console.error("✗ " + e.message);
    process.exit(1);
  }

  const structure = Q.validerStructure ? Q.validerStructure() : [];
  const gabarits = Q.tousLesEnonces().filter((g) => !SEULEMENT || g.ile === SEULEMENT);

  console.log("");
  console.log("L'Archipel des Calculs — vérification des énoncés");
  console.log("=".repeat(52));
  console.log("Contenu   : " + Q.ordreIles().length + " îles · " +
    Q.tousLesEnonces().length + " énoncés · " + Q.competences().length + " compétences");
  console.log("Tirages   : " + TIRAGES + " par énoncé (" + (TIRAGES * gabarits.length) + " au total)");
  console.log("");

  if (structure.length) {
    console.log("Structure du contenu");
    structure.forEach((e) => console.log("  ✗ " + e));
    console.log("");
  }

  let totalErreurs = structure.length;
  let totalAvertissements = 0;
  const parIle = {};

  for (const gabarit of gabarits) {
    const r = verifierGabarit(Q, gabarit, TIRAGES);
    totalErreurs += r.erreurs.length;
    totalAvertissements += r.avertissements.length;

    if (!parIle[gabarit.ile]) parIle[gabarit.ile] = { n: 0, erreurs: 0, avert: 0, min: Infinity, max: -Infinity };
    const agg = parIle[gabarit.ile];
    agg.n += 1;
    agg.erreurs += r.erreurs.length;
    agg.avert += r.avertissements.length;
    if (r.min != null) agg.min = Math.min(agg.min, r.min);
    if (r.max != null) agg.max = Math.max(agg.max, r.max);

    if (r.erreurs.length) {
      console.log("✗ " + gabarit.id);
      r.erreurs.slice(0, 5).forEach((e) => console.log("    " + e));
      if (r.erreurs.length > 5) console.log("    … et " + (r.erreurs.length - 5) + " autre(s)");
    }
    if (r.avertissements.length) {
      console.log("! " + gabarit.id);
      r.avertissements.slice(0, 3).forEach((a) => console.log("    " + a));
    }

    if (EXEMPLES > 0) {
      console.log("  " + gabarit.id + " · " + gabarit.competence);
      r.instances.slice(0, EXEMPLES).forEach((x) => {
        const rep = typeof x.reponse === "number"
          ? Q.generateur.formatNombre(x.reponse)
          : Object.keys(x.reponse).map((k) => k + " " + Q.generateur.formatNombre(x.reponse[k])).join(" · ");
        console.log("    « " + x.texte + " »  →  " + rep);
      });
      console.log("");
    }
  }

  console.log("");
  console.log("Par île");
  console.log("-".repeat(52));
  Object.keys(parIle).forEach((ile) => {
    const a = parIle[ile];
    const etat = a.erreurs ? "✗" : a.avert ? "!" : "✓";
    console.log(etat + " " + pad(ile, 16) + pad(a.n + " énoncés", 12) +
      "réponses " + (a.min === Infinity ? "—" : a.min) + " → " +
      (a.max === -Infinity ? "—" : a.max));
  });

  console.log("");
  if (totalErreurs) {
    console.log("Bilan : " + totalErreurs + " erreur(s), " + totalAvertissements + " avertissement(s).");
    process.exit(1);
  }
  console.log("Bilan : 0 erreur, " + totalAvertissements + " avertissement(s). ✓");
  process.exit(0);
}

main();
