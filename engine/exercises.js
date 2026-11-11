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

  /* ---------- Reports d'une opération posée ----------

     Addition : la retenue produite par une colonne s'écrit au-dessus
     de la colonne suivante ("1").

     Soustraction (méthode par compensation, celle de l'école) :
     pour 43 − 26, on ajoute 10 au 3 (→ 13) et on compense en ajoutant
     1 au 2 du bas (→ 3). Deux reports par emprunt :
       - "haut" : 1 au-dessus du chiffre du haut (+10)
       - "bas"  : +1 au-dessus du chiffre du bas (+1)

     reports = { haut: [bool par colonne], bas: [bool par colonne] } */
  function reportsPose(q) {
    var a = q.nombres.a;
    var b = q.nombres.b;
    var largeur = Math.max(String(a).length, String(b).length) + 1;
    var haut = [];
    var bas = [];
    for (var i = 0; i < largeur; i++) { haut.push(false); bas.push(false); }

    if (q.operation === "+") {
      var m = retenuesAddition(a, b);
      for (var i2 = 0; i2 < m.length; i2++) {
        if (m[i2] && i2 + 1 < largeur) haut[i2 + 1] = true;
      }
    } else if (q.operation === "−") {
      var e = empruntsSoustraction(a, b);
      for (var i3 = 0; i3 < e.length; i3++) {
        if (!e[i3]) continue;
        haut[i3] = true;
        if (i3 + 1 < largeur) bas[i3 + 1] = true;
      }
    }
    return { haut: haut, bas: bas, largeur: largeur };
  }

  /* Une ligne de cases de report, alignée sur les colonnes. */
  function ligneReports(famille, symbole, pleines, largeur, corrige) {
    var html = '<div class="pose__ligne pose__ligne--reports" aria-label="Reports">' +
      '<span class="pose__op"></span><span class="pose__num">';
    for (var col = largeur - 1; col >= 0; col--) {
      var pleine = !!(pleines && pleines[col]);
      html += '<button type="button" class="pose__case pose__case--' + famille + (pleine ? " pleine" : "") + '"' +
        ' data-marque="' + famille + ":" + col + '" data-symbole="' + Q.ui.echapper(symbole) + '"' +
        ' aria-pressed="' + (pleine ? "true" : "false") + '"' +
        ' aria-label="Report au-dessus de la colonne ' + col + '"' +
        (corrige ? " disabled" : "") + ">" +
        '<span class="pose__bulle"><span class="pose__chiffre">' +
        (pleine ? Q.ui.echapper(symbole) : "") + "</span></span></button>";
    }
    return html + "</span></div>";
  }

  function poseHTML(q, options) {
    options = options || {};
    var a = q.nombres.a;
    var b = q.nombres.b;
    if (typeof a !== "number" || typeof b !== "number") return "";
    var largeur = Math.max(String(a).length, String(b).length) + 1;
    var signe = q.operation || "×";
    var reports = (signe === "+" || signe === "−") ? reportsPose(q) : null;

    function ligne(valeur, classe) {
      var texte = String(valeur);
      while (texte.length < largeur - 1) texte = "\u00a0" + texte;
      return '<div class="pose__ligne ' + (classe || "") + '">' +
        '<span class="pose__op">' + (classe === "pose__ligne--a" ? "\u00a0" : signe) + "</span>" +
        '<span class="pose__num">' + Q.ui.echapper(texte) + "</span></div>";
    }

    var html = '<div class="pose" aria-label="' + Q.ui.echapper(signe + " " + a + " " + b) + '">';
    if (signe === "+") {
      html += ligneReports("haut", "1", reports.haut, largeur, options.corrige);
      html += ligne(a, "pose__ligne--a");
      html += ligne(b);
    } else if (signe === "−") {
      html += ligneReports("haut", "1", reports.haut, largeur, options.corrige);
      html += ligne(a, "pose__ligne--a");
      html += ligneReports("bas", "+1", reports.bas, largeur, options.corrige);
      html += ligne(b);
    } else {
      html += ligne(a, "pose__ligne--a");
      html += ligne(b);
    }
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

    /* Reports attendus, colonne par colonne : retenues en addition,
       emprunts en soustraction (méthode par compensation). */
    reportsPose: reportsPose,

    marquesPose: function (q) {
      if (!q || !q.nombres) return [];
      var a = q.nombres.a;
      var b = q.nombres.b;
      if (typeof a !== "number" || typeof b !== "number") return [];
      if (q.operation === "+") return retenuesAddition(a, b);
      if (q.operation === "−") return empruntsSoustraction(a, b);
      return [];
    },

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
