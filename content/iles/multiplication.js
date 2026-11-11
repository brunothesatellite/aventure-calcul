/* Île 3 — LA MULTIPLICATION
   Niveaux 1-2 : les TABLES (2 à 10), en histoires.
   Niveaux 3-4 : des CALCULS à deux chiffres × un chiffre, en pavé
   ou en colonnes. Jamais de deux chiffres × deux chiffres. */
(function (Q) {
  Q.registerIle({
    id: "multiplication",
    operation: "multiplication",
    signe: "×",
    nom: "La Jungle des Multiples",
    sousTitre: "Tout se multiplie",
    description: "Les lianes se dédoublent, les singes arrivent par bandes. Ici, rien ne reste jamais seul.",
    fond: "assets/img/worlds/ile-present.svg",
    accent: "#15803d",
    intro: "Dans la jungle, chaque bande de singes en cache une autre. Le Poulpe Multiplieur compte avec ses huit bras.",
    niveaux: [
      { id: "multiplication-1", titre: "Les Bandes de Singes", groupe: "Tables de 2, 3, 4, 5 et 10", competences: ["mul.table-2", "mul.table-3", "mul.table-4", "mul.table-5", "mul.table-10"], difficulte: 1 },
      { id: "multiplication-2", titre: "La Canopée", groupe: "Tables de 6, 7, 8 et 9", competences: ["mul.table-6", "mul.table-7", "mul.table-8", "mul.table-9"], difficulte: 2 },
      { id: "multiplication-3", titre: "Le Chantier des Pirogues", groupe: "Deux chiffres × un chiffre", competences: ["mul.deuxChiffres"], difficulte: 2 },
      { id: "multiplication-4", titre: "Le Comptoir des Pirogues", groupe: "Deux chiffres × un chiffre, et aires", competences: ["mul.deuxChiffresGrand", "mul.aire"], difficulte: 3 }
    ],
    gardien: {
      nom: "Le Poulpe Multiplieur",
      description: "Huit bras, huit fois plus de calculs. Il ne laisse jamais passer une erreur de table.",
      icone: "kraken",
      questions: 8
    },
    recompense: { pointe: "multiplication", badge: "pointe-multiplication" }
  });
})(window.Quete);
