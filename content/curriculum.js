/* ============================================================
   curriculum.js — l'ordre pédagogique, les prérequis et les rangs.
   C'est LE fichier à modifier pour changer la progression,
   sans toucher au moteur ni aux contenus.
   ============================================================ */
(function (Q) {
  Q.registerCurriculum({
    /* Ordre des îles sur la carte : une par opération */
    ordre: ["addition", "soustraction", "multiplication", "division"],

    /* Nombre d'étoiles d'une île pour débloquer la suivante (sur 12).
       6/12 est volontairement permissif : un enfant qui bloque sur une
       opération ne doit pas être muré dans l'archipel. */
    prerequisIle: 6,

    /* Une île est « conquise » quand ses 4 niveaux ont au moins 1 étoile */
    etoilesParNiveau: 3,

    /* Rangs du moussaillon, du plus petit au plus grand (seuil = or gagné) */
    rangs: [
      { id: "moussaillon", nom: "Moussaillon", seuil: 0 },
      { id: "matelot", nom: "Matelot", seuil: 60 },
      { id: "quartier-maitre", nom: "Quartier-maître", seuil: 150 },
      { id: "pilote", nom: "Pilote", seuil: 280 },
      { id: "capitaine", nom: "Capitaine", seuil: 450 },
      { id: "amiral", nom: "Amiral des Nombres", seuil: 650 }
    ],

    /* Seuils des étoiles d'une quête (sur 8 questions) */
    seuilsEtoiles: { deux: 7, trois: 8 },

    /* Taille d'une quête */
    questionsParQuete: 8,
    revuesParQuete: 2
  });
})(window.Quete);
