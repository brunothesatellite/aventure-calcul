/* ============================================================
   Énoncés — ADDITION (île « La Crique des Coffres »)
   40 énoncés : 10 par niveau. Chaque énoncé propose 3 formulations
   qui gardent le même objet, pour que l'unité de la réponse reste
   juste (« 42 biscuits », jamais « 42 biscuits » pour des mouettes).
   ============================================================ */
(function (Q) {
  Q.registerEnonces([

    /* ================= NIVEAU 1 — jusqu'à 10 et jusqu'à 20 ================= */

    {
      id: "add-coquillages-01",
      ile: "addition",
      niveau: 1,
      competence: "add.dans10",
      difficulte: 1,
      nombres: {
        a: { min: 3, max: 7 },
        b: { min: 2, max: 4 }
      },
      contraintes: ["a + b <= 10", "a + b >= 6"],
      enonces: [
        "Sur la plage, {a} coquillages brillent dans le sable. Malo en ramasse encore {b}. Combien de coquillages a-t-il maintenant ?",
        "Malo a déjà {a} coquillages dans son seau. Il en trouve {b} de plus. Combien de coquillages a-t-il ?",
        "Il y a {a} coquillages sur la table et {b} dans le panier. Combien de coquillages en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "coquillages",
      lecon: "calcul"
    },

    {
      id: "add-panier-09",
      ile: "addition",
      niveau: 1,
      competence: "add.dans10",
      difficulte: 1,
      nombres: {
        a: { min: 2, max: 6 },
        b: { min: 2, max: 4 }
      },
      contraintes: ["a + b <= 10", "a + b >= 4"],
      enonces: [
        "Dans le panier, il y a {a} coquillages. Malo en ajoute {b}. Combien de coquillages y en a-t-il ?",
        "{a} coquillages sont dans la main de Malo, {b} dans sa poche. Combien de coquillages a-t-il ?",
        "Le seau contient {a} coquillages. On en met {b} de plus. Combien de coquillages y a-t-il ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "coquillages",
      lecon: "calcul"
    },

    {
      id: "add-perles-10",
      ile: "addition",
      niveau: 1,
      competence: "add.dans10",
      difficulte: 1,
      nombres: {
        a: { min: 2, max: 6 },
        b: { min: 2, max: 4 }
      },
      contraintes: ["a + b <= 10", "a + b >= 4"],
      enonces: [
        "Le coffre contient {a} perles. Malo en ajoute {b}. Combien de perles y a-t-il ?",
        "Malo a {a} perles dans la main et {b} dans sa poche. Combien de perles a-t-il ?",
        "Il y a {a} perles sur le fil et {b} dans la boîte. Combien de perles en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "perles",
      lecon: "calcul"
    },

    {
      id: "add-poissons-11",
      ile: "addition",
      niveau: 1,
      competence: "add.dans10",
      difficulte: 1,
      nombres: {
        a: { min: 2, max: 7 },
        b: { min: 2, max: 3 }
      },
      contraintes: ["a + b <= 10", "a + b >= 4"],
      enonces: [
        "{a} poissons nagent dans le seau. Malo en attrape {b} de plus. Combien de poissons a-t-il ?",
        "Il y a {a} poissons dans l'épuisette et {b} dans le seau. Combien de poissons en tout ?",
        "Le pêcheur prend {a} poissons le matin et {b} le soir. Combien de poissons a-t-il ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "poissons",
      lecon: "calcul"
    },

    {
      id: "add-jetons-12",
      ile: "addition",
      niveau: 1,
      competence: "add.dans10",
      difficulte: 1,
      nombres: {
        a: { min: 3, max: 6 },
        b: { min: 2, max: 4 }
      },
      contraintes: ["a + b <= 10", "a + b >= 5"],
      enonces: [
        "{a} jetons rouges et {b} jetons bleus. Combien de jetons en tout ?",
        "La boîte contient {a} jetons. On en ajoute {b}. Combien de jetons y a-t-il ?",
        "Malo aligne {a} jetons, puis {b} autres. Combien de jetons aligne-t-il ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "jetons",
      lecon: "calcul"
    },

    {
      id: "add-dans20-06",
      ile: "addition",
      niveau: 1,
      competence: "add.dans20",
      difficulte: 2,
      nombres: {
        a: { min: 5, max: 12 },
        b: { min: 3, max: 8 }
      },
      contraintes: ["a + b <= 20", "a + b >= 9"],
      enonces: [
        "{a} pirates sont sur le pont. {b} autres montent à bord. Combien de pirates y a-t-il ?",
        "{a} pirates montent la garde, {b} autres dorment. Combien de pirates y a-t-il ?",
        "Le capitaine compte {a} pirates à l'avant et {b} à l'arrière. Combien de pirates en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "pirates",
      lecon: "retenue"
    },

    {
      id: "add-vigie-13",
      ile: "addition",
      niveau: 1,
      competence: "add.dans20",
      difficulte: 2,
      nombres: {
        a: { min: 6, max: 12 },
        b: { min: 4, max: 8 }
      },
      contraintes: ["a + b <= 20", "a + b >= 10"],
      enonces: [
        "La vigie compte {a} voiles à l'horizon, puis {b} de plus. Combien de voiles voit-elle ?",
        "{a} voiles blanches et {b} voiles grises. Combien de voiles en tout ?",
        "Le navire a {a} voiles hissées et {b} en réserve. Combien de voiles en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "voiles",
      lecon: "retenue"
    },

    {
      id: "add-crabes-14",
      ile: "addition",
      niveau: 1,
      competence: "add.dans20",
      difficulte: 2,
      nombres: {
        a: { min: 7, max: 13 },
        b: { min: 3, max: 7 }
      },
      contraintes: ["a + b <= 20", "a + b >= 10"],
      enonces: [
        "{a} crabes sur le rocher et {b} dans le seau. Combien de crabes en tout ?",
        "Malo compte {a} crabes, puis en trouve {b} de plus. Combien de crabes a-t-il ?",
        "Il y a {a} crabes le matin et {b} le soir sur la plage. Combien de crabes en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "crabes",
      lecon: "retenue"
    },

    {
      id: "add-boite-15",
      ile: "addition",
      niveau: 1,
      competence: "add.dans20",
      difficulte: 2,
      nombres: {
        a: { min: 8, max: 14 },
        b: { min: 3, max: 6 }
      },
      contraintes: ["a + b <= 20", "a + b >= 11"],
      enonces: [
        "{a} biscuits dans la boîte et {b} sur la table. Combien de biscuits en tout ?",
        "Le cuisinier a {a} biscuits, il en cuit {b} de plus. Combien de biscuits a-t-il ?",
        "Il y a {a} biscuits dans un bocal et {b} dans l'autre. Combien de biscuits en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "biscuits",
      lecon: "retenue"
    },

    {
      id: "add-tonneau-16",
      ile: "addition",
      niveau: 1,
      competence: "add.dans20",
      difficulte: 2,
      nombres: {
        a: { min: 9, max: 15 },
        b: { min: 2, max: 5 }
      },
      contraintes: ["a + b <= 20", "a + b >= 11"],
      enonces: [
        "{a} boulets dans le tonneau et {b} à côté. Combien de boulets en tout ?",
        "Le canon a tiré {a} boulets, on en apporte {b}. Combien de boulets y a-t-il ?",
        "{a} boulets sur le pont et {b} dans la soute. Combien de boulets en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "boulets",
      lecon: "retenue"
    },

    /* ================= NIVEAU 2 — addition avec retenue ================= */

    {
      id: "add-biscuits-02",
      ile: "addition",
      niveau: 2,
      competence: "add.retenue",
      difficulte: 2,
      nombres: {
        a: { min: 24, max: 58 },
        b: { min: 17, max: 39 }
      },
      contraintes: ["a + b <= 100", "retenues(a, b) == 1"],
      enonces: [
        "Le cuisinier range {a} biscuits dans un coffre et {b} dans un autre. Combien de biscuits a-t-il rangés ?",
        "Le cuisinier prépare {a} biscuits le matin et {b} le soir. Combien de biscuits a-t-il faits ?",
        "Un coffre contient {a} biscuits, un autre en contient {b}. Combien de biscuits dans les deux ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "biscuits",
      lecon: "retenue"
    },

    {
      id: "add-planche-07",
      ile: "addition",
      niveau: 2,
      competence: "add.retenue",
      difficulte: 2,
      nombres: {
        a: { min: 23, max: 57 },
        b: { min: 18, max: 35 }
      },
      contraintes: ["a + b <= 100", "retenues(a, b) == 1"],
      enonces: [
        "Le menuisier coupe une planche de {a} cm et une de {b} cm. Quelle longueur de bois a-t-il coupée ?",
        "Deux planches mesurent {a} cm et {b} cm. Mises bout à bout, quelle longueur obtient-on ?",
        "Le mât mesure {a} cm et la vergue {b} cm. Quelle longueur en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "cm",
      lecon: "retenue"
    },

    {
      id: "add-sac-17",
      ile: "addition",
      niveau: 2,
      competence: "add.retenue",
      difficulte: 2,
      nombres: {
        a: { min: 26, max: 57 },
        b: { min: 15, max: 38 }
      },
      contraintes: ["a + b <= 100", "retenues(a, b) == 1"],
      enonces: [
        "{a} pièces dans un sac et {b} dans l'autre. Combien de pièces en tout ?",
        "Malo compte {a} pièces, puis {b} de plus. Combien de pièces a-t-il ?",
        "{a} pièces dans le coffre et {b} sur la table. Combien de pièces en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "pièces",
      lecon: "retenue"
    },

    {
      id: "add-coco-18",
      ile: "addition",
      niveau: 2,
      competence: "add.retenue",
      difficulte: 2,
      nombres: {
        a: { min: 23, max: 48 },
        b: { min: 16, max: 35 }
      },
      contraintes: ["a + b <= 100", "retenues(a, b) == 1"],
      enonces: [
        "{a} noix de coco dans la réserve et {b} dans le panier. Combien de noix de coco en tout ?",
        "Le singe a {a} noix de coco. Il en trouve {b} de plus. Combien en a-t-il ?",
        "{a} noix de coco sur la plage et {b} sous le palmier. Combien en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "noix de coco",
      lecon: "retenue"
    },

    {
      id: "add-panier2-19",
      ile: "addition",
      niveau: 2,
      competence: "add.retenue",
      difficulte: 2,
      nombres: {
        a: { min: 25, max: 55 },
        b: { min: 17, max: 34 }
      },
      contraintes: ["a + b <= 100", "retenues(a, b) == 1"],
      enonces: [
        "{a} coquillages dans le panier et {b} dans le seau. Combien de coquillages en tout ?",
        "Malo ramasse {a} coquillages le matin et {b} l'après-midi. Combien en a-t-il ?",
        "{a} coquillages blancs et {b} coquillages roses. Combien de coquillages en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "coquillages",
      lecon: "retenue"
    },

    {
      id: "add-canon-20",
      ile: "addition",
      niveau: 2,
      competence: "add.retenue",
      difficulte: 2,
      nombres: {
        a: { min: 24, max: 58 },
        b: { min: 4, max: 9 }
      },
      contraintes: ["a + b <= 100", "retenues(a, b) == 1"],
      enonces: [
        "{a} boulets dans la soute. On en ajoute {b}. Combien de boulets en tout ?",
        "Le canon a {a} boulets, on en apporte {b}. Combien de boulets a-t-il ?",
        "{a} boulets rangés, {b} posés à côté. Combien de boulets en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "boulets",
      lecon: "retenue"
    },

    {
      id: "add-cuisson-21",
      ile: "addition",
      niveau: 2,
      competence: "add.retenue",
      difficulte: 2,
      nombres: {
        a: { min: 26, max: 49 },
        b: { min: 5, max: 9 }
      },
      contraintes: ["a + b <= 100", "retenues(a, b) == 1"],
      enonces: [
        "Le cuisinier a {a} biscuits, il en cuit {b} de plus. Combien de biscuits a-t-il ?",
        "{a} biscuits dans le four et {b} sur l'étagère. Combien de biscuits en tout ?",
        "On prépare {a} biscuits le matin et {b} le soir. Combien de biscuits en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "biscuits",
      lecon: "retenue"
    },

    {
      id: "add-ficelle-22",
      ile: "addition",
      niveau: 2,
      competence: "add.retenue",
      difficulte: 2,
      nombres: {
        a: { min: 27, max: 56 },
        b: { min: 18, max: 33 }
      },
      contraintes: ["a + b <= 100", "retenues(a, b) == 1"],
      enonces: [
        "Une ficelle mesure {a} cm, une autre {b} cm. Quelle longueur en tout ?",
        "Le cordage mesure {a} cm et la drisse {b} cm. Quelle longueur en tout ?",
        "Deux bouts de corde mesurent {a} cm et {b} cm. Mise bout à bout, quelle longueur obtient-on ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "cm",
      lecon: "retenue"
    },

    {
      id: "add-argent-23",
      ile: "addition",
      niveau: 2,
      competence: "add.retenue",
      difficulte: 2,
      nombres: {
        a: { min: 24, max: 47 },
        b: { min: 19, max: 36 }
      },
      contraintes: ["a + b <= 100", "retenues(a, b) == 1"],
      enonces: [
        "{a} pièces d'or et {b} pièces d'argent. Combien de pièces en tout ?",
        "Le coffre contient {a} pièces, la bourse {b}. Combien de pièces en tout ?",
        "Malo a {a} pièces, il en gagne {b}. Combien de pièces a-t-il ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "pièces",
      lecon: "retenue"
    },

    {
      id: "add-passagers-24",
      ile: "addition",
      niveau: 2,
      competence: "add.retenue",
      difficulte: 2,
      nombres: {
        a: { min: 28, max: 59 },
        b: { min: 14, max: 29 }
      },
      contraintes: ["a + b <= 100", "retenues(a, b) == 1"],
      enonces: [
        "{a} passagers dans la barque, {b} montent. Combien de passagers en tout ?",
        "Le bateau transporte {a} passagers, {b} arrivent. Combien de passagers en tout ?",
        "{a} passagers à bord et {b} sur le quai. Combien de passagers en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "passagers",
      lecon: "retenue"
    },

    /* ================= NIVEAU 3 — stratégies, centaines, compléments ================= */

    {
      id: "add-pieces-03",
      ile: "addition",
      niveau: 3,
      competence: "add.strategie",
      difficulte: 2,
      nombres: {
        a: { min: 41, max: 88 },
        b: { valeurs: [9, 11, 19, 21] }
      },
      contraintes: ["a + b <= 120", "retenues(a, b) <= 1"],
      enonces: [
        "Malo a {a} pièces d'or. Il trouve un sac qui en contient {b} de plus. Combien de pièces a-t-il ?",
        "Il y a {a} pièces dans le coffre et {b} sur la table. Combien de pièces en tout ?",
        "Le pirate compte {a} pièces, puis en gagne {b}. Combien de pièces a-t-il ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "pièces",
      lecon: "strategie"
    },

    {
      id: "add-calcul-25",
      ile: "addition",
      niveau: 3,
      competence: "add.strategie",
      difficulte: 2,
      nombres: {
        a: { min: 35, max: 85 },
        b: { valeurs: [9, 11, 19, 21, 29] }
      },
      contraintes: ["a + b <= 150", "retenues(a, b) <= 1"],
      enonces: [
        "{a} + {b}",
        "Combien font {a} + {b} ?",
        "Calcule : {a} + {b}."
      ],
      operation: "+",
      reponse: "a + b",
      lecon: "strategie"
    },

    {
      id: "add-trouvaille-26",
      ile: "addition",
      niveau: 3,
      competence: "add.strategie",
      difficulte: 2,
      nombres: {
        a: { min: 41, max: 88 },
        b: { valeurs: [9, 11, 19, 21] }
      },
      contraintes: ["a + b <= 120", "retenues(a, b) <= 1"],
      enonces: [
        "Malo a {a} coquillages. Il en trouve {b} de plus. Combien en a-t-il ?",
        "Le seau contient {a} coquillages, on en ajoute {b}. Combien en tout ?",
        "{a} coquillages dans le panier, {b} dans la poche. Combien en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "coquillages",
      lecon: "strategie"
    },

    {
      id: "add-pose-05",
      ile: "addition",
      niveau: 3,
      competence: "add.centaines",
      difficulte: 2,
      mode: "pose",
      nombres: {
        a: { min: 125, max: 899 },
        b: { min: 125, max: 899 }
      },
      contraintes: ["a + b <= 1500", "retenues(a, b) <= 2", "a % 10 != 0", "b % 10 != 0"],
      enonce: "{a} + {b}",
      consigne: "Pose l'addition en colonnes, puis écris le résultat.",
      operation: "+",
      reponse: "a + b",
      lecon: "retenue"
    },

    {
      id: "add-equipage-27",
      ile: "addition",
      niveau: 3,
      competence: "add.centaines",
      difficulte: 2,
      nombres: {
        a: { min: 120, max: 480, multipleDe: 10 },
        b: { min: 110, max: 390, multipleDe: 10 }
      },
      contraintes: ["a + b <= 1000", "retenues(a, b) >= 1", "retenues(a, b) <= 2"],
      enonces: [
        "{a} pirates à bord, {b} attendus au port. Combien de pirates en tout ?",
        "L'équipage compte {a} pirates, {b} autres embarquent. Combien de pirates en tout ?",
        "{a} pirates sur le navire et {b} sur la barque. Combien de pirates en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "pirates",
      lecon: "retenue"
    },

    {
      id: "add-distance-28",
      ile: "addition",
      niveau: 3,
      competence: "add.centaines",
      difficulte: 2,
      nombres: {
        a: { min: 130, max: 470, multipleDe: 10 },
        b: { min: 120, max: 380, multipleDe: 10 }
      },
      contraintes: ["a + b <= 900", "retenues(a, b) >= 1", "retenues(a, b) <= 2"],
      enonces: [
        "Le navire a parcouru {a} m, puis {b} m. Quelle distance a-t-il parcourue ?",
        "Deux cordages mesurent {a} m et {b} m. Quelle longueur en tout ?",
        "Malo marche {a} m le matin et {b} m l'après-midi. Quelle distance parcourt-il ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "mètres",
      lecon: "retenue"
    },

    {
      id: "add-chantier-29",
      ile: "addition",
      niveau: 3,
      competence: "add.centaines",
      difficulte: 2,
      nombres: {
        a: { min: 125, max: 485, multipleDe: 5 },
        b: { min: 115, max: 375, multipleDe: 5 }
      },
      contraintes: ["a + b <= 900", "retenues(a, b) >= 1", "retenues(a, b) <= 2"],
      enonces: [
        "Le chantier a livré {a} pièces, puis {b}. Combien de pièces en tout ?",
        "{a} pièces dans l'atelier et {b} dans la réserve. Combien de pièces en tout ?",
        "Malo compte {a} pièces, puis {b} de plus. Combien de pièces a-t-il ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "pièces",
      lecon: "retenue"
    },

    {
      id: "add-coffre-30",
      ile: "addition",
      niveau: 3,
      competence: "add.complement",
      difficulte: 2,
      nombres: {
        a: { min: 15, max: 85 }
      },
      contraintes: ["a % 10 != 0", "100 - a >= 5"],
      enonces: [
        "Le coffre peut contenir 100 pièces. Il y en a déjà {a}. Combien peut-on en ajouter encore ?",
        "Il manque combien de pièces pour remplir un coffre de 100 ? Il y en a {a}.",
        "Le trésor de 100 pièces n'en contient que {a}. Combien de pièces manque-t-il ?"
      ],
      operation: "−",
      reponse: "100 - a",
      unite: "pièces",
      lecon: "complement"
    },

    {
      id: "add-tonneau-31",
      ile: "addition",
      niveau: 3,
      competence: "add.complement",
      difficulte: 2,
      nombres: {
        a: { min: 12, max: 88 }
      },
      contraintes: ["a % 10 != 0", "100 - a >= 5"],
      enonces: [
        "Le tonneau peut contenir 100 boulets. Il y en a {a}. Combien peut-on en ajouter encore ?",
        "Il manque combien de boulets pour faire 100 ? Le tonneau en contient {a}.",
        "La soute de 100 places contient {a} boulets. Combien de places restent libres ?"
      ],
      operation: "−",
      reponse: "100 - a",
      unite: "boulets",
      lecon: "complement"
    },

    {
      id: "add-manque-32",
      ile: "addition",
      niveau: 3,
      competence: "add.complement",
      difficulte: 2,
      nombres: {
        a: { min: 16, max: 84 }
      },
      contraintes: ["a % 10 != 0", "100 - a >= 8"],
      enonces: [
        "Malo a {a} coquillages. Combien lui en faut-il encore pour en avoir 100 ?",
        "Le seau peut contenir 100 coquillages. Il y en a {a}. Combien peut-on en ajouter ?",
        "Pour arriver à 100 coquillages, combien en manque-t-il s'il y en a {a} ?"
      ],
      operation: "−",
      reponse: "100 - a",
      unite: "coquillages",
      lecon: "complement"
    },

    /* ================= NIVEAU 4 — décimaux et deux étapes ================= */

    {
      id: "add-cordages-04",
      ile: "addition",
      niveau: 4,
      competence: "add.decimaux",
      difficulte: 3,
      decimales: 1,
      nombres: {
        a: { min: 2, max: 12, multipleDe: 0.5, decimales: 1 },
        b: { min: 2, max: 12, multipleDe: 0.5, decimales: 1 }
      },
      contraintes: ["a + b <= 20", "a + b > 3"],
      enonces: [
        "Malo achète une corde de {a} m et une autre de {b} m. Quelle longueur de corde a-t-il ?",
        "Une corde mesure {a} m, une autre {b} m. Mises bout à bout, quelle longueur obtient-on ?",
        "Le mât mesure {a} m et la vergue {b} m. Quelle longueur en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "mètres",
      lecon: "decimaux"
    },

    {
      id: "add-monnaie-08",
      ile: "addition",
      niveau: 4,
      competence: "add.decimaux",
      difficulte: 3,
      decimales: 1,
      nombres: {
        a: { min: 2, max: 12, multipleDe: 0.5, decimales: 1 },
        b: { min: 2, max: 12, multipleDe: 0.5, decimales: 1 }
      },
      contraintes: ["a + b <= 20", "a + b > 3"],
      enonces: [
        "Malo paie {a} € pour la corde et {b} € pour le crochet. Combien dépense-t-il ?",
        "Une carte coûte {a} € et une boussole {b} €. Combien coûtent-elles ensemble ?",
        "La corde coûte {a} €, le crochet {b} €. Combien Malo doit-il payer ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "euros",
      lecon: "decimaux"
    },

    {
      id: "add-poids-33",
      ile: "addition",
      niveau: 4,
      competence: "add.decimaux",
      difficulte: 3,
      decimales: 1,
      nombres: {
        a: { min: 1, max: 9, multipleDe: 0.5, decimales: 1 },
        b: { min: 1, max: 9, multipleDe: 0.5, decimales: 1 }
      },
      contraintes: ["a + b <= 15", "a + b >= 2"],
      enonces: [
        "{a} kg de biscuits et {b} kg de viande. Combien de kg en tout ?",
        "Le sac pèse {a} kg, la caisse {b} kg. Combien pèsent-ils ensemble ?",
        "Malo porte {a} kg, son sac {b} kg. Combien de kg porte-t-il en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "kg",
      lecon: "decimaux"
    },

    {
      id: "add-litres-34",
      ile: "addition",
      niveau: 4,
      competence: "add.decimaux",
      difficulte: 3,
      decimales: 1,
      nombres: {
        a: { min: 1, max: 9, multipleDe: 0.5, decimales: 1 },
        b: { min: 1, max: 9, multipleDe: 0.5, decimales: 1 }
      },
      contraintes: ["a + b <= 15", "a + b >= 2"],
      enonces: [
        "Le tonneau contient {a} L d'eau et la gourde {b} L. Combien de litres en tout ?",
        "On verse {a} L puis {b} L dans la citerne. Combien de litres y a-t-il ?",
        "Il y a {a} L de jus et {b} L de sirop. Combien de litres en tout ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "litres",
      lecon: "decimaux"
    },

    {
      id: "add-achats-35",
      ile: "addition",
      niveau: 4,
      competence: "add.decimaux",
      difficulte: 3,
      decimales: 1,
      nombres: {
        a: { min: 2, max: 12, multipleDe: 0.5, decimales: 1 },
        b: { min: 2, max: 12, multipleDe: 0.5, decimales: 1 }
      },
      contraintes: ["a + b <= 20", "a + b > 3"],
      enonces: [
        "Le sabre coûte {a} € et le chapeau {b} €. Combien Malo paie-t-il ?",
        "Une carte coûte {a} €, un crochet {b} €. Combien pour les deux ?",
        "Malo achète une corde à {a} € et une lampe à {b} €. Combien dépense-t-il ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "euros",
      lecon: "decimaux"
    },

    {
      id: "add-voile-36",
      ile: "addition",
      niveau: 4,
      competence: "add.decimaux",
      difficulte: 3,
      decimales: 1,
      nombres: {
        a: { min: 2, max: 12, multipleDe: 0.5, decimales: 1 },
        b: { min: 2, max: 12, multipleDe: 0.5, decimales: 1 }
      },
      contraintes: ["a + b <= 20", "a + b > 3"],
      enonces: [
        "La voile mesure {a} m et la drisse {b} m. Quelle longueur en tout ?",
        "L'échelle mesure {a} m, le mât {b} m. Quelle longueur en tout ?",
        "Une planche mesure {a} m, une autre {b} m. Mises bout à bout, quelle longueur obtient-on ?"
      ],
      operation: "+",
      reponse: "a + b",
      unite: "mètres",
      lecon: "decimaux"
    },

    {
      id: "add-troisbandes-37",
      ile: "addition",
      niveau: 4,
      competence: "add.deuxEtapes",
      difficulte: 3,
      nombres: {
        a: { min: 12, max: 25 },
        b: { min: 8, max: 15 },
        c: { min: 4, max: 9 }
      },
      contraintes: ["a + b + c <= 60", "a + b + c >= 25"],
      enonces: [
        "{a} pirates montent à bord, puis {b}, puis {c}. Combien de pirates en tout ?",
        "Il y a {a} pirates sur le pont, {b} dans la cale et {c} dans la vigie. Combien de pirates en tout ?",
        "Le capitaine compte {a} pirates, puis {b}, puis {c}. Combien de pirates en tout ?"
      ],
      operation: "+",
      reponse: "a + b + c",
      unite: "pirates",
      lecon: "deuxEtapes"
    },

    {
      id: "add-journee-38",
      ile: "addition",
      niveau: 4,
      competence: "add.deuxEtapes",
      difficulte: 3,
      nombres: {
        a: { min: 10, max: 22 },
        b: { min: 6, max: 14 },
        c: { min: 3, max: 8 }
      },
      contraintes: ["a + b + c <= 50", "a + b + c >= 20"],
      enonces: [
        "Malo ramasse {a} coquillages le matin, {b} l'après-midi et {c} le soir. Combien en a-t-il ?",
        "{a} coquillages sur la plage, {b} dans l'eau et {c} sur le rocher. Combien en tout ?",
        "Le seau contient {a} coquillages, on en ajoute {b}, puis {c}. Combien en tout ?"
      ],
      operation: "+",
      reponse: "a + b + c",
      unite: "coquillages",
      lecon: "deuxEtapes"
    },

    {
      id: "add-gains-39",
      ile: "addition",
      niveau: 4,
      competence: "add.deuxEtapes",
      difficulte: 3,
      nombres: {
        a: { min: 15, max: 30 },
        b: { min: 5, max: 12 },
        c: { min: 4, max: 10 }
      },
      contraintes: ["a + b + c <= 60", "a + b + c >= 25"],
      enonces: [
        "Le pirate a {a} pièces. Il en gagne {b}, puis {c}. Combien en a-t-il ?",
        "{a} pièces dans le coffre, {b} dans la bourse et {c} dans la poche. Combien en tout ?",
        "Malo reçoit {a} pièces, puis {b}, puis {c}. Combien en a-t-il ?"
      ],
      operation: "+",
      reponse: "a + b + c",
      unite: "pièces",
      lecon: "deuxEtapes"
    },

    {
      id: "add-fournee-40",
      ile: "addition",
      niveau: 4,
      competence: "add.deuxEtapes",
      difficulte: 3,
      nombres: {
        a: { min: 12, max: 20 },
        b: { min: 6, max: 12 },
        c: { min: 4, max: 8 }
      },
      contraintes: ["a + b + c <= 50", "a + b + c >= 22"],
      enonces: [
        "Le cuisinier prépare {a} biscuits, puis {b}, puis {c}. Combien de biscuits en tout ?",
        "{a} biscuits dans un bocal, {b} dans un autre et {c} sur la table. Combien en tout ?",
        "On cuit {a} biscuits le matin, {b} à midi et {c} le soir. Combien de biscuits en tout ?"
      ],
      operation: "+",
      reponse: "a + b + c",
      unite: "biscuits",
      lecon: "deuxEtapes"
    }
  ]);
})(window.Quete);
