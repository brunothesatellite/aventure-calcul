/* Île 2 — LA SOUSTRACTION */
(function (Q) {
  Q.registerIle({
    id: "soustraction",
    operation: "soustraction",
    signe: "−",
    nom: "Le Gouffre des Disparus",
    sousTitre: "Ce qui part laisse une trace",
    description: "Un gouffre avale les nombres. Compte vite ce qui reste avant qu'il ne soit trop tard.",
    fond: "assets/img/worlds/vallee-souvenirs.svg",
    accent: "#0e7490",
    intro: "Le Gouffre aspire tout ce qui traîne. La Sangsue du Gouffre y compte ses proies : à toi de compter ce qui reste.",
    niveaux: [
      { id: "soustraction-1", titre: "Les Crabes qui Partent", groupe: "Soustractions jusqu'à 10", competences: ["sub.dans10", "sub.dans20"], difficulte: 1 },
      { id: "soustraction-2", titre: "La Noix de Coco", groupe: "Soustraction avec emprunt", competences: ["sub.emprunt"], difficulte: 2 },
      { id: "soustraction-3", titre: "Le Trésor Entamé", groupe: "Écarts et compléments", competences: ["sub.ecart", "sub.complement", "sub.centaines"], difficulte: 2 },
      { id: "soustraction-4", titre: "La Monnaie du Marchand", groupe: "Monnaie et décimaux", competences: ["sub.monnaie", "sub.decimaux"], difficulte: 3 }
    ],
    gardien: {
      nom: "La Sangsue du Gouffre",
      description: "Elle aspire les nombres un par un. Il faut lui répondre avant qu'il ne reste rien.",
      icone: "vagues",
      questions: 8
    },
    recompense: { pointe: "soustraction", badge: "pointe-soustraction" }
  });
})(window.Quete);
