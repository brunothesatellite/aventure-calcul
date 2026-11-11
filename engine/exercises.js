/* ============================================================
   exercises.js — fabrique de questions

   Un gabarit → une question répondable :
     qcm     3 choix (niveaux 1-2)
     saisie  pavé numérique (niveaux 3-4), 2 champs pour la division
     pose    opération en colonnes (gabarits mode « pose »)
   ============================================================ */
(function (Q) {
  "use strict";

  function melanger(tab) {
    var a = tab.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function typeDe(q) {
    if (q.mode === "pose") return "pose";
    if (q.reponse && typeof q.reponse === "object") return "saisie";
    if (q.niveau >= 3) return "saisie";
    return "qcm";
  }

  /* ---------- Mise en forme des réponses ---------- */

  function formatReponse(instance) {
    var r = instance && instance.reponse;
    if (r == null) return "";
    if (typeof r === "number") {
      return Q.generateur.formatNombre(r) + (instance.unite ? " " + instance.unite : "");
    }
    if (r.quotient != null && r.reste != null) {
      return Q.generateur.formatNombre(r.quotient) + " et il reste " +
        Q.generateur.formatNombre(r.reste);
    }
    return Object.keys(r).map(function (k) {
      return k + " " + Q.generateur.formatNombre(r[k]);
    }).join(", ");
  }

  function reponseCourte(instance) {
    var r = instance && instance.reponse;
    if (typeof r === "number") return Q.generateur.formatNombre(r);
    if (r && r.quotient != null && r.reste != null) {
      return Q.generateur.formatNombre(r.quotient) + " r " + Q.generateur.formatNombre(r.reste);
    }
    return formatReponse(instance);
  }

  /* ---------- Saisie ---------- */

  function normaliser(valeur) {
    if (valeur == null) return null;
    var s = String(valeur).replace(/\s|\u202f/g, "").replace(",", ".");
    if (s === "" || s === "." || s === "-") return null;
    if (!/^-?\d*\.?\d*$/.test(s)) return null;
    var n = Number(s);
    return isNaN(n) ? null : n;
  }

  function egales(a, b) {
    if (a == null || b == null) return false;
    return Math.abs(a - b) < 1e-9;
  }

  /* ---------- Décomposition (aide du Crabe Compteur) ---------- */

  function decomposition(q) {
    var n = q.nombres || {};
    var a = n.a;
    var b = n.b;
    var c = n.c;
    var r = q.reponse;

    if (r && typeof r === "object" && r.quotient != null) {
      return "Je cherche combien de fois " + b + " tient dans " + a + " : " +
        b + " × " + r.quotient + " = " + (b * r.quotient) + ", et il reste " + r.reste + ".";
    }
    if (typeof r !== "number") return Q.feedback.astuce(q.competence);

    /* Trois termes : on montre les deux étapes. */
    if (q.operation === "+" && typeof c === "number") {
      return "Je fais deux étapes : " + a + " + " + b + " = " + (a + b) +
        ", puis " + (a + b) + " + " + c + " = " + r + ".";
    }

    if (q.operation === "+" && a >= 10 && b >= 10) {
      var da = Math.floor(a / 10) * 10;
      var ua = a % 10;
      var db = Math.floor(b / 10) * 10;
      var ub = b % 10;
      return "Je sépare les dizaines et les unités : " + da + " + " + db + " = " + (da + db) +
        ", puis " + ua + " + " + ub + " = " + (ua + ub) + ". Total : " + r + ".";
    }
    if (q.operation === "−" && b > a && r === b - a) {
      return "Je cherche ce qui manque : de " + a + " pour aller à " + b + ", il manque " + r + ".";
    }
    if (q.operation === "×" && a >= 10 && typeof b === "number") {
      var d = Math.floor(a / 10) * 10;
      var u = a % 10;
      return "Je découpe " + a + " : " + d + " × " + b + " = " + (d * b) +
        ", puis " + u + " × " + b + " = " + (u * b) + ". Total : " + r + ".";
    }
    if (q.operation === "÷" && typeof b === "number") {
      return "Je cherche combien de fois " + b + " tient dans " + a + " : " +
        b + " × " + r + " = " + (b * r) + ".";
    }
    /* Table simple : l'astuce de la compétence est plus utile qu'un calcul. */
    return Q.feedback.astuce(q.competence) ||
      "Décompose le calcul en morceaux plus simples.";
  }

  /* ---------- Calcul posé ---------- */

  function chiffresDe(n) {
    return String(Math.abs(Math.round(n))).split("").map(Number).reverse();
  }

  function retenuesAddition(a, b) {
    var da = chiffresDe(a);
    var db = chiffresDe(b);
    var n = Math.max(da.length, db.length);
    var sortie = [];
    var reste = 0;
    for (var i = 0; i < n; i++) {
      var somme = (da[i] || 0) + (db[i] || 0) + reste;
      sortie.push(somme >= 10 ? 1 : 0);
      reste = somme >= 10 ? 1 : 0;
    }
    if (reste) sortie.push(1);
    return sortie;
  }

  function empruntsSoustraction(a, b) {
    var da = chiffresDe(a);
    var db = chiffresDe(b);
    var n = Math.max(da.length, db.length);
    var sortie = [];
    var retenue = 0;
    for (var i = 0; i < n; i++) {
      var haut = (da[i] || 0) - retenue;
      var bas = db[i] || 0;
      if (haut < bas) { sortie.push(1); retenue = 1; }
      else { sortie.push(0); retenue = 0; }
    }
    return sortie;
  }

  /* Ligne de retenues (ou d'emprunts) alignée à droite. */
  function ligneMarques(marques, largeur) {
    var cases = [];
    for (var i = 0; i < largeur; i++) cases.push(" ");
    /* marques[i] = retenue produite par la colonne i → au-dessus de i+1 */
    marques.forEach(function (m, i) {
      if (!m) return;
      var pos = largeur - 2 - i;
      if (pos >= 0) cases[pos] = "1";
    });
    return cases.join("");
  }

  function poseHTML(q, options) {
    options = options || {};
    var a = q.nombres.a;
    var b = q.nombres.b;
    if (typeof a !== "number" || typeof b !== "number") return "";
    var largeur = Math.max(String(a).length, String(b).length) + 1;
    var signe = q.operation || "×";
    var marques = "";

    if (options.corrige) {
      if (signe === "+") marques = ligneMarques(retenuesAddition(a, b), largeur);
      if (signe === "−") marques = ligneMarques(empruntsSoustraction(a, b), largeur);
    }

    function ligne(valeur, classe) {
      var texte = String(valeur);
      while (texte.length < largeur - 1) texte = "\u00a0" + texte;
      return '<div class="pose__ligne ' + (classe || "") + '">' +
        '<span class="pose__op">' + (classe === "pose__ligne--a" ? "\u00a0" : signe) + "</span>" +
        '<span class="pose__num">' + Q.ui.echapper(texte) + "</span></div>";
    }

    var html = '<div class="pose" aria-label="' + Q.ui.echapper(signe + " " + a + " " + b) + '">';
    if (marques) {
      html += '<div class="pose__ligne pose__ligne--marques"><span class="pose__op"></span>' +
        '<span class="pose__num">' + Q.ui.echapper(marques) + "</span></div>";
    }
    html += ligne(a, "pose__ligne--a");
    html += ligne(b);
    html += '<div class="pose__regle"></div>';
    html += options.corrige
      ? ligne(Q.generateur.formatNombre(q.reponse), "pose__ligne--res")
      : '<div class="pose__ligne pose__ligne--res"><span class="pose__op"></span>' +
        '<span class="pose__num pose__num--vide" id="pose-resultat">?</span></div>';
    return html + "</div>";
  }

  /* ---------- API ---------- */

  Q.exercices = {
    construire: function (gabarit, options) {
      var q = Q.generateur.tirer(gabarit, options);
      q.essais = 0;
      q.termine = false;
      q.reussi = false;
      q.type = typeDe(q);

      if (q.type === "qcm") {
        var mauvais = Q.leurres.pour(q, 2);
        if (mauvais.length < 2) {
          q.type = "saisie";
        } else {
          q.options = melanger(
            [{ valeur: q.reponse, famille: "bonne" }].concat(mauvais)
          );
        }
      }
      if (q.type === "saisie" && q.reponse && typeof q.reponse === "object") {
        q.champs = Object.keys(q.reponse);
      }
      return q;
    },

    formatReponse: formatReponse,
    reponseCourte: reponseCourte,
    normaliser: normaliser,
    decomposition: decomposition,
    poseHTML: poseHTML,

    /* Compare une réponse saisie à la bonne réponse. */
    verifier: function (q, saisie) {
      if (q.reponse && typeof q.reponse === "object") {
        var ok = true;
        Object.keys(q.reponse).forEach(function (k) {
          if (!egales(normaliser(saisie && saisie[k]), q.reponse[k])) ok = false;
        });
        return ok;
      }
      return egales(normaliser(saisie), q.reponse);
    },

    /* Nombre de chiffres utiles du résultat : sert à dimensionner
       la zone de saisie sans révéler sa longueur. */
    largeurSaisie: function (q) {
      var n = q.nombres || {};
      var a = typeof n.a === "number" ? String(n.a).length : 3;
      var b = typeof n.b === "number" ? String(n.b).length : 1;
      return Math.max(a, b) + 2;
    }
  };
})(window.Quete);
