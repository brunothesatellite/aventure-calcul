/* ============================================================
   Énoncés — MULTIPLICATION (île « La Jungle des Multiples »)

   Niveaux 1-2 : les TABLES de 2 à 10, en histoires.
   Niveaux 3-4 : deux chiffres × un chiffre, en pavé ou en colonnes.
   Jamais deux chiffres × deux chiffres.

   Chaque gabarit propose plusieurs FORMULATIONS (`enonces`) :
   le moteur en choisit une différente à chaque passage dans une
   même quête, pour ne pas revoir huit fois la même histoire.
   ============================================================ */
(function (Q) {
  Q.registerEnonces([

    /* ---------- Niveau 1 : tables de 2, 3, 4, 5, 10 ---------- */

    {
      id: "mul-doubles-01",
      ile: "multiplication",
      niveau: 1,
      competence: "mul.table-2",
      difficulte: 1,
      nombres: { a: { min: 4, max: 25 } },
      contraintes: ["a * 2 <= 50"],
      enonces: [
        "Malo a {a} pièces d'or. Le capitaine en a le double. Combien de pièces le capitaine a-t-il ?",
        "Chaque pirate a {a} coquillages. Son perroquet en a le double. Combien le perroquet en a-t-il ?",
        "Une caisse pèse {a} kg. Un sac pèse le double. Combien pèse le sac ?"
      ],
      operation: "×",
      reponse: "a * 2",
      lecon: "table"
    },

    {
      id: "mul-table3-02",
      ile: "multiplication",
      niveau: 1,
      competence: "mul.table-3",
      difficulte: 1,
      nombres: { a: { min: 2, max: 9 } },
      contraintes: ["a * 3 <= 27"],
      enonces: [
        "{a} bandes de singes traversent la jungle. Chaque bande compte 3 singes. Combien de singes en tout ?",
        "{a} pirates ont chacun 3 perroquets sur l'épaule. Combien de perroquets en tout ?",
        "{a} coffres contiennent chacun 3 pièces d'or. Combien de pièces y a-t-il ?"
      ],
      operation: "×",
      reponse: "a * 3",
      lecon: "table"
    },

    {
      id: "mul-table4-03",
      ile: "multiplication",
      niveau: 1,
      competence: "mul.table-4",
      difficulte: 1,
      nombres: { a: { min: 2, max: 9 } },
      contraintes: ["a * 4 <= 36"],
      enonces: [
        "{a} pirogues ont chacune 4 places. Combien de places y a-t-il en tout ?",
        "{a} tables ont 4 pieds chacune. Combien de pieds en tout ?",
        "{a} voiliers ont chacun 4 voiles. Combien de voiles en tout ?"
      ],
      operation: "×",
      reponse: "a * 4",
      lecon: "table"
    },

    {
      id: "mul-table5-04",
      ile: "multiplication",
      niveau: 1,
      competence: "mul.table-5",
      difficulte: 1,
      nombres: { a: { min: 2, max: 9 } },
      contraintes: ["a * 5 <= 45"],
      enonces: [
        "Il y a {a} coffres et, dans chacun, 5 pièces d'or. Combien de pièces y a-t-il en tout ?",
        "{a} sacs contiennent chacun 5 noix de coco. Combien de noix y a-t-il ?",
        "Chaque main a 5 doigts. Il y a {a} mains. Combien de doigts en tout ?"
      ],
      operation: "×",
      reponse: "a * 5",
      lecon: "table"
    },

    {
      id: "mul-table10-05",
      ile: "multiplication",
      niveau: 1,
      competence: "mul.table-10",
      difficulte: 1,
      nombres: { a: { min: 2, max: 10 } },
      contraintes: ["a * 10 <= 100"],
      enonces: [
        "Le marchand vend {a} coquillages à 10 pièces chacun. Combien reçoit-il de pièces ?",
        "{a} pirates reçoivent chacun 10 pièces. Combien de pièces ont-ils en tout ?",
        "Chaque coffre contient 10 pièces. Il y a {a} coffres. Combien de pièces y a-t-il ?"
      ],
      operation: "×",
      reponse: "a * 10",
      unite: "pièces",
      lecon: "dizaine"
    },

    /* ---------- Niveau 2 : tables de 6, 7, 8, 9 ---------- */

    {
      id: "mul-table6-06",
      ile: "multiplication",
      niveau: 2,
      competence: "mul.table-6",
      difficulte: 2,
      nombres: { a: { min: 2, max: 9 } },
      contraintes: ["a * 6 <= 54"],
      enonces: [
        "{a} boîtes contiennent 6 biscuits chacune. Combien de biscuits en tout ?",
        "Chaque dé a 6 faces. Il y a {a} dés. Combien de faces en tout ?",
        "{a} filets contiennent 6 poissons chacun. Combien de poissons en tout ?"
      ],
      operation: "×",
      reponse: "a * 6",
      lecon: "table"
    },

    {
      id: "mul-table7-07",
      ile: "multiplication",
      niveau: 2,
      competence: "mul.table-7",
      difficulte: 2,
      nombres: { a: { min: 2, max: 9 } },
      contraintes: ["a * 7 <= 63"],
      enonces: [
        "{a} coffres contiennent 7 pièces chacun. Combien de pièces en tout ?",
        "Chaque semaine a 7 jours. Combien de jours y a-t-il en {a} semaines ?",
        "{a} pirates portent chacun 7 boulets. Combien de boulets portent-ils ?"
      ],
      operation: "×",
      reponse: "a * 7",
      lecon: "table"
    },

    {
      id: "mul-table8-08",
      ile: "multiplication",
      niveau: 2,
      competence: "mul.table-8",
      difficulte: 2,
      nombres: { a: { min: 2, max: 9 } },
      contraintes: ["a * 8 <= 72"],
      enonces: [
        "{a} voiliers ont chacun 8 voiles. Combien de voiles en tout ?",
        "Chaque poulpe a 8 bras. Il y a {a} poulpes. Combien de bras en tout ?",
        "{a} caisses contiennent 8 boulets chacune. Combien de boulets en tout ?"
      ],
      operation: "×",
      reponse: "a * 8",
      lecon: "table"
    },

    {
      id: "mul-table9-09",
      ile: "multiplication",
      niveau: 2,
      competence: "mul.table-9",
      difficulte: 2,
      nombres: { a: { min: 2, max: 9 } },
      contraintes: ["a * 9 <= 81"],
      enonces: [
        "Chaque pirate rapporte 9 étoiles de mer. Il y a {a} pirates. Combien d'étoiles ont-ils ramassées ?",
        "{a} coffres contiennent 9 pièces chacun. Combien de pièces en tout ?",
        "{a} bandes de 9 crabes traversent la plage. Combien de crabes en tout ?"
      ],
      operation: "×",
      reponse: "a * 9",
      lecon: "table"
    },

    /* ---------- Niveau 3 : deux chiffres × un chiffre, faciles ---------- */

    {
      id: "mul-2chiffres-10",
      ile: "multiplication",
      niveau: 3,
      competence: "mul.deuxChiffres",
      difficulte: 2,
      nombres: {
        a: { min: 12, max: 25 },
        b: { min: 2, max: 4 }
      },
      contraintes: ["a * b <= 100"],
      enonces: [
        "{a} caisses pèsent {b} kg chacune. Combien pèsent-elles en tout ?",
        "{a} pirogues transportent {b} pirates chacune. Combien de pirates en tout ?",
        "{a} étagères portent {b} coffres chacune. Combien de coffres en tout ?"
      ],
      operation: "×",
      reponse: "a * b",
      lecon: "table"
    },

    {
      id: "mul-calcul-11",
      ile: "multiplication",
      niveau: 3,
      competence: "mul.deuxChiffres",
      difficulte: 2,
      nombres: {
        a: { min: 12, max: 25 },
        b: { min: 2, max: 4 }
      },
      contraintes: ["a * b <= 100"],
      enonces: [
        "{a} × {b}",
        "Combien font {a} × {b} ?",
        "Calcule : {a} × {b}."
      ],
      operation: "×",
      reponse: "a * b",
      lecon: "table"
    },

    /* ---------- Niveau 4 : plus grand, et aires ---------- */

    {
      id: "mul-comptoir-12",
      ile: "multiplication",
      niveau: 4,
      competence: "mul.deuxChiffresGrand",
      difficulte: 3,
      nombres: {
        a: { min: 13, max: 48 },
        b: { min: 2, max: 5 }
      },
      contraintes: ["a * b <= 200"],
      enonces: [
        "{a} pirogues ont {b} places chacune. Combien de places y a-t-il en tout ?",
        "{a} caisses contiennent {b} boulets chacune. Combien de boulets en tout ?",
        "{a} pirates portent {b} sacs chacun. Combien de sacs portent-ils ?"
      ],
      operation: "×",
      reponse: "a * b",
      lecon: "table"
    },

    {
      id: "mul-pose-13",
      ile: "multiplication",
      niveau: 4,
      competence: "mul.deuxChiffresGrand",
      difficulte: 3,
      mode: "pose",
      nombres: {
        a: { min: 13, max: 48 },
        b: { min: 2, max: 5 }
      },
      contraintes: ["a * b <= 200", "b >= 2"],
      enonce: "{a} × {b}",
      consigne: "Pose la multiplication en colonnes, puis écris le résultat.",
      operation: "×",
      reponse: "a * b",
      lecon: "table"
    },

    {
      id: "mul-aire-14",
      ile: "multiplication",
      niveau: 4,
      competence: "mul.aire",
      difficulte: 3,
      nombres: {
        a: { min: 3, max: 9 },
        b: { min: 3, max: 9 }
      },
      contraintes: ["a * b <= 81"],
      enonces: [
        "Le pont de la pirogue est un rectangle de {a} m de long et de {b} m de large. Pour calculer son aire, on multiplie la longueur par la largeur. Quelle est l'aire du pont ?",
        "Une voile rectangulaire mesure {a} m de long et {b} m de large. Pour trouver son aire, on multiplie la longueur par la largeur. Quelle est son aire ?",
        "Le jardin du capitaine est un rectangle de {a} m sur {b} m. Pour calculer une aire, on multiplie la longueur par la largeur. Quelle est l'aire du jardin ?"
      ],
      operation: "×",
      reponse: "a * b",
      unite: "m²",
      lecon: "table"
    },

    /* ===== Niveau 1 (suite) : tables 2, 3, 4, 5, 10 ===== */

    {
      id: "mul-paires-15",
      ile: "multiplication",
      niveau: 1,
      competence: "mul.table-2",
      difficulte: 1,
      nombres: { a: { min: 3, max: 9 } },
      contraintes: ["a * 2 <= 18"],
      enonces: [
        "{a} paires de bottes sont rangées. Combien de bottes y a-t-il ?",
        "Malo compte {a} paires de gants. Combien de gants a-t-il ?",
        "Il y a {a} paires de chaussettes. Combien de chaussettes en tout ?"
      ],
      operation: "×",
      reponse: "a * 2",
      unite: "bottes",
      lecon: "table"
    },

    {
      id: "mul-tricycles-16",
      ile: "multiplication",
      niveau: 1,
      competence: "mul.table-3",
      difficulte: 1,
      nombres: { a: { min: 2, max: 9 } },
      contraintes: ["a * 3 <= 27"],
      enonces: [
        "{a} tricycles ont 3 roues chacun. Combien de roues y a-t-il ?",
        "Il y a {a} tricycles dans la cour. Combien de roues en tout ?",
        "Le chantier a {a} tricycles. Chacun a 3 roues. Combien de roues ?"
      ],
      operation: "×",
      reponse: "a * 3",
      unite: "roues",
      lecon: "table"
    },

    {
      id: "mul-pattes-17",
      ile: "multiplication",
      niveau: 1,
      competence: "mul.table-4",
      difficulte: 1,
      nombres: { a: { min: 2, max: 9 } },
      contraintes: ["a * 4 <= 36"],
      enonces: [
        "{a} chiens ont 4 pattes chacun. Combien de pattes y a-t-il ?",
        "Il y a {a} chiens sur le port. Chacun a 4 pattes. Combien de pattes ?",
        "Malo compte {a} chaises à 4 pieds. Combien de pieds en tout ?"
      ],
      operation: "×",
      reponse: "a * 4",
      unite: "pattes",
      lecon: "table"
    },

    {
      id: "mul-sachets-18",
      ile: "multiplication",
      niveau: 1,
      competence: "mul.table-5",
      difficulte: 1,
      nombres: { a: { min: 2, max: 9 } },
      contraintes: ["a * 5 <= 45"],
      enonces: [
        "{a} sachets contiennent 5 bonbons chacun. Combien de bonbons en tout ?",
        "Il y a {a} sachets de 5 bonbons. Combien de bonbons y a-t-il ?",
        "Le marchand vend {a} sachets de 5 billes. Combien de billes vend-il ?"
      ],
      operation: "×",
      reponse: "a * 5",
      unite: "bonbons",
      lecon: "table"
    },

    {
      id: "mul-bouquets-19",
      ile: "multiplication",
      niveau: 1,
      competence: "mul.table-5",
      difficulte: 1,
      nombres: { a: { min: 2, max: 9 } },
      contraintes: ["a * 5 <= 45"],
      enonces: [
        "{a} bouquets de 5 fleurs. Combien de fleurs en tout ?",
        "Le fleuriste prépare {a} bouquets de 5 fleurs. Combien de fleurs utilise-t-il ?",
        "Il y a {a} bouquets de 5 fleurs sur la table. Combien de fleurs ?"
      ],
      operation: "×",
      reponse: "a * 5",
      unite: "fleurs",
      lecon: "table"
    },

    {
      id: "mul-clous-20",
      ile: "multiplication",
      niveau: 1,
      competence: "mul.table-10",
      difficulte: 1,
      nombres: { a: { min: 2, max: 10 } },
      contraintes: ["a * 10 <= 100"],
      enonces: [
        "{a} boîtes contiennent 10 clous chacune. Combien de clous en tout ?",
        "Le menuisier a {a} boîtes de 10 clous. Combien de clous a-t-il ?",
        "Il y a {a} boîtes de 10 clous. Combien de clous en tout ?"
      ],
      operation: "×",
      reponse: "a * 10",
      unite: "clous",
      lecon: "dizaine"
    },

    {
      id: "mul-dizaines-21",
      ile: "multiplication",
      niveau: 1,
      competence: "mul.table-10",
      difficulte: 1,
      nombres: { a: { min: 2, max: 10 } },
      contraintes: ["a * 10 <= 100"],
      enonces: [
        "Il y a {a} dizaines de boulets. Combien de boulets en tout ?",
        "Le tonneau contient {a} dizaines de boulets. Combien de boulets ?",
        "Malo compte {a} dizaines de pièces. Combien de pièces a-t-il ?"
      ],
      operation: "×",
      reponse: "a * 10",
      unite: "boulets",
      lecon: "dizaine"
    },

    /* ===== Niveau 2 (suite) : tables 6, 7, 8, 9 ===== */

    {
      id: "mul-cartes-22",
      ile: "multiplication",
      niveau: 2,
      competence: "mul.table-6",
      difficulte: 2,
      nombres: { a: { min: 2, max: 9 } },
      contraintes: ["a * 6 <= 54"],
      enonces: [
        "{a} paquets de 6 cartes. Combien de cartes en tout ?",
        "Il y a {a} paquets de 6 cartes à jouer. Combien de cartes ?",
        "Malo range {a} paquets de 6 cartes. Combien de cartes range-t-il ?"
      ],
      operation: "×",
      reponse: "a * 6",
      unite: "cartes",
      lecon: "table"
    },

    {
      id: "mul-craies-23",
      ile: "multiplication",
      niveau: 2,
      competence: "mul.table-6",
      difficulte: 2,
      nombres: { a: { min: 2, max: 9 } },
      contraintes: ["a * 6 <= 54"],
      enonces: [
        "{a} boîtes de 6 craies. Combien de craies en tout ?",
        "La maîtresse a {a} boîtes de 6 craies. Combien de craies a-t-elle ?",
        "Il y a {a} boîtes de 6 craies sur la table. Combien de craies ?"
      ],
      operation: "×",
      reponse: "a * 6",
      unite: "craies",
      lecon: "table"
    },

    {
      id: "mul-filets-24",
      ile: "multiplication",
      niveau: 2,
      competence: "mul.table-7",
      difficulte: 2,
      nombres: { a: { min: 2, max: 9 } },
      contraintes: ["a * 7 <= 63"],
      enonces: [
        "{a} filets contiennent 7 poissons chacun. Combien de poissons en tout ?",
        "Le pêcheur a {a} filets de 7 poissons. Combien de poissons a-t-il ?",
        "Il y a {a} filets de 7 poissons. Combien de poissons en tout ?"
      ],
      operation: "×",
      reponse: "a * 7",
      unite: "poissons",
      lecon: "table"
    },

    {
      id: "mul-etageres-25",
      ile: "multiplication",
      niveau: 2,
      competence: "mul.table-8",
      difficulte: 2,
      nombres: { a: { min: 2, max: 9 } },
      contraintes: ["a * 8 <= 72"],
      enonces: [
        "{a} étagères portent 8 livres chacune. Combien de livres en tout ?",
        "La bibliothèque a {a} étagères de 8 livres. Combien de livres ?",
        "Il y a {a} étagères de 8 livres. Combien de livres en tout ?"
      ],
      operation: "×",
      reponse: "a * 8",
      unite: "livres",
      lecon: "table"
    },

    {
      id: "mul-bougies-26",
      ile: "multiplication",
      niveau: 2,
      competence: "mul.table-8",
      difficulte: 2,
      nombres: { a: { min: 2, max: 9 } },
      contraintes: ["a * 8 <= 72"],
      enonces: [
        "{a} boîtes de 8 bougies. Combien de bougies en tout ?",
        "Le marchand a {a} boîtes de 8 bougies. Combien de bougies ?",
        "Il y a {a} boîtes de 8 bougies. Combien de bougies en tout ?"
      ],
      operation: "×",
      reponse: "a * 8",
      unite: "bougies",
      lecon: "table"
    },

    {
      id: "mul-sacs-27",
      ile: "multiplication",
      niveau: 2,
      competence: "mul.table-9",
      difficulte: 2,
      nombres: { a: { min: 2, max: 9 } },
      contraintes: ["a * 9 <= 81"],
      enonces: [
        "{a} sacs de 9 coquillages. Combien de coquillages en tout ?",
        "Malo a {a} sacs de 9 coquillages. Combien de coquillages a-t-il ?",
        "Il y a {a} sacs de 9 coquillages. Combien de coquillages ?"
      ],
      operation: "×",
      reponse: "a * 9",
      unite: "coquillages",
      lecon: "table"
    },

    /* ===== Niveau 3 (suite) : deux chiffres × un chiffre, faciles ===== */

    {
      id: "mul-places-28",
      ile: "multiplication",
      niveau: 3,
      competence: "mul.deuxChiffres",
      difficulte: 2,
      nombres: { a: { min: 12, max: 25 }, b: { min: 2, max: 4 } },
      contraintes: ["a * b <= 100"],
      enonces: [
        "{a} barques ont {b} places chacune. Combien de places en tout ?",
        "Il y a {a} barques de {b} places. Combien de places y a-t-il ?",
        "Le port aligne {a} barques de {b} places. Combien de places en tout ?"
      ],
      operation: "×",
      reponse: "a * b",
      unite: "places",
      lecon: "table"
    },

    {
      id: "mul-rayons-29",
      ile: "multiplication",
      niveau: 3,
      competence: "mul.deuxChiffres",
      difficulte: 2,
      nombres: { a: { min: 12, max: 25 }, b: { min: 2, max: 4 } },
      contraintes: ["a * b <= 100"],
      enonces: [
        "{a} rayons portent {b} coffres chacun. Combien de coffres en tout ?",
        "L'armurerie a {a} rayons de {b} coffres. Combien de coffres ?",
        "Il y a {a} rayons de {b} coffres. Combien de coffres en tout ?"
      ],
      operation: "×",
      reponse: "a * b",
      unite: "coffres",
      lecon: "table"
    },

    {
      id: "mul-prix-30",
      ile: "multiplication",
      niveau: 3,
      competence: "mul.deuxChiffres",
      difficulte: 2,
      nombres: { a: { min: 12, max: 25 }, b: { min: 2, max: 4 } },
      contraintes: ["a * b <= 100"],
      enonces: [
        "Le marchand vend {a} cartes à {b} pièces chacune. Combien reçoit-il ?",
        "{a} cartes coûtent {b} pièces chacune. Combien coûtent-elles en tout ?",
        "Malo achète {a} cartes à {b} pièces. Combien paie-t-il ?"
      ],
      operation: "×",
      reponse: "a * b",
      unite: "pièces",
      lecon: "table"
    },

    {
      id: "mul-bandes-31",
      ile: "multiplication",
      niveau: 3,
      competence: "mul.deuxChiffres",
      difficulte: 2,
      nombres: { a: { min: 12, max: 25 }, b: { min: 2, max: 4 } },
      contraintes: ["a * b <= 100"],
      enonces: [
        "{a} bandes de {b} singes traversent la jungle. Combien de singes en tout ?",
        "Il y a {a} bandes de {b} singes. Combien de singes y a-t-il ?",
        "Le naturaliste compte {a} bandes de {b} singes. Combien de singes ?"
      ],
      operation: "×",
      reponse: "a * b",
      unite: "singes",
      lecon: "table"
    },

    {
      id: "mul-sacs-32",
      ile: "multiplication",
      niveau: 3,
      competence: "mul.deuxChiffres",
      difficulte: 2,
      nombres: { a: { min: 12, max: 25 }, b: { min: 2, max: 4 } },
      contraintes: ["a * b <= 100"],
      enonces: [
        "{a} sacs contiennent {b} boulets chacun. Combien de boulets en tout ?",
        "Il y a {a} sacs de {b} boulets. Combien de boulets ?",
        "Le canonnier range {a} sacs de {b} boulets. Combien de boulets range-t-il ?"
      ],
      operation: "×",
      reponse: "a * b",
      unite: "boulets",
      lecon: "table"
    },

    {
      id: "mul-files-33",
      ile: "multiplication",
      niveau: 3,
      competence: "mul.deuxChiffres",
      difficulte: 2,
      nombres: { a: { min: 12, max: 25 }, b: { min: 2, max: 4 } },
      contraintes: ["a * b <= 100"],
      enonces: [
        "{a} files de {b} pirates attendent sur le quai. Combien de pirates en tout ?",
        "Il y a {a} files de {b} pirates. Combien de pirates ?",
        "Le capitaine compte {a} files de {b} pirates. Combien de pirates ?"
      ],
      operation: "×",
      reponse: "a * b",
      unite: "pirates",
      lecon: "table"
    },

    {
      id: "mul-caisses-34",
      ile: "multiplication",
      niveau: 3,
      competence: "mul.deuxChiffres",
      difficulte: 2,
      nombres: { a: { min: 12, max: 25 }, b: { min: 2, max: 4 } },
      contraintes: ["a * b <= 100"],
      enonces: [
        "{a} caisses pèsent {b} kg chacune. Combien pèsent-elles en tout ?",
        "Il y a {a} caisses de {b} kg. Combien de kg en tout ?",
        "Le port charge {a} caisses de {b} kg. Combien de kg charge-t-il ?"
      ],
      operation: "×",
      reponse: "a * b",
      unite: "kg",
      lecon: "table"
    },

    /* ===== Niveau 4 (suite) : deux chiffres × un chiffre, et aires ===== */

    {
      id: "mul-rayons-35",
      ile: "multiplication",
      niveau: 4,
      competence: "mul.deuxChiffresGrand",
      difficulte: 3,
      nombres: { a: { min: 13, max: 48 }, b: { min: 2, max: 5 } },
      contraintes: ["a * b <= 200"],
      enonces: [
        "{a} rayons portent {b} coffres chacun. Combien de coffres en tout ?",
        "L'armurerie a {a} rayons de {b} coffres. Combien de coffres ?",
        "Il y a {a} rayons de {b} coffres. Combien de coffres en tout ?"
      ],
      operation: "×",
      reponse: "a * b",
      unite: "coffres",
      lecon: "table"
    },

    {
      id: "mul-prix-36",
      ile: "multiplication",
      niveau: 4,
      competence: "mul.deuxChiffresGrand",
      difficulte: 3,
      nombres: { a: { min: 13, max: 48 }, b: { min: 2, max: 5 } },
      contraintes: ["a * b <= 200"],
      enonces: [
        "Le marchand vend {a} cartes à {b} pièces chacune. Combien reçoit-il ?",
        "{a} cartes coûtent {b} pièces chacune. Combien coûtent-elles en tout ?",
        "Malo achète {a} cartes à {b} pièces. Combien paie-t-il ?"
      ],
      operation: "×",
      reponse: "a * b",
      unite: "pièces",
      lecon: "table"
    },

    {
      id: "mul-bandes-37",
      ile: "multiplication",
      niveau: 4,
      competence: "mul.deuxChiffresGrand",
      difficulte: 3,
      nombres: { a: { min: 13, max: 48 }, b: { min: 2, max: 5 } },
      contraintes: ["a * b <= 200"],
      enonces: [
        "{a} bandes de {b} pirates traversent le port. Combien de pirates en tout ?",
        "Il y a {a} bandes de {b} pirates. Combien de pirates ?",
        "Le capitaine compte {a} bandes de {b} pirates. Combien de pirates ?"
      ],
      operation: "×",
      reponse: "a * b",
      unite: "pirates",
      lecon: "table"
    },

    {
      id: "mul-files-38",
      ile: "multiplication",
      niveau: 4,
      competence: "mul.deuxChiffresGrand",
      difficulte: 3,
      nombres: { a: { min: 13, max: 48 }, b: { min: 2, max: 5 } },
      contraintes: ["a * b <= 200"],
      enonces: [
        "{a} files de {b} boulets sont alignées. Combien de boulets en tout ?",
        "Il y a {a} files de {b} boulets. Combien de boulets ?",
        "Le canonnier aligne {a} files de {b} boulets. Combien de boulets ?"
      ],
      operation: "×",
      reponse: "a * b",
      unite: "boulets",
      lecon: "table"
    },

    {
      id: "mul-aire-39",
      ile: "multiplication",
      niveau: 4,
      competence: "mul.aire",
      difficulte: 3,
      nombres: { a: { min: 3, max: 9 }, b: { min: 3, max: 9 } },
      contraintes: ["a * b <= 81"],
      enonces: [
        "Le terrain mesure {a} m de long et {b} m de large. Pour calculer l'aire, on multiplie la longueur par la largeur. Quelle est l'aire du terrain ?",
        "La table est un rectangle de {a} m sur {b} m. Pour calculer son aire, on multiplie la longueur par la largeur. Quelle est son aire ?",
        "Le pont mesure {a} m de long et {b} m de large. Pour trouver l'aire, on multiplie la longueur par la largeur. Quelle est l'aire du pont ?"
      ],
      operation: "×",
      reponse: "a * b",
      unite: "m²",
      lecon: "table"
    },

    {
      id: "mul-aire-40",
      ile: "multiplication",
      niveau: 4,
      competence: "mul.aire",
      difficulte: 3,
      nombres: { a: { min: 3, max: 9 }, b: { min: 3, max: 9 } },
      contraintes: ["a * b <= 81"],
      enonces: [
        "La voile mesure {a} m de long et {b} m de large. Pour calculer son aire, on multiplie la longueur par la largeur. Quelle est son aire ?",
        "Le jardin est un rectangle de {a} m sur {b} m. Pour calculer son aire, on multiplie la longueur par la largeur. Quelle est son aire ?",
        "La caisse a un fond de {a} m sur {b} m. Pour calculer l'aire du fond, on multiplie la longueur par la largeur. Quelle est cette aire ?"
      ],
      operation: "×",
      reponse: "a * b",
      unite: "m²",
      lecon: "table"
    }
  ]);
})(window.Quete);
