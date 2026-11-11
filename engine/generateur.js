/* ============================================================
   generateur.js — fabrique d'énoncés chiffrés

   Un énoncé n'est pas une question préchargée : c'est un gabarit
   + des bornes. Ce module tire les nombres, vérifie les
   contraintes, calcule la réponse et produit le texte final.

   Mini-langage (volontairement pauvre) :
     nombres.a = { min, max }                     tirage uniforme entier
     nombres.a = { min, max, multipleDe: 0.5 }    pas imposé
     nombres.a = { valeurs: [9, 11, 19] }         choix explicite
     nombres.a = { calc: "q * b + r" }            nombre dérivé
     contraintes = ["a + b <= 100", "retenues(a,b) == 1"]
     enonce = "… {a} … {b|crabe|crabes} …"
     reponse = "a + b"  ou  { quotient: "q", reste: "r" }

   Les contraintes sont évaluées à CHAQUE tirage : un énoncé qui
   produirait 348 + 276 refuse le tirage et recommence.
   ============================================================ */
(function (Q) {
  "use strict";

  var MAX_ESSAIS = 400;
  var MAX_PASSES = 12;
  var cache = {};

  /* ---------- Prédicats numériques ---------- */

  function chiffres(n) {
    return String(Math.abs(Math.round(n))).length;
  }

  /* Nombre de retenues d'une addition, chiffre à chiffre. */
  function retenues(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    var total = 0;
    var reste = 0;
    while (a > 0 || b > 0) {
      var somme = (a % 10) + (b % 10) + reste;
      if (somme >= 10) { total += 1; reste = 1; } else { reste = 0; }
      a = Math.floor(a / 10);
      b = Math.floor(b / 10);
    }
    return total;
  }

  /* Nombre d'emprunts d'une soustraction (a >= b). */
  function emprunts(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    var total = 0;
    var retenue = 0;
    while (a > 0 || b > 0) {
      var da = (a % 10) - retenue;
      var db = b % 10;
      if (da < db) { total += 1; retenue = 1; } else { retenue = 0; }
      a = Math.floor(a / 10);
      b = Math.floor(b / 10);
    }
    return total;
  }

  function multipleDe(a, b) {
    if (!b) return false;
    return Math.abs(a / b - Math.round(a / b)) < 1e-9;
  }

  function estEntier(n) {
    return Math.abs(n - Math.round(n)) < 1e-9;
  }

  function arrondir(n, decimales) {
    var f = Math.pow(10, decimales || 0);
    return Math.round(n * f) / f;
  }

  /* Une formulation différente à chaque passage dans une quête. */
  function choisirVariante(nombre, exclure) {
    if (nombre <= 1) return 0;
    if (Array.isArray(exclure)) {
      var libres = [];
      for (var i = 0; i < nombre; i++) {
        if (exclure.indexOf(i) === -1) libres.push(i);
      }
      if (libres.length) return libres[Math.floor(Math.random() * libres.length)];
    }
    return Math.floor(Math.random() * nombre);
  }

  function decimalesDe(pas) {
    var s = String(pas);
    var i = s.indexOf(".");
    return i === -1 ? 0 : s.length - i - 1;
  }

  var AIDES = {
    retenues: retenues,
    emprunts: emprunts,
    chiffres: chiffres,
    multipleDe: multipleDe,
    estEntier: estEntier,
    abs: Math.abs,
    min: Math.min,
    max: Math.max
  };

  /* ---------- Évaluation d'expression ---------- */

  var NOMS_RESERVES = Object.keys(AIDES).concat(["reponse"]);

  function verifierNom(nom, gabaritId) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(nom)) {
      throw new Error("Énoncé " + gabaritId + " : nom de nombre invalide « " + nom + " »");
    }
    if (NOMS_RESERVES.indexOf(nom) !== -1) {
      throw new Error("Énoncé " + gabaritId + " : « " + nom + " » est un nom réservé");
    }
  }

  /* Compile (et mémorise) une expression en fonction des variables
     du contexte. Aucune dépendance : le contexte est local. */
  function evaluer(expression, contexte, gabaritId) {
    var noms = Object.keys(contexte);
    var cle = noms.join(",") + "|" + expression;
    var f = cache[cle];
    if (!f) {
      var args = noms.concat(Object.keys(AIDES));
      try {
        /* Fonction créée hors mode strict : « new Function » n'hérite
           pas du "use strict" du module appelant. */
        f = Function.apply(null, args.concat(["return (" + expression + ");"]));
      } catch (e) {
        throw new Error("Énoncé " + (gabaritId || "?") + " : expression invalide « " +
          expression + " » (" + e.message + ")");
      }
      cache[cle] = f;
    }
    var valeurs = noms.map(function (n) { return contexte[n]; })
      .concat(Object.keys(AIDES).map(function (n) { return AIDES[n]; }));
    return f.apply(null, valeurs);
  }

  /* ---------- Tirage ---------- */

  function resoudreBorne(valeur, contexte, nom, gabaritId) {
    if (typeof valeur === "number") return valeur;
    if (typeof valeur === "string") return evaluer(valeur, contexte, gabaritId);
    throw new Error("Énoncé " + gabaritId + " : borne manquante pour « " + nom + " »");
  }

  function tirerValeur(spec, min, max, nom, gabaritId) {
    if (spec.valeurs) {
      var choix = spec.valeurs[Math.floor(Math.random() * spec.valeurs.length)];
      if (typeof min === "number" && choix < min) throw new Error("hors borne basse");
      if (typeof max === "number" && choix > max) throw new Error("hors borne haute");
      return arrondir(choix, spec.decimales != null ? spec.decimales : decimalesDe(choix));
    }
    if (typeof min !== "number" || typeof max !== "number") {
      throw new Error("Énoncé " + gabaritId + " : bornes manquantes pour « " + nom + " »");
    }
    var pas = spec.multipleDe || 1;
    var decimales = spec.decimales != null ? spec.decimales : decimalesDe(pas);
    var debut = Math.ceil((min - 1e-9) / pas) * pas;
    var fin = Math.floor((max + 1e-9) / pas) * pas;
    if (fin < debut - 1e-9) {
      throw new Error("Énoncé " + gabaritId + " : aucun multiple de " + pas +
        " entre " + min + " et " + max + " pour « " + nom + " »");
    }
    var creneaux = Math.round((fin - debut) / pas);
    var k = Math.floor(Math.random() * (creneaux + 1));
    return arrondir(debut + k * pas, decimales);
  }

  function resoudre(gabarit) {
    var specs = gabarit.nombres;
    var noms = Object.keys(specs);
    noms.forEach(function (nom) { verifierNom(nom, gabarit.id); });

    var valeurs = {};
    var enAttente = noms.slice();
    var derniereErreur = null;

    for (var passe = 0; passe < MAX_PASSES && enAttente.length; passe++) {
      var suivant = [];
      for (var i = 0; i < enAttente.length; i++) {
        var nom = enAttente[i];
        if (Object.prototype.hasOwnProperty.call(valeurs, nom)) continue;
        var spec = specs[nom];
        try {
          if (spec.calc) {
            valeurs[nom] = evaluer(spec.calc, valeurs, gabarit.id);
          } else {
            var min = spec.min != null ? resoudreBorne(spec.min, valeurs, nom, gabarit.id) : null;
            var max = spec.max != null ? resoudreBorne(spec.max, valeurs, nom, gabarit.id) : null;
            valeurs[nom] = tirerValeur(spec, min, max, nom, gabarit.id);
          }
        } catch (e) {
          derniereErreur = e;
          suivant.push(nom);
        }
      }
      enAttente = suivant;
    }

    if (enAttente.length) {
      throw new Error("Énoncé " + gabarit.id + " : nombres non résolus (" +
        enAttente.join(", ") + ")" + (derniereErreur ? " — " + derniereErreur.message : ""));
    }
    return valeurs;
  }

  function calculerReponse(spec, valeurs, gabaritId) {
    if (typeof spec === "string") return evaluer(spec, valeurs, gabaritId);
    if (spec && typeof spec === "object") {
      var out = {};
      Object.keys(spec).forEach(function (k) {
        out[k] = evaluer(spec[k], valeurs, gabaritId);
      });
      return out;
    }
    throw new Error("Énoncé " + gabaritId + " : réponse invalide");
  }

  function verifierContraintes(gabarit, contexte) {
    var liste = gabarit.contraintes || [];
    for (var i = 0; i < liste.length; i++) {
      if (!evaluer(liste[i], contexte, gabarit.id)) return false;
    }
    return true;
  }

  function reponseValide(gabarit, rep) {
    var decimales = gabarit.decimales || 0;
    var f = Math.pow(10, decimales);

    function ok(n) {
      if (typeof n !== "number" || !isFinite(n)) return false;
      if (n < 0 || n > 100000) return false;
      return Math.abs(n * f - Math.round(n * f)) < 1e-6;
    }

    if (typeof rep === "number") return ok(rep);
    var cles = Object.keys(rep);
    if (!cles.length) return false;
    return cles.every(function (k) { return ok(rep[k]); });
  }

  /* ---------- Mise en texte ---------- */

  function formatNombre(n) {
    if (typeof n !== "number") return String(n);
    var negatif = n < 0;
    var abs = Math.abs(n);
    var entier = Math.floor(abs + 1e-9);
    var frac = Math.round((abs - entier) * 10) / 10;
    var s = String(entier).replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
    if (frac > 0) s += "," + String(Math.round(frac * 10));
    return (negatif ? "-" : "") + s;
  }

  /* {a} → « 47 » · {a|crabe|crabes} → « 1 crabe » / « 4 crabes » */
  function rendre(texte, valeurs, gabaritId) {
    return String(texte).replace(/\{([a-zA-Z_][a-zA-Z0-9_]*)(?:\|([^}|]*)\|([^}]*))?\}/g,
      function (tout, nom, singulier, pluriel) {
        if (!Object.prototype.hasOwnProperty.call(valeurs, nom)) {
          throw new Error("Énoncé " + gabaritId + " : « {" + nom + "} » absent des nombres");
        }
        var v = valeurs[nom];
        if (singulier != null) {
          var mot = Math.abs(v) >= 2 ? pluriel : singulier;
          return formatNombre(v) + (mot ? " " + mot : "");
        }
        return formatNombre(v);
      });
  }

  var ORAL = {
    "+": "plus",
    "−": "moins",
    "-": "moins",
    "×": "fois",
    "÷": "divisé par"
  };

  function oral(texte) {
    return String(texte).split(/\s+/).map(function (mot) {
      return ORAL[mot] || mot;
    }).join(" ");
  }

  /* ---------- API ---------- */

  Q.generateur = {
    retenues: retenues,
    emprunts: emprunts,
    chiffres: chiffres,
    formatNombre: formatNombre,
    rendre: rendre,

    /* Tire un tirage valide, ou explique pourquoi c'est impossible.
       options.exclure = indices de formulations déjà utilisées. */
    tirer: function (gabarit, options) {
      if (!gabarit || !gabarit.id) throw new Error("Gabarit invalide");

      var modeles = Array.isArray(gabarit.enonces) && gabarit.enonces.length
        ? gabarit.enonces
        : [gabarit.enonce];
      var variante = choisirVariante(modeles.length, options && options.exclure);

      for (var essai = 0; essai < MAX_ESSAIS; essai++) {
        var valeurs = resoudre(gabarit);
        var reponse = calculerReponse(gabarit.reponse, valeurs, gabarit.id);
        var contexte = Object.assign({}, valeurs);
        if (typeof reponse === "number") contexte.reponse = reponse;

        if (!verifierContraintes(gabarit, contexte)) continue;
        if (!reponseValide(gabarit, reponse)) continue;

        var texte = rendre(modeles[variante], valeurs, gabarit.id);
        return {
          gabaritId: gabarit.id,
          variante: variante,
          modele: modeles[variante],
          ile: gabarit.ile,
          niveau: gabarit.niveau,
          competence: gabarit.competence,
          difficulte: gabarit.difficulte || 1,
          mode: gabarit.mode || "tete",
          nombres: Object.assign({}, valeurs),
          texte: texte,
          texteOral: oral(texte),
          consigne: gabarit.consigne || "",
          operation: gabarit.operation,
          reponse: reponse,
          champs: gabarit.champs || null,
          labels: gabarit.labels || null,
          unite: gabarit.unite || "",
          lecon: gabarit.lecon || "",
          decimales: gabarit.decimales || 0
        };
      }

      throw new Error("Énoncé « " + gabarit.id + " » : aucun tirage valide après " +
        MAX_ESSAIS + " essais. Les contraintes sont probablement trop strictes.");
    },

    /* Tire N fois : sert au linter et au banc d'essai. */
    tirerPlusieurs: function (gabarit, n) {
      var instances = [];
      var erreurs = [];
      for (var i = 0; i < (n || 10); i++) {
        try { instances.push(Q.generateur.tirer(gabarit)); }
        catch (e) { erreurs.push(e.message); break; }
      }
      return { instances: instances, erreurs: erreurs };
    },

    /* Statistiques sur N tirages : bornes réelles, variété, échecs. */
    stats: function (gabarit, n) {
      n = n || 100;
      var instances = [];
      var erreurs = [];
      for (var i = 0; i < n; i++) {
        try { instances.push(Q.generateur.tirer(gabarit)); }
        catch (e) {
          erreurs.push(e.message);
          break;
        }
      }
      var textes = {};
      var valeurs = [];
      instances.forEach(function (x) {
        textes[x.texte] = true;
        if (typeof x.reponse === "number") valeurs.push(x.reponse);
        else Object.keys(x.reponse).forEach(function (k) { valeurs.push(x.reponse[k]); });
      });
      return {
        demandes: n,
        reussis: instances.length,
        distincts: Object.keys(textes).length,
        min: valeurs.length ? Math.min.apply(null, valeurs) : null,
        max: valeurs.length ? Math.max.apply(null, valeurs) : null,
        erreurs: erreurs,
        instances: instances
      };
    }
  };
})(window.Quete);
