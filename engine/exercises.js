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
    if (q.mode === "potence") return "potence";
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

  /* Reports d'une opération posée.

     Addition : la retenue produite par une colonne s'écrit au-dessus
     de la colonne suivante (1).

     Soustraction (méthode par compensation, celle de l'école) :
     pour 43 − 26, on ajoute 10 au 3 (→ 13) et on compense en ajoutant
     1 au 2 du bas (→ 3). Deux reports par emprunt :
       - "haut" : 1 au-dessus du chiffre du haut (+10)
       - "bas"  : +1 au-dessus du chiffre du bas (+1)

     Multiplication : la retenue d'une colonne monte au-dessus de la
     suivante, et sa valeur peut dépasser 1 (47 × 3 → retenue 2).

     reports = { haut: [valeur par colonne], bas: [valeur par colonne] }
     valeur 0 = aucune case. */
  function reportsPose(q) {
    var a = q.nombres.a;
    var b = q.nombres.b;
    var largeur = Math.max(String(a).length, String(b).length) + 1;
    var haut = [];
    var bas = [];
    for (var i = 0; i < largeur; i++) { haut.push(0); bas.push(0); }

    if (q.operation === "+") {
      var m = retenuesAddition(a, b);
      for (var i2 = 0; i2 < m.length; i2++) {
        if (m[i2] && i2 + 1 < largeur) haut[i2 + 1] = 1;
      }
    } else if (q.operation === "−") {
      var e = empruntsSoustraction(a, b);
      for (var i3 = 0; i3 < e.length; i3++) {
        if (!e[i3]) continue;
        haut[i3] = 1;
        if (i3 + 1 < largeur) bas[i3 + 1] = 1;
      }
    } else if (q.operation === "×" && String(b).length === 1) {
      /* Multiplication par un nombre à un chiffre : la retenue monte
         d'une colonne et peut valoir plusieurs unités. */
      var da = chiffresDe(a);
      var report = 0;
      for (var i4 = 0; i4 < da.length; i4++) {
        var produit = da[i4] * b + report;
        report = Math.floor(produit / 10);
        if (report && i4 + 1 < largeur) haut[i4 + 1] = report;
      }
    }
    return { haut: haut, bas: bas, largeur: largeur };
  }

  /* Une ligne de cases de report, alignée sur les colonnes.
     cycleMax = 1 : la case vaut 0 ou 1. cycleMax = 9 : elle monte
     jusqu'à 9 en tapant plusieurs fois (retenue de multiplication). */
  function ligneReports(famille, valeurs, largeur, corrige, cycleMax) {
    var html = '<div class="pose__ligne pose__ligne--reports" aria-label="Reports">' +
      '<span class="pose__op"></span><span class="pose__num">';
    for (var col = largeur - 1; col >= 0; col--) {
      var valeur = (valeurs && valeurs[col]) || 0;
      var pleine = valeur > 0;
      var texte = famille === "bas" ? "+1" : String(valeur);
      html += '<button type="button" class="pose__case pose__case--' + famille + (pleine ? " pleine" : "") + '"' +
        ' data-marque="' + famille + ":" + col + '"' +
        ' data-valeur="' + valeur + '" data-cycle="' + (cycleMax || 1) + '"' +
        ' aria-pressed="' + (pleine ? "true" : "false") + '"' +
        ' aria-label="Report au-dessus de la colonne ' + col + '"' +
        (corrige ? " disabled" : "") + ">" +
        '<span class="pose__bulle"><span class="pose__chiffre">' + (pleine ? texte : "") +
        "</span></span></button>";
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
    var reports = (signe === "+" || signe === "−" || signe === "×") ? reportsPose(q) : null;

    function ligne(valeur, classe) {
      var texte = String(valeur);
      while (texte.length < largeur - 1) texte = "\u00a0" + texte;
      return '<div class="pose__ligne ' + (classe || "") + '">' +
        '<span class="pose__op">' + (classe === "pose__ligne--a" ? "\u00a0" : signe) + "</span>" +
        '<span class="pose__num">' + Q.ui.echapper(texte) + "</span></div>";
    }

    var html = '<div class="pose" aria-label="' + Q.ui.echapper(signe + " " + a + " " + b) + '">';
    if (signe === "+") {
      html += ligneReports("haut", reports.haut, largeur, options.corrige, 1);
      html += ligne(a, "pose__ligne--a");
      html += ligne(b);
    } else if (signe === "−") {
      html += ligneReports("haut", reports.haut, largeur, options.corrige, 1);
      html += ligne(a, "pose__ligne--a");
      html += ligneReports("bas", reports.bas, largeur, options.corrige, 1);
      html += ligne(b);
    } else if (signe === "×") {
      html += ligneReports("haut", reports.haut, largeur, options.corrige, 9);
      html += ligne(a, "pose__ligne--a");
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

  /* ---------- Division posée (potence) ----------

     Une étape par chiffre du dividende : on prend le reste, on y
     descend le chiffre suivant, on cherche combien de fois le
     diviseur tient dedans (chiffre du quotient), on écrit le produit
     puis on soustrait. Les chiffres descendus restent affichés à
     côté de la différence, exactement comme sur le cahier. */

  function etapesDivision(a, b) {
    var chiffres = String(a).split("").map(Number);
    var n = chiffres.length;
    var reste = 0;
    var steps = [];
    var quotient = "";
    for (var i = 0; i < n; i++) {
      var valeur = reste * 10 + chiffres[i];
      var qd = Math.floor(valeur / b);
      var produit = qd * b;
      var difference = valeur - produit;
      steps.push({
        index: i,
        position: n - 1 - i,
        chiffre: chiffres[i],
        valeur: valeur,
        quotient: qd,
        produit: produit,
        difference: difference
      });
      quotient += String(qd);
      reste = difference;
    }
    var premier = 0;
    while (premier < steps.length && steps[premier].quotient === 0) premier += 1;
    return {
      dividende: a,
      diviseur: b,
      chiffres: chiffres,
      steps: steps,
      premier: premier,
      quotient: quotient.replace(/^0+/, "") || "0",
      reste: reste
    };
  }

  /* Grille de la potence. Chaque case modifiable porte sa valeur
     attendue (data-attendu) et son rang de saisie (data-ordre), pour
     que l'interface puisse guider l'enfant sans recalculer. */
  function potenceHTML(q, options) {
    options = options || {};
    var a = q.nombres.a;
    var b = q.nombres.b;
    if (typeof a !== "number" || typeof b !== "number" || !b) return "";
    var m = etapesDivision(a, b);
    var n = m.chiffres.length;
    var corrige = !!options.corrige;
    var etapes = m.steps.slice(m.premier);

    /* Ordre de saisie : quotient, produit, différence, étape par étape. */
    var ordre = {};
    var compte = 0;
    function noter(role, etape, pos) {
      ordre[role + ":" + etape + ":" + pos] = compte;
      compte += 1;
    }
    etapes.forEach(function (s) {
      noter("quotient", s.index, 0);
      if (s.quotient === 0) return;
      var p = String(s.produit);
      for (var j = 0; j < p.length; j++) {
        noter("produit", s.index, s.position + (p.length - 1 - j));
      }
      var d = String(s.difference);
      for (var k = 0; k < d.length; k++) {
        noter("difference", s.index, s.position + (d.length - 1 - k));
      }
    });

    var morceaux = [];
    function colDe(pos) { return n + 1 - pos; }

    function chiffre(valeur, r, pos, descendu) {
      morceaux.push('<span class="potence__chiffre' +
        (descendu ? " potence__chiffre--descendu" : "") +
        '" style="grid-row:' + r + ';grid-column:' + colDe(pos) + '">' + valeur + "</span>");
    }

    function boite(role, s, pos, valeur, r) {
      var cle = role + ":" + s.index + ":" + pos;
      var nom = role === "produit" ? "Produit" : "Différence";
      morceaux.push('<button type="button" class="potence__case' +
        (corrige ? " potence__case--corrigee" : "") +
        '" data-role="' + role + '" data-etape="' + s.index + '" data-pos="' + pos +
        '" data-attendu="' + valeur + '" data-ordre="' + ordre[cle] + '"' +
        ' style="grid-row:' + r + ';grid-column:' + colDe(pos) + '"' +
        ' aria-label="' + nom + ' de l\'étape ' + (s.index + 1) + '"' +
        (corrige ? " disabled" : "") + ">" + (corrige ? String(valeur) : "") + "</button>");
    }

    function signe(texte, r, col) {
      morceaux.push('<span class="potence__signe" style="grid-row:' + r +
        ';grid-column:' + Math.max(1, col) + '">' + texte + "</span>");
    }

    function trait(r, gauche, largeur) {
      morceaux.push('<span class="potence__trait" style="grid-row:' + r +
        ';grid-column:' + gauche + " / span " + largeur + '"></span>');
    }

    var r = 1;
    m.chiffres.forEach(function (d, i) {
      chiffre(d, r, n - 1 - i, false);
    });
    r += 1;

    var i2 = m.premier;
    while (i2 < n) {
      var s = m.steps[i2];
      var prod = String(s.produit);
      signe("−", r, colDe(s.position + prod.length - 1) - 1);
      for (var j2 = 0; j2 < prod.length; j2++) {
        var posP = s.position + (prod.length - 1 - j2);
        boite("produit", s, posP, Number(prod[j2]), r);
      }
      r += 1;
      trait(r, colDe(s.position + prod.length - 1), prod.length);
      r += 1;

      var diff = String(s.difference);
      for (var k2 = 0; k2 < diff.length; k2++) {
        var posD = s.position + (diff.length - 1 - k2);
        boite("difference", s, posD, Number(diff[k2]), r);
      }
      /* Les chiffres suivants « descendent » sur cette même ligne. */
      var j3 = i2 + 1;
      while (j3 < n) {
        var suivant = m.steps[j3];
        chiffre(suivant.chiffre, r, suivant.position, true);
        if (suivant.quotient > 0) break;
        j3 += 1;
      }
      r += 1;
      i2 = j3;
    }

    var quotientHTML = etapes.map(function (s) {
      return '<button type="button" class="potence__case potence__case--quotient' +
        (corrige ? " potence__case--corrigee" : "") +
        '" data-role="quotient" data-etape="' + s.index + '" data-pos="0"' +
        ' data-attendu="' + s.quotient + '" data-ordre="' + ordre["quotient:" + s.index + ":0"] + '"' +
        ' aria-label="Chiffre du quotient" ' + (corrige ? "disabled" : "") + ">" +
        (corrige ? String(s.quotient) : "") + "</button>";
    }).join("");

    return '<div class="potence" role="group" aria-label="' +
      Q.ui.echapper(a + " divisé par " + b) + '">' +
      '<div class="potence__gauche">' +
        '<div class="potence__grille" style="grid-template-columns:1.1em repeat(' +
          n + ',1.35em)">' + morceaux.join("") + "</div>" +
      "</div>" +
      '<div class="potence__droite">' +
        '<div class="potence__diviseur">' + b + "</div>" +
        '<div class="potence__trait-droit"></div>' +
        '<div class="potence__quotient">' + quotientHTML + "</div>" +
      "</div>" +
    "</div>";
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
      /* La potence porte ses propres cases : pas de champ global. */
      if (q.type === "potence") {
        q.champs = null;
        q.labels = null;
      }
      return q;
    },

    formatReponse: formatReponse,
    reponseCourte: reponseCourte,
    normaliser: normaliser,
    decomposition: decomposition,
    poseHTML: poseHTML,
    etapesDivision: etapesDivision,
    potenceHTML: potenceHTML,

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
