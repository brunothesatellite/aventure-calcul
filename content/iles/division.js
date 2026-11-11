/* Île 4 — LA DIVISION */
(function (Q) {
  Q.registerIle({
    id: "division",
    operation: "division",
    signe: "÷",
    nom: "Le Port du Partage",
    sousTitre: "Une part pour chacun",
    description: "Au port, tout se partage : le butin, les boulets, les places dans les barques. Rien ne doit rester.",
    fond: "assets/img/worlds/ocean-propheties.svg",
    accent: "#b91c1c",
    intro: "Le Kraken Partageur règne sur le port. Il répartit tout équitablement… et il vérifie chaque reste.",
    niveaux: [
      { id: "division-1", titre: "Le Partage des Coquillages", groupe: "Moitié et division par 10", competences: ["div.moitie", "div.table-10"], difficulte: 1 },
      { id: "division-2", titre: "Les Bandes Égales", groupe: "Retrouver le nombre de parts", competences: ["div.inverse", "div.table-5"], difficulte: 2 },
      { id: "division-3", titre: "Les Caisses de Boulets", groupe: "Quotient et reste", competences: ["div.reste"], difficulte: 3 },
      { id: "division-4", titre: "L'Équipage à Répartir", groupe: "Partage équitable", competences: ["div.partage"], difficulte: 3 }
    ],
    gardien: {
      nom: "Le Kraken Partageur",
      description: "Il partage tout en parts égales. Ce qui reste, il le garde.",
      icone: "barque",
      questions: 8
    },
    recompense: { pointe: "division", badge: "pointe-division" }
  });
})(window.Quete);
