/* ============================================================
   competences.js — taxonomie des compétences de calcul (CM1)

   Une compétence est l'unité de révision espacée : c'est elle,
   et non la question, que l'on retrouve des semaines plus tard.
   Les clés suivent le format « opérateur.domaine ».

   Ajouter une compétence = ajouter une ligne ici + l'utiliser
   dans au moins un énoncé. Aucun autre fichier à toucher.
   ============================================================ */
(function (Q) {
  "use strict";

  Q.registerCompetences([

    /* ---------- Addition ---------- */
    { id: "add.dans10", operation: "addition", nom: "Additions jusqu'à 10", exemple: "4 + 5" },
    { id: "add.dans20", operation: "addition", nom: "Additions jusqu'à 20", exemple: "8 + 7" },
    { id: "add.retenue", operation: "addition", nom: "Addition avec retenue", exemple: "34 + 28" },
    { id: "add.strategie", operation: "addition", nom: "Ajouter 9, 11, 19, 21", exemple: "47 + 9" },
    { id: "add.complement", operation: "addition", nom: "Compléments à 100", exemple: "63 + ? = 100" },
    { id: "add.centaines", operation: "addition", nom: "Additions de centaines", exemple: "340 + 270" },
    { id: "add.decimaux", operation: "addition", nom: "Additions de décimaux", exemple: "4,5 + 6,5" },
    { id: "add.deuxEtapes", operation: "addition", nom: "Problème en deux étapes", exemple: "24 + 18, puis + 12" },

    /* ---------- Soustraction ---------- */
    { id: "sub.dans10", operation: "soustraction", nom: "Soustractions jusqu'à 10", exemple: "9 − 4" },
    { id: "sub.dans20", operation: "soustraction", nom: "Soustractions jusqu'à 20", exemple: "15 − 8" },
    { id: "sub.emprunt", operation: "soustraction", nom: "Soustraction avec emprunt", exemple: "42 − 8" },
    { id: "sub.ecart", operation: "soustraction", nom: "Chercher un écart", exemple: "48 pirates et 31 pirates" },
    { id: "sub.complement", operation: "soustraction", nom: "Compléter à 100", exemple: "100 − 63" },
    { id: "sub.centaines", operation: "soustraction", nom: "Soustractions de centaines", exemple: "480 − 290" },
    { id: "sub.monnaie", operation: "soustraction", nom: "Monnaie et rendu", exemple: "il manque 12 pièces" },
    { id: "sub.decimaux", operation: "soustraction", nom: "Soustractions de décimaux", exemple: "8,5 − 3,2" },

    /* ---------- Multiplication ---------- */
    { id: "mul.table-2", operation: "multiplication", nom: "Table de 2 (doubles)", exemple: "7 × 2" },
    { id: "mul.table-3", operation: "multiplication", nom: "Table de 3", exemple: "7 × 3" },
    { id: "mul.table-4", operation: "multiplication", nom: "Table de 4", exemple: "7 × 4" },
    { id: "mul.table-5", operation: "multiplication", nom: "Table de 5", exemple: "7 × 5" },
    { id: "mul.table-6", operation: "multiplication", nom: "Table de 6", exemple: "7 × 6" },
    { id: "mul.table-7", operation: "multiplication", nom: "Table de 7", exemple: "7 × 7" },
    { id: "mul.table-8", operation: "multiplication", nom: "Table de 8", exemple: "7 × 8" },
    { id: "mul.table-9", operation: "multiplication", nom: "Table de 9", exemple: "7 × 9" },
    { id: "mul.table-10", operation: "multiplication", nom: "Table de 10", exemple: "7 × 10" },
    { id: "mul.deuxChiffres", operation: "multiplication", nom: "Deux chiffres × un chiffre", exemple: "24 × 3" },
    { id: "mul.deuxChiffresGrand", operation: "multiplication", nom: "Deux chiffres × un chiffre (plus grand)", exemple: "38 × 4" },
    { id: "mul.aire", operation: "multiplication", nom: "Aire d'un rectangle", exemple: "longueur × largeur" },

    /* ---------- Division ---------- */
    { id: "div.moitie", operation: "division", nom: "Moitié et partage en 2", exemple: "24 ÷ 2" },
    { id: "div.table-5", operation: "division", nom: "Diviser par 5", exemple: "35 ÷ 5" },
    { id: "div.table-10", operation: "division", nom: "Diviser par 10", exemple: "80 ÷ 10" },
    { id: "div.inverse", operation: "division", nom: "Retrouver le nombre de parts", exemple: "24 ÷ ? = 6" },
    { id: "div.reste", operation: "division", nom: "Quotient et reste", exemple: "47 ÷ 5" },
    { id: "div.partage", operation: "division", nom: "Partage équitable", exemple: "48 ÷ 6" }
  ]);
})(window.Quete);
