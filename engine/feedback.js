/* ============================================================
   feedback.js — micro-leçons et encouragements

   Différence majeure avec la conjugaison : on ne peut pas se
   contenter de « la règle ». Il faut montrer LE GESTE.

   Le type d'erreur n'est jamais deviné : en QCM, il est connu par
   construction (on sait quelle famille de leurre a été choisie) ;
   en saisie, il est déduit de l'écart avec la bonne réponse.
   ============================================================ */
(function (Q) {
  "use strict";

  var encouragements = [
    "Bien joué !",
    "C'est juste !",
    "Exactement !",
    "Beau calcul, moussaillon !",
    "Tu as trouvé !",
    "Ça rentre, continue !"
  ];

  /* Types d'erreur — affichés tels quels dans l'espace parent. */
  var TYPES = {
    retenue: "Retenue oubliée ou mal posée",
    emprunt: "Emprunt oublié",
    table: "Table de multiplication",
    dizaine: "Zéro des puissances de 10",
    reste: "Division : quotient et reste",
    sens: "Sens de l'opération",
    inversion: "Ordre des chiffres",
    grandeur: "Ordre de grandeur",
    decompte: "Erreur de comptage",
    calcul: "Erreur de calcul"
  };

  /* Une astuce par compétence : sert d'aide (Tortue Savante) et de
     contenu au carnet de stratégies. */
  var ASTUCES = {
    "add.dans10": "Je pars du plus grand et j'ajoute le reste : 6 + 3, c'est 6, 7, 8, 9.",
    "add.dans20": "Je complète à 10 d'abord : 8 + 5 = 8 + 2 + 3 = 13.",
    "add.retenue": "Quand la somme dépasse 9, j'écris le chiffre des unités et je retiens 1 dizaine.",
    "add.strategie": "Ajouter 9, c'est ajouter 10 et enlever 1. Ajouter 11, c'est ajouter 10 et encore 1.",
    "add.complement": "Pour aller à 100, je monte d'abord à la dizaine, puis à la centaine.",
    "add.centaines": "J'additionne les centaines ensemble, puis les dizaines, puis les unités.",
    "add.decimaux": "J'aligne les virgules, puis j'additionne comme avec des nombres entiers.",
    "add.deuxEtapes": "Je fais les étapes dans l'ordre, et j'écris le résultat intermédiaire.",

    "sub.dans10": "Je compte ce qui reste à partir du plus petit nombre.",
    "sub.dans20": "Je passe par 10 : 15 − 8, c'est 15 − 5 − 3 = 7.",
    "sub.emprunt": "Si le chiffre du haut est trop petit, j'emprunte une dizaine à côté.",
    "sub.ecart": "Un écart, c'est une soustraction : le plus grand moins le plus petit.",
    "sub.complement": "Le complément, c'est ce qu'il manque pour arriver au nombre rond.",
    "sub.centaines": "J'aligne les chiffres et je soustrais colonne par colonne, en partant de la droite.",
    "sub.monnaie": "S'il me manque de l'argent, je soustrais le prix de ce que j'ai.",
    "sub.decimaux": "J'aligne les virgules avant de soustraire.",

    "mul.table-2": "× 2, c'est le double : je double une fois.",
    "mul.table-3": "× 3, c'est le double plus une fois : 7 × 3 = 14 + 7.",
    "mul.table-4": "× 4, c'est deux doubles : 6 × 4 = 12 × 2 = 24.",
    "mul.table-5": "× 5, c'est la moitié de × 10 : 8 × 5 = 80 ÷ 2 = 40.",
    "mul.table-6": "× 6, c'est × 5 plus une fois : 7 × 6 = 35 + 7.",
    "mul.table-7": "× 7, c'est × 5 plus × 2.",
    "mul.table-8": "× 8, c'est trois doubles : 7 × 8 → 14, 28, 56.",
    "mul.table-9": "× 9, c'est × 10 moins une fois : 7 × 9 = 70 − 7.",
    "mul.table-10": "× 10, j'ajoute un zéro.",
    "mul.puissance10": "× 10 : un zéro. × 100 : deux zéros. × 1000 : trois zéros.",
    "mul.deuxChiffres": "Je découpe : 24 × 3, c'est 20 × 3 plus 4 × 3.",
    "mul.aire": "L'aire d'un rectangle, c'est longueur × largeur.",

    "div.moitie": "La moitié, c'est partager en 2 parts égales.",
    "div.table-5": "Diviser par 5, c'est chercher combien de fois 5 tient dedans.",
    "div.table-10": "Diviser par 10, j'enlève un zéro.",
    "div.inverse": "Je cherche combien de fois le diviseur tient dans le nombre.",
    "div.reste": "Je cherche le plus grand multiple du diviseur, puis je compte ce qui reste. Le reste est toujours plus petit que le diviseur.",
    "div.partage": "Partager équitablement, c'est donner la même part à chacun."
  };

  /* Messages d'aide par famille d'erreur : on pointe LE geste, pas
     seulement « c'est faux ». */
  var MESSAGES = {
    retenue: { titre: "Attention à la retenue", texte: "Quand la somme dépasse 9, j'écris le chiffre des unités et je retiens une dizaine." },
    emprunt: { titre: "Attention à l'emprunt", texte: "Le chiffre du haut est trop petit : j'emprunte une dizaine à sa gauche." },
    table: { titre: "C'est une table voisine", texte: "Tu as pris une bande de trop, ou une de moins." },
    dizaine: { titre: "Attention au zéro", texte: "× 10 ajoute un zéro, ÷ 10 en enlève un." },
    sens: { titre: "Relis la question", texte: "Est-ce qu'on ajoute, on enlève, on multiplie ou on partage ?" },
    inversion: { titre: "L'ordre des chiffres", texte: "52 et 25 ne sont pas le même nombre : le chiffre des dizaines compte double." },
    reste: { titre: "Attention au reste", texte: "Le reste doit toujours être plus petit que le diviseur." },
    calcul: { titre: "Presque !", texte: "Refais le calcul doucement, étape par étape." }
  };

  function choisir(liste) {
    return liste[Math.floor(Math.random() * liste.length)];
  }

  Q.feedback = {
    encouragement: function () { return choisir(encouragements); },

    typesErreurs: TYPES,

    astuce: function (competence) {
      return ASTUCES[competence] || "";
    },

    /* Toutes les astuces disponibles (carnet de stratégies). */
    astuces: function () {
      return Object.keys(ASTUCES).map(function (k) { return { competence: k, texte: ASTUCES[k] }; });
    },

    /* Enregistre une erreur. Le type est fourni par le moteur. */
    analyser: function (type) {
      var cle = TYPES[type] ? type : "calcul";
      var e = Q.etat.stats.erreurs || (Q.etat.stats.erreurs = {});
      e[cle] = (e[cle] || 0) + 1;
      return cle;
    },

    /* Devine la famille d'erreur d'une réponse saisie. Sert au pavé
       numérique ; en QCM on connaît déjà la famille du leurre. */
    classifier: function (instance, saisie) {
      if (instance.reponse && typeof instance.reponse === "object") return "reste";

      var attendu = typeof instance.reponse === "number" ? instance.reponse : null;
      var donnee = Q.exercices.normaliser(saisie);
      if (attendu == null || donnee == null) return "calcul";

      var ecart = donnee - attendu;
      var mots = String(instance.texte).toLowerCase();

      if (Math.abs(ecart) === 10 || Math.abs(ecart) === 100) return "retenue";
      if (instance.operation === "×" && Math.abs(ecart) === attendu / 10) return "dizaine";
      if (String(donnee).split("").sort().join("") === String(attendu).split("").sort().join("")) {
        return "inversion";
      }
      if (instance.operation === "−" && donnee === attendu * 2) return "sens";
      if (instance.operation === "−" && donnee === instance.nombres.a + instance.nombres.b) return "sens";
      if (instance.operation === "÷" && Math.abs(ecart) === 1) return "reste";
      if (/\bmanque\b|\breste\b/.test(mots) && ecart > 0 && instance.operation === "−") return "sens";
      return "calcul";
    },

    /* Message d'aide. essai = 1 (il peut réessayer) ou 2 (révélation).
       La famille d'erreur vient du leurre choisi (QCM) ou de l'écart
       avec la bonne réponse (saisie) : on ne devine jamais. */
    aide: function (instance, essai, famille) {
      var astuce = Q.feedback.astuce(instance.competence);
      var type = TYPES[famille] ? famille : "calcul";
      var message = MESSAGES[type] || MESSAGES.calcul;

      if (essai <= 1) {
        return {
          titre: message.titre,
          texte: message.texte,
          regle: astuce || "Décompose le calcul en morceaux plus simples."
        };
      }
      return {
        titre: "La bonne réponse est " + Q.exercices.formatReponse(instance),
        texte: "Refais le calcul avec moi, puis continue.",
        regle: astuce || "Décompose le calcul en morceaux plus simples.",
        famille: type
      };
    },

    succes: function (instance) {
      return {
        titre: Q.feedback.encouragement(),
        texte: "La réponse est " + Q.exercices.formatReponse(instance) + ".",
        regle: Q.feedback.astuce(instance.competence)
      };
    }
  };
})(window.Quete);
