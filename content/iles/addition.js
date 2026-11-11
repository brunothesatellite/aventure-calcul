/* Île 1 — L'ADDITION */
(function (Q) {
  Q.registerIle({
    id: "addition",
    operation: "addition",
    signe: "+",
    nom: "La Crique des Coffres",
    sousTitre: "Ici, tout s'ajoute",
    description: "Des coffres pleins de coquillages, de pièces et de biscuits. À chaque pas, on en trouve encore.",
    fond: "assets/img/worlds/crique-exploits.svg",
    accent: "#b45309",
    intro: "Bienvenue dans la crique ! Le Crabe Accumulateur empile tout ce qu'il trouve. Compte plus vite que lui.",
    niveaux: [
      { id: "addition-1", titre: "Les Coquillages", groupe: "Additions jusqu'à 10 et 20", competences: ["add.dans10", "add.dans20"], difficulte: 1 },
      { id: "addition-2", titre: "Le Sac de Pièces", groupe: "Addition avec retenue", competences: ["add.retenue"], difficulte: 2 },
      { id: "addition-3", titre: "Le Grand Coffre", groupe: "Ajouter 9, 11, 19 ; compléments à 100", competences: ["add.strategie", "add.centaines", "add.complement"], difficulte: 2 },
      { id: "addition-4", titre: "Le Butin des Équipages", groupe: "Décimaux et deux étapes", competences: ["add.decimaux", "add.deuxEtapes"], difficulte: 3 }
    ],
    gardien: {
      nom: "Le Crabe Accumulateur",
      description: "Il empile tout, même ce qui ne va pas ensemble.",
      icone: "crabe",
      questions: 8
    },
    recompense: { pointe: "addition", badge: "pointe-addition" }
  });
})(window.Quete);
