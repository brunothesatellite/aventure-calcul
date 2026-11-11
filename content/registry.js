/* ============================================================
   registry.js — registre de contenu de « L'Archipel des Calculs »

   Tout le contenu (compétences, énoncés, îles, progression) passe
   par ce registre. Ajouter du contenu = ajouter un fichier JS et
   une balise <script> dans index.html. Aucun import, aucun build.

   Différence clé avec « La Quête des Verbes » : un énoncé n'est
   pas une phrase à trou, c'est un GABARIT. Les nombres sont tirés
   au moment de la quête (engine/generateur.js).
   ============================================================ */
(function (global) {
  "use strict";

  var Q = (global.Quete = global.Quete || {});

  var content = (Q.content = Q.content || {
    competences: {},
    enonces: [],
    iles: {},
    curriculum: null
  });

  /* ---------- Enregistrement ---------- */

  Q.registerCompetences = function (liste) {
    if (!Array.isArray(liste)) throw new Error("registerCompetences attend un tableau");
    liste.forEach(function (c) {
      if (!c || !c.id) throw new Error("Compétence sans id");
      if (content.competences[c.id]) throw new Error("Compétence déjà enregistrée : " + c.id);
      content.competences[c.id] = c;
    });
  };

  /* Valide le strict minimum à l'enregistrement : un énoncé mal
     formé doit hurler tout de suite, pas au milieu d'une quête. */
  Q.registerEnonces = function (liste) {
    if (!Array.isArray(liste)) throw new Error("registerEnonces attend un tableau");
    liste.forEach(function (g) {
      if (!g || !g.id) throw new Error("Énoncé sans id");
      if (!g.ile) throw new Error("Énoncé " + g.id + " : ile manquante");
      if (!g.reponse) throw new Error("Énoncé " + g.id + " : reponse manquante");
      var variantes = Array.isArray(g.enonces) && g.enonces.length ? g.enonces : [g.enonce];
      if (!variantes.length || !variantes[0]) {
        throw new Error("Énoncé " + g.id + " : aucune formulation");
      }
      variantes.forEach(function (v) {
        if (!v || String(v).indexOf("{") === -1) {
          throw new Error("Énoncé " + g.id + " : une formulation ne contient aucun nombre à tirer");
        }
      });
      if (!g.nombres || !Object.keys(g.nombres).length) {
        throw new Error("Énoncé " + g.id + " : nombres manquants");
      }
      var dejaVu = content.enonces.some(function (x) { return x.id === g.id; });
      if (dejaVu) throw new Error("Énoncé déjà enregistré : " + g.id);
      content.enonces.push(g);
    });
  };

  Q.registerIle = function (ile) {
    if (!ile || !ile.id) throw new Error("Île invalide");
    if (content.iles[ile.id]) throw new Error("Île déjà enregistrée : " + ile.id);
    if (!ile.niveaux || ile.niveaux.length !== 4) {
      throw new Error("Île " + ile.id + " : il faut exactement 4 niveaux");
    }
    content.iles[ile.id] = ile;
  };

  Q.registerCurriculum = function (curriculum) {
    content.curriculum = curriculum;
  };

  /* ---------- Accès ---------- */

  Q.ile = function (id) {
    return content.iles[id] || null;
  };

  Q.competence = function (id) {
    return content.competences[id] || null;
  };

  Q.competences = function () {
    return Object.keys(content.competences).map(function (id) { return content.competences[id]; });
  };

  Q.competencesDeLOperation = function (operation) {
    return Q.competences().filter(function (c) { return c.operation === operation; });
  };

  Q.tousLesEnonces = function () {
    return content.enonces.slice();
  };

  Q.enonce = function (id) {
    return content.enonces.filter(function (g) { return g.id === id; })[0] || null;
  };

  Q.enoncesDeLIle = function (ileId) {
    return content.enonces.filter(function (g) { return g.ile === ileId; });
  };

  /* Le numéro de niveau (1 à 4) est porté par l'énoncé.
     L'identifiant de niveau de l'île est « <ile>-<n> ». */
  Q.enoncesDuNiveau = function (ileId, niveauId) {
    var numero = Q.numeroDeNiveau(niveauId);
    if (!numero) return [];
    return content.enonces.filter(function (g) {
      return g.ile === ileId && g.niveau === numero;
    });
  };

  Q.numeroDeNiveau = function (niveauId) {
    var m = String(niveauId || "").match(/-(\d)$/);
    return m ? parseInt(m[1], 10) : 0;
  };

  Q.niveau = function (ileId, niveauId) {
    var ile = Q.ile(ileId);
    if (!ile) return null;
    return ile.niveaux.filter(function (n) { return n.id === niveauId; })[0] || null;
  };

  Q.curriculum = function () {
    return content.curriculum || { ordre: [], prerequisIle: 6 };
  };

  Q.ordreIles = function () {
    return Q.curriculum().ordre.map(function (id) { return Q.ile(id); }).filter(Boolean);
  };

  Q.ileParOperation = function (operation) {
    var liste = Q.ordreIles();
    for (var i = 0; i < liste.length; i++) if (liste[i].operation === operation) return liste[i];
    return null;
  };

  /* Toutes les compétences d'une île, dans l'ordre des niveaux. */
  Q.competencesDeLIle = function (ileId) {
    var ile = Q.ile(ileId);
    if (!ile) return [];
    var vues = {};
    var out = [];
    ile.niveaux.forEach(function (n) {
      (n.competences || []).forEach(function (id) {
        if (!vues[id] && content.competences[id]) {
          vues[id] = true;
          out.push(content.competences[id]);
        }
      });
    });
    return out;
  };

  /* ---------- Validation structurelle ----------
     Utilisée par tools/lint-enonces.js. Ne vérifie que les
     références ; les tirages sont testés séparément. */

  Q.validerStructure = function () {
    var erreurs = [];
    var ordre = Q.curriculum().ordre || [];

    if (ordre.length !== 4) erreurs.push("curriculum : il faut 4 îles, trouvé " + ordre.length);

    ordre.forEach(function (id) {
      if (!content.iles[id]) erreurs.push("curriculum : île inconnue " + id);
    });

    Object.keys(content.iles).forEach(function (id) {
      var ile = content.iles[id];
      if (ordre.indexOf(id) === -1) erreurs.push("Île " + id + " absente du curriculum");
      if (ile.operation !== id) erreurs.push("Île " + id + " : operation « " + ile.operation + " » incohérente");
      if (!ile.gardien || !ile.gardien.nom) erreurs.push("Île " + id + " : gardien manquant");
      if (!ile.recompense || !ile.recompense.pointe) erreurs.push("Île " + id + " : récompense manquante");
      if (!Q.enoncesDeLIle(id).length) erreurs.push("Île " + id + " : aucun énoncé");

      ile.niveaux.forEach(function (n, i) {
        if (n.id !== id + "-" + (i + 1)) {
          erreurs.push("Niveau " + n.id + " : identifiant attendu « " + id + "-" + (i + 1) + " »");
        }
        if (!n.competences || !n.competences.length) {
          erreurs.push("Niveau " + n.id + " : aucune compétence");
        }
        (n.competences || []).forEach(function (c) {
          if (!content.competences[c]) erreurs.push("Niveau " + n.id + " : compétence inconnue " + c);
          else if (content.competences[c].operation !== ile.operation) {
            erreurs.push("Niveau " + n.id + " : compétence " + c + " d'une autre opération");
          }
        });
        if (!Q.enoncesDuNiveau(id, n.id).length) {
          erreurs.push("Niveau " + n.id + " : aucun énoncé");
        }
      });
    });

    content.enonces.forEach(function (g) {
      if (!content.iles[g.ile]) erreurs.push("Énoncé " + g.id + " : île inconnue " + g.ile);
      if (!(g.niveau >= 1 && g.niveau <= 4)) {
        erreurs.push("Énoncé " + g.id + " : niveau invalide (" + g.niveau + ")");
      }
      if (!content.competences[g.competence]) {
        erreurs.push("Énoncé " + g.id + " : compétence inconnue " + g.competence);
      } else if (content.competences[g.competence].operation !== g.ile) {
        erreurs.push("Énoncé " + g.id + " : compétence " + g.competence + " hors de l'île " + g.ile);
      }
      if (g.mode && g.mode !== "tete" && g.mode !== "pose" && g.mode !== "potence") {
        erreurs.push("Énoncé " + g.id + " : mode inconnu " + g.mode);
      }
      /* Un gabarit doit être rattaché à une compétence de son niveau. */
      var niveau = Q.niveau(g.ile, g.ile + "-" + g.niveau);
      if (niveau && niveau.competences && niveau.competences.indexOf(g.competence) === -1) {
        erreurs.push("Énoncé " + g.id + " : compétence " + g.competence +
          " absente du niveau " + niveau.id);
      }
    });

    return erreurs;
  };
})(typeof window !== "undefined" ? window : globalThis);
