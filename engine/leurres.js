/* ============================================================
   leurres.js — fabrication des mauvais choix

   Un leurre n'est jamais un nombre au hasard : il vient d'une
   ERREUR D'ENFANT réelle (retenue oubliée, table voisine, chiffres
   inversés…). Deux conséquences :
   - un enfant ne peut pas éliminer les réponses « à la taille » ;
   - le type d'erreur est connu par construction, donc le tableau
     de bord parent devient un vrai diagnostic.
   ============================================================ */
(function (Q) {
  "use strict";

  function estEntier(n) {
    return typeof n === "number" && Math.abs(n - Math.round(n)) < 1e-9;
  }

  /* Un leurre doit rester crédible : même ordre de grandeur. */
  function plausible(valeur, bonne) {
    if (!estEntier(valeur) || valeur <= 0 || valeur === bonne) return false;
    var ecart = Math.abs(valeur - bonne);
    if (bonne < 10) return ecart <= 4;
    if (bonne < 100) return ecart <= Math.max(9, Math.round(bonne * 0.35));
    return ecart <= Math.max(30, Math.round(bonne * 0.25));
  }

  function inverser(n) {
    var s = String(Math.abs(Math.round(n)));
    if (s.length < 2) return null;
    var t = s.split("").reverse().join("");
    if (t.charAt(0) === "0") return null;
    return Number(t);
  }

  /* Toutes les erreurs plausibles pour une question donnée. */
  function candidats(q) {
    var r = q.reponse;
    var n = q.nombres || {};
    var a = n.a;
    var b = n.b;
    var out = [];
    var valeurs = {};

    function ajouter(famille, valeur) {
      if (valeur == null || !plausible(valeur, r)) return;
      if (valeurs[valeur]) return;
      valeurs[valeur] = true;
      out.push({ valeur: valeur, famille: famille });
    }

    /* Écarts fins, disponibles partout. */
    ajouter("calcul", r + 1);
    ajouter("calcul", r - 1);
    ajouter("calcul", r + 2);
    ajouter("calcul", r - 2);
    ajouter("dizaine", r + 10);
    ajouter("dizaine", r - 10);
    if (r >= 100) {
      ajouter("dizaine", r + 100);
      ajouter("dizaine", r - 100);
    }
    ajouter("inversion", inverser(r));

    if (q.operation === "+" && typeof a === "number" && typeof b === "number") {
      if (Q.generateur.retenues(a, b) > 0) {
        ajouter("retenue", r - 10);
        ajouter("retenue", r + 10);
      }
      if (a > b) ajouter("sens", a - b);
    }

    if (q.operation === "−" && typeof a === "number" && typeof b === "number") {
      if (Q.generateur.emprunts(Math.max(a, b), Math.min(a, b)) > 0) {
        ajouter("emprunt", r + 10);
      }
      ajouter("sens", a + b);
      if (b > a) ajouter("sens", b - a);
    }

    if (q.operation === "×" && typeof a === "number" && typeof b === "number") {
      /* Le leurre le plus utile : une bande de trop ou de moins. */
      ajouter("table", r + b);
      ajouter("table", r - b);
      ajouter("table", r + a);
      ajouter("table", r - a);
      ajouter("sens", a + b);
      if (b === 10 || b === 100) {
        ajouter("dizaine", r * 10);
        ajouter("dizaine", r / 10);
      }
    }

    if (q.operation === "÷") {
      ajouter("table", r + 1);
      ajouter("table", r - 1);
      ajouter("reste", r + 1);
      if (typeof a === "number" && typeof b === "number" && b > 1) ajouter("sens", a * b);
      if (b === 10) ajouter("dizaine", r * 10);
    }

    return out;
  }

  /* Deux leurres de familles différentes, pondérés par les erreurs
     déjà commises par l'enfant. */
  function choisir(liste, n) {
    var parFamille = {};
    liste.forEach(function (c) {
      if (!parFamille[c.famille]) parFamille[c.famille] = [];
      parFamille[c.famille].push(c);
    });

    var familles = Object.keys(parFamille);
    var prises = {};
    var sortie = [];
    var valeurs = {};

    while (sortie.length < n && familles.length) {
      var total = 0;
      var dispo = [];
      familles.forEach(function (f) {
        if (prises[f]) return;
        var erreurs = ((Q.etat.stats || {}).erreurs || {})[f] || 0;
        var poids = 1 + Math.min(6, erreurs);
        dispo.push({ famille: f, poids: poids });
        total += poids;
      });
      if (!total) break;

      var tirage = Math.random() * total;
      var choix = dispo[dispo.length - 1].famille;
      for (var i = 0; i < dispo.length; i++) {
        if (tirage < dispo[i].poids) { choix = dispo[i].famille; break; }
        tirage -= dispo[i].poids;
      }

      prises[choix] = true;
      var pool = parFamille[choix].filter(function (c) { return !valeurs[c.valeur]; });
      if (!pool.length) continue;
      var c = pool[Math.floor(Math.random() * pool.length)];
      valeurs[c.valeur] = true;
      sortie.push(c);
    }

    /* Pas assez de familles : on complète avec d'autres valeurs. */
    if (sortie.length < n) {
      var reste = liste.slice();
      for (var k = reste.length - 1; k > 0; k--) {
        var j = Math.floor(Math.random() * (k + 1));
        var tmp = reste[k]; reste[k] = reste[j]; reste[j] = tmp;
      }
      reste.forEach(function (c) {
        if (sortie.length >= n || valeurs[c.valeur]) return;
        valeurs[c.valeur] = true;
        sortie.push(c);
      });
    }

    return sortie;
  }

  Q.leurres = {
    /* q = instance générée (réponse numérique). */
    pour: function (q, nombre) {
      if (!q || typeof q.reponse !== "number") return [];
      var liste = candidats(q);
      if (!liste.length) return [];
      return choisir(liste, nombre || 2);
    },

    /* Retrouve la famille d'un choix déjà proposé (QCM). */
    familleDe: function (options, valeur) {
      for (var i = 0; i < (options || []).length; i++) {
        if (options[i].valeur === valeur) return options[i].famille;
      }
      return "calcul";
    }
  };
})(window.Quete);
