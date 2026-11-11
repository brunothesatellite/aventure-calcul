/* ============================================================
   srs.js — répétition espacée (boîtes de Leitner)

   Une carte = une COMPÉTENCE, pas une question. C'est le point
   clé du passage à un contenu généré : les questions sont
   infinies, les compétences sont finies (~34).

   Intervalles : J+1, J+3, J+7, J+21.
   ============================================================ */
(function (Q) {
  "use strict";

  var JOUR = 86400000;
  var INTERVALLES = [0, 1, 3, 7, 21]; /* en jours, par boîte 0 → 4 */

  function carte(k) {
    if (!Q.etat.srs[k]) Q.etat.srs[k] = { boite: 0, du: 0, vus: 0, reussites: 0, echecs: 0 };
    return Q.etat.srs[k];
  }

  function operationDe(cle) {
    var c = Q.competence ? Q.competence(cle) : null;
    return c ? c.operation : null;
  }

  Q.srs = {
    /* Enregistre un passage. « reussi » = du premier coup. */
    enregistrer: function (competence, reussi) {
      if (!competence) return null;
      var c = carte(competence);
      c.vus += 1;
      if (reussi) {
        c.reussites += 1;
        c.boite = Math.min(4, c.boite + 1);
        c.du = Date.now() + INTERVALLES[c.boite] * JOUR;
      } else {
        c.echecs += 1;
        c.boite = Math.max(0, c.boite - 1);
        c.du = Date.now() + JOUR * 0.5;
      }
      return c;
    },

    /* Compétences à revoir. On filtre par île (opération) pour ne
       jamais réviser une division avant d'avoir ouvert le port. */
    dues: function (limite, ileId) {
      var maintenant = Date.now();
      var liste = Object.keys(Q.etat.srs)
        .filter(function (k) {
          var c = Q.etat.srs[k];
          if (!c || c.du > maintenant) return false;
          if (!Q.competence(k)) return false;
          if (!ileId) return true;
          return operationDe(k) === ileId;
        })
        .map(function (k) { return { cle: k, carte: Q.etat.srs[k] }; })
        .sort(function (a, b) { return a.carte.du - b.carte.du; });
      return limite ? liste.slice(0, limite) : liste;
    },

    stats: function () {
      var cles = Object.keys(Q.etat.srs).filter(function (k) { return !!Q.competence(k); });
      var solides = cles.filter(function (k) { return Q.etat.srs[k].boite >= 3; }).length;
      var aRevoir = cles.filter(function (k) { return Q.etat.srs[k].du <= Date.now(); }).length;
      return { total: cles.length, solides: solides, aRevoir: aRevoir };
    },

    /* Indicateur de maîtrise 0 → 1 pour une opération. */
    maitrise: function (operation) {
      var cles = Object.keys(Q.etat.srs).filter(function (k) {
        return operationDe(k) === operation;
      });
      if (!cles.length) return 0;
      var somme = cles.reduce(function (t, k) { return t + Q.etat.srs[k].boite; }, 0);
      return somme / (cles.length * 4);
    },

    /* Combien de compétences solides pour une opération donnée. */
    solidesDe: function (operation) {
      return Object.keys(Q.etat.srs).filter(function (k) {
        return operationDe(k) === operation && Q.etat.srs[k].boite >= 3;
      }).length;
    },

    /* État d'une compétence précise (utilisé par l'atelier et le carnet). */
    etat: function (competence) {
      return Q.etat.srs[competence] || null;
    }
  };
})(window.Quete);
