/* ============================================================
   Énoncés — SOUSTRACTION (île « Le Gouffre des Disparus »)
   40 énoncés : 10 par niveau. Chaque énoncé garde le même objet
   dans ses trois formulations.
   ============================================================ */
(function (Q) {
  Q.registerEnonces([

    /* ================= NIVEAU 1 — jusqu'à 10 et jusqu'à 20 ================= */

    {
      id: "sub-crabes-01",
      ile: "soustraction",
      niveau: 1,
      competence: "sub.dans10",
      difficulte: 1,
      nombres: {
        a: { min: 5, max: 10 },
        b: { min: 2, max: 4 }
      },
      contraintes: ["a > b", "a - b >= 1", "a - b <= 9", "a != 2 * b"],
      enonces: [
        "Il y a {a} crabes sur le rocher. {b} s'en vont vers la mer. Combien de crabes reste-t-il ?",
        "La plage compte {a} crabes. {b} filent se cacher. Combien de crabes en reste-t-il ?",
        "{a} crabes dorment au soleil. {b} se réveillent et partent. Combien de crabes restent-ils ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "crabes",
      lecon: "calcul"
    },

    {
      id: "sub-bougies-09",
      ile: "soustraction",
      niveau: 1,
      competence: "sub.dans10",
      difficulte: 1,
      nombres: {
        a: { min: 5, max: 10 },
        b: { min: 2, max: 4 }
      },
      contraintes: ["a > b", "a - b >= 1", "a - b <= 8", "a != 2 * b"],
      enonces: [
        "{a} bougies sont allumées dans la cabane. {b} s'éteignent. Combien de bougies restent allumées ?",
        "Il y a {a} bougies allumées. Le vent en éteint {b}. Combien de bougies restent allumées ?",
        "{a} bougies éclairent le pont. {b} s'éteignent. Combien de bougies éclairent encore ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "bougies",
      lecon: "calcul"
    },

    {
      id: "sub-poissons-10",
      ile: "soustraction",
      niveau: 1,
      competence: "sub.dans10",
      difficulte: 1,
      nombres: {
        a: { min: 5, max: 10 },
        b: { min: 2, max: 4 }
      },
      contraintes: ["a > b", "a - b >= 1", "a - b <= 8", "a != 2 * b"],
      enonces: [
        "Le seau contient {a} poissons. Le chat en mange {b}. Combien de poissons reste-t-il ?",
        "{a} poissons nagent dans le seau. Malo en retire {b}. Combien de poissons restent-ils ?",
        "Il y a {a} poissons dans l'épuisette. {b} s'échappent. Combien de poissons reste-t-il ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "poissons",
      lecon: "calcul"
    },

    {
      id: "sub-perles-11",
      ile: "soustraction",
      niveau: 1,
      competence: "sub.dans10",
      difficulte: 1,
      nombres: {
        a: { min: 5, max: 10 },
        b: { min: 2, max: 4 }
      },
      contraintes: ["a > b", "a - b >= 1", "a - b <= 8", "a != 2 * b"],
      enonces: [
        "Malo a {a} perles. Il en perd {b}. Combien de perles lui reste-t-il ?",
        "Le fil porte {a} perles. {b} se détachent. Combien de perles restent sur le fil ?",
        "Il y a {a} perles dans la boîte. On en retire {b}. Combien de perles restent-elles ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "perles",
      lecon: "calcul"
    },

    {
      id: "sub-jetons-12",
      ile: "soustraction",
      niveau: 1,
      competence: "sub.dans10",
      difficulte: 1,
      nombres: {
        a: { min: 5, max: 10 },
        b: { min: 2, max: 4 }
      },
      contraintes: ["a > b", "a - b >= 1", "a - b <= 8", "a != 2 * b"],
      enonces: [
        "{a} jetons sont sur la table. On en retire {b}. Combien de jetons restent-ils ?",
        "Malo aligne {a} jetons. Il en enlève {b}. Combien de jetons reste-t-il ?",
        "La boîte contient {a} jetons. On en prend {b}. Combien de jetons restent-ils ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "jetons",
      lecon: "calcul"
    },

    {
      id: "sub-dans20-06",
      ile: "soustraction",
      niveau: 1,
      competence: "sub.dans20",
      difficulte: 2,
      nombres: {
        a: { min: 11, max: 18 },
        b: { min: 3, max: 9 }
      },
      contraintes: ["a > b", "a - b >= 2", "a - b <= 15", "a != 2 * b"],
      enonces: [
        "Il y a {a} boulets dans le tonneau. On en sort {b}. Combien de boulets reste-t-il ?",
        "Le tonneau contient {a} boulets. Le canon en prend {b}. Combien de boulets reste-t-il ?",
        "{a} boulets sont empilés. {b} roulent au sol. Combien de boulets restent sur le tas ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "boulets",
      lecon: "emprunt"
    },

    {
      id: "sub-biscuits-13",
      ile: "soustraction",
      niveau: 1,
      competence: "sub.dans20",
      difficulte: 2,
      nombres: {
        a: { min: 11, max: 18 },
        b: { min: 3, max: 9 }
      },
      contraintes: ["a > b", "a - b >= 2", "a - b <= 15", "a != 2 * b"],
      enonces: [
        "{a} biscuits sont dans la boîte. On en mange {b}. Combien de biscuits reste-t-il ?",
        "Le cuisinier a {a} biscuits. L'équipage en mange {b}. Combien de biscuits reste-t-il ?",
        "Il y a {a} biscuits sur la table. On en range {b}. Combien de biscuits restent-ils ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "biscuits",
      lecon: "emprunt"
    },

    {
      id: "sub-voiles-14",
      ile: "soustraction",
      niveau: 1,
      competence: "sub.dans20",
      difficulte: 2,
      nombres: {
        a: { min: 11, max: 18 },
        b: { min: 3, max: 9 }
      },
      contraintes: ["a > b", "a - b >= 2", "a - b <= 15", "a != 2 * b"],
      enonces: [
        "Le navire a {a} voiles. {b} sont déchirées. Combien de voiles sont intactes ?",
        "Il y a {a} voiles sur le mât. La tempête en abîme {b}. Combien de voiles restent bonnes ?",
        "Le bateau compte {a} voiles. On en démonte {b}. Combien de voiles restent en place ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "voiles",
      lecon: "emprunt"
    },

    {
      id: "sub-places-15",
      ile: "soustraction",
      niveau: 1,
      competence: "sub.dans20",
      difficulte: 2,
      nombres: {
        a: { min: 11, max: 18 },
        b: { min: 3, max: 9 }
      },
      contraintes: ["a > b", "a - b >= 2", "a - b <= 15", "a != 2 * b"],
      enonces: [
        "La barque a {a} places. {b} sont prises. Combien de places restent libres ?",
        "Il y a {a} places dans la barque. {b} pirates s'assoient. Combien de places restent libres ?",
        "La chaloupe peut asseoir {a} personnes. {b} sont déjà à bord. Combien de places restent-elles ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "places",
      lecon: "emprunt"
    },

    {
      id: "sub-coco-16",
      ile: "soustraction",
      niveau: 1,
      competence: "sub.dans20",
      difficulte: 2,
      nombres: {
        a: { min: 11, max: 18 },
        b: { min: 3, max: 9 }
      },
      contraintes: ["a > b", "a - b >= 2", "a - b <= 15", "a != 2 * b"],
      enonces: [
        "Il y a {a} noix de coco. On en casse {b}. Combien de noix de coco reste-t-il ?",
        "Le singe a {a} noix de coco. Il en ouvre {b}. Combien de noix de coco reste-t-il ?",
        "{a} noix de coco sont dans le panier. On en retire {b}. Combien en reste-t-il ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "noix de coco",
      lecon: "emprunt"
    },

    /* ================= NIVEAU 2 — soustraction avec emprunt ================= */

    {
      id: "sub-coco-02",
      ile: "soustraction",
      niveau: 2,
      competence: "sub.emprunt",
      difficulte: 2,
      nombres: {
        a: { min: 21, max: 58 },
        b: { min: 3, max: 9 }
      },
      contraintes: ["a > b", "a - b >= 2", "emprunts(a, b) == 1"],
      enonces: [
        "Le sac contient {a} noix de coco. L'équipage en mange {b}. Combien de noix de coco reste-t-il ?",
        "Il y a {a} noix de coco dans la réserve. On en retire {b}. Combien en reste-t-il ?",
        "Le singe a {a} noix de coco. Il en cache {b} dans un trou. Combien lui en reste-t-il ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "noix de coco",
      lecon: "emprunt"
    },

    {
      id: "sub-places-07",
      ile: "soustraction",
      niveau: 2,
      competence: "sub.emprunt",
      difficulte: 2,
      nombres: {
        a: { min: 32, max: 68 },
        b: { min: 5, max: 9 }
      },
      contraintes: ["a > b", "a - b >= 20", "emprunts(a, b) == 1"],
      enonces: [
        "La barque a {a} places. {b} pirates sont déjà assis. Combien de places restent libres ?",
        "Il y a {a} hamacs sur le navire. {b} sont occupés. Combien de hamacs sont libres ?",
        "Le pont peut porter {a} caisses. {b} sont déjà chargées. Combien de caisses peut-on encore charger ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "places",
      lecon: "emprunt"
    },

    {
      id: "sub-boulets-17",
      ile: "soustraction",
      niveau: 2,
      competence: "sub.emprunt",
      difficulte: 2,
      nombres: {
        a: { min: 21, max: 58 },
        b: { min: 4, max: 9 }
      },
      contraintes: ["a > b", "a - b >= 2", "emprunts(a, b) == 1"],
      enonces: [
        "Le tonneau contient {a} boulets. On en tire {b}. Combien de boulets reste-t-il ?",
        "Il y a {a} boulets dans la soute. Le canon en utilise {b}. Combien en reste-t-il ?",
        "{a} boulets sont rangés. On en sort {b}. Combien de boulets restent-ils ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "boulets",
      lecon: "emprunt"
    },

    {
      id: "sub-biscuits-18",
      ile: "soustraction",
      niveau: 2,
      competence: "sub.emprunt",
      difficulte: 2,
      nombres: {
        a: { min: 24, max: 59 },
        b: { min: 3, max: 9 }
      },
      contraintes: ["a > b", "a - b >= 5", "emprunts(a, b) == 1"],
      enonces: [
        "{a} biscuits sont dans le coffre. On en mange {b}. Combien de biscuits reste-t-il ?",
        "Le cuisinier a préparé {a} biscuits. L'équipage en prend {b}. Combien en reste-t-il ?",
        "Il y a {a} biscuits sur l'étagère. On en range {b}. Combien de biscuits restent-ils ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "biscuits",
      lecon: "emprunt"
    },

    {
      id: "sub-coquillages-19",
      ile: "soustraction",
      niveau: 2,
      competence: "sub.emprunt",
      difficulte: 2,
      nombres: {
        a: { min: 22, max: 57 },
        b: { min: 4, max: 9 }
      },
      contraintes: ["a > b", "a - b >= 5", "emprunts(a, b) == 1"],
      enonces: [
        "Malo a {a} coquillages. Il en perd {b}. Combien de coquillages lui reste-t-il ?",
        "Le seau contient {a} coquillages. On en retire {b}. Combien en reste-t-il ?",
        "Il y a {a} coquillages dans le panier. {b} tombent. Combien de coquillages restent-ils ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "coquillages",
      lecon: "emprunt"
    },

    {
      id: "sub-caisses-20",
      ile: "soustraction",
      niveau: 2,
      competence: "sub.emprunt",
      difficulte: 2,
      nombres: {
        a: { min: 33, max: 88 },
        b: { min: 12, max: 28 }
      },
      contraintes: ["a > b", "a - b >= 10", "emprunts(a, b) == 1", "a != 2 * b"],
      enonces: [
        "Le navire transporte {a} caisses. On en débarque {b}. Combien de caisses restent à bord ?",
        "Il y a {a} caisses dans la cale. On en sort {b}. Combien en reste-t-il ?",
        "{a} caisses sont empilées. On en enlève {b}. Combien de caisses restent-elles ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "caisses",
      lecon: "emprunt"
    },

    {
      id: "sub-passagers-21",
      ile: "soustraction",
      niveau: 2,
      competence: "sub.emprunt",
      difficulte: 2,
      nombres: {
        a: { min: 34, max: 87 },
        b: { min: 13, max: 29 }
      },
      contraintes: ["a > b", "a - b >= 10", "emprunts(a, b) == 1", "a != 2 * b"],
      enonces: [
        "{a} passagers sont à bord. {b} descendent au port. Combien de passagers restent-ils ?",
        "Le bateau transporte {a} passagers. {b} débarquent. Combien de passagers restent-ils ?",
        "Il y a {a} passagers sur le pont. {b} rentrent chez eux. Combien de passagers restent-ils ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "passagers",
      lecon: "emprunt"
    },

    {
      id: "sub-planches-22",
      ile: "soustraction",
      niveau: 2,
      competence: "sub.emprunt",
      difficulte: 2,
      nombres: {
        a: { min: 31, max: 86 },
        b: { min: 12, max: 27 }
      },
      contraintes: ["a > b", "a - b >= 10", "emprunts(a, b) == 1", "a != 2 * b"],
      enonces: [
        "Une planche mesure {a} cm. On en coupe {b} cm. Combien de cm reste-t-il ?",
        "Le mât mesure {a} cm. On en retire {b} cm. Quelle longueur reste-t-il ?",
        "Le cordage mesure {a} cm. On en utilise {b} cm. Combien de cm restent-ils ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "cm",
      lecon: "emprunt"
    },

    {
      id: "sub-pieces-23",
      ile: "soustraction",
      niveau: 2,
      competence: "sub.emprunt",
      difficulte: 2,
      nombres: {
        a: { min: 32, max: 89 },
        b: { min: 14, max: 28 }
      },
      contraintes: ["a > b", "a - b >= 10", "emprunts(a, b) == 1", "a != 2 * b"],
      enonces: [
        "Le coffre contient {a} pièces. On en retire {b}. Combien de pièces reste-t-il ?",
        "Malo a {a} pièces. Il en dépense {b}. Combien de pièces lui reste-t-il ?",
        "Il y a {a} pièces dans la bourse. On en prend {b}. Combien de pièces restent-elles ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "pièces",
      lecon: "emprunt"
    },

    {
      id: "sub-hamacs-24",
      ile: "soustraction",
      niveau: 2,
      competence: "sub.emprunt",
      difficulte: 2,
      nombres: {
        a: { min: 35, max: 85 },
        b: { min: 12, max: 26 }
      },
      contraintes: ["a > b", "a - b >= 10", "emprunts(a, b) == 1", "a != 2 * b"],
      enonces: [
        "Le navire a {a} hamacs. {b} sont occupés. Combien de hamacs restent libres ?",
        "Il y a {a} hamacs sous le pont. {b} marins y dorment. Combien de hamacs restent libres ?",
        "{a} hamacs sont tendus. On en décroche {b}. Combien de hamacs restent-ils ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "hamacs",
      lecon: "emprunt"
    },

    /* ================= NIVEAU 3 — écarts, compléments, centaines ================= */

    {
      id: "sub-pirates-03",
      ile: "soustraction",
      niveau: 3,
      competence: "sub.ecart",
      difficulte: 2,
      nombres: {
        a: { min: 40, max: 90 },
        b: { min: 12, max: 38 }
      },
      contraintes: ["a > b", "a - b >= 5", "emprunts(a, b) <= 1", "a != 2 * b"],
      enonces: [
        "{a} pirates sont sur le pont, {b} sont dans la cale. Combien de pirates de plus sur le pont ?",
        "Le navire transporte {a} pirates sur le pont et {b} sous le pont. Combien de pirates de plus sur le pont ?",
        "Il y a {a} pirates à l'avant et {b} à l'arrière. Combien de pirates de plus à l'avant ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "pirates",
      lecon: "sens"
    },

    {
      id: "sub-voiles-25",
      ile: "soustraction",
      niveau: 3,
      competence: "sub.ecart",
      difficulte: 2,
      nombres: {
        a: { min: 40, max: 90 },
        b: { min: 12, max: 38 }
      },
      contraintes: ["a > b", "a - b >= 5", "emprunts(a, b) <= 1", "a != 2 * b"],
      enonces: [
        "Il y a {a} voiles blanches et {b} voiles noires. Combien de voiles blanches de plus ?",
        "Le navire a {a} voiles hissées et {b} rangées. Combien de voiles hissées de plus ?",
        "{a} voiles sont neuves, {b} sont usées. Combien de voiles neuves de plus ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "voiles",
      lecon: "sens"
    },

    {
      id: "sub-coquillages-26",
      ile: "soustraction",
      niveau: 3,
      competence: "sub.ecart",
      difficulte: 2,
      nombres: {
        a: { min: 40, max: 90 },
        b: { min: 12, max: 38 }
      },
      contraintes: ["a > b", "a - b >= 5", "emprunts(a, b) <= 1", "a != 2 * b"],
      enonces: [
        "{a} coquillages dans le panier, {b} dans le seau. Combien de coquillages de plus dans le panier ?",
        "Malo a {a} coquillages, son frère en a {b}. Combien de coquillages Malo a-t-il de plus ?",
        "{a} coquillages blancs et {b} roses. Combien de coquillages blancs de plus ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "coquillages",
      lecon: "sens"
    },

    {
      id: "sub-caisses-27",
      ile: "soustraction",
      niveau: 3,
      competence: "sub.ecart",
      difficulte: 2,
      nombres: {
        a: { min: 40, max: 90 },
        b: { min: 12, max: 38 }
      },
      contraintes: ["a > b", "a - b >= 5", "emprunts(a, b) <= 1", "a != 2 * b"],
      enonces: [
        "{a} caisses sur le pont, {b} dans la cale. Combien de caisses de plus sur le pont ?",
        "Le navire a {a} caisses pleines et {b} vides. Combien de caisses pleines de plus ?",
        "{a} caisses sont chargées, {b} sont déchargées. Combien de caisses chargées de plus ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "caisses",
      lecon: "sens"
    },

    {
      id: "sub-complement-28",
      ile: "soustraction",
      niveau: 3,
      competence: "sub.complement",
      difficulte: 2,
      nombres: {
        a: { min: 15, max: 85 }
      },
      contraintes: ["a % 10 != 0", "100 - a >= 5"],
      enonces: [
        "Le trésor valait 100 pièces. Il en reste {a}. Combien de pièces ont été prises ?",
        "Il y avait 100 pièces dans le coffre. Il en reste {a}. Combien en a-t-on retiré ?",
        "Le coffre contenait 100 pièces. Il en contient {a} maintenant. Combien de pièces ont disparu ?"
      ],
      operation: "−",
      reponse: "100 - a",
      unite: "pièces",
      lecon: "complement"
    },

    {
      id: "sub-complement-29",
      ile: "soustraction",
      niveau: 3,
      competence: "sub.complement",
      difficulte: 2,
      nombres: {
        a: { min: 12, max: 88 }
      },
      contraintes: ["a % 10 != 0", "100 - a >= 5"],
      enonces: [
        "La réserve contenait 100 boulets. Il en reste {a}. Combien de boulets ont été tirés ?",
        "Il y avait 100 boulets dans le tonneau. Il en reste {a}. Combien en a-t-on utilisé ?",
        "Le tonneau de 100 boulets n'en contient plus que {a}. Combien de boulets manquent ?"
      ],
      operation: "−",
      reponse: "100 - a",
      unite: "boulets",
      lecon: "complement"
    },

    {
      id: "sub-complement-30",
      ile: "soustraction",
      niveau: 3,
      competence: "sub.complement",
      difficulte: 2,
      nombres: {
        a: { min: 16, max: 84 }
      },
      contraintes: ["a % 10 != 0", "100 - a >= 8"],
      enonces: [
        "Il y avait 100 coquillages sur la plage. Il en reste {a}. Combien ont été ramassés ?",
        "Le seau contenait 100 coquillages. Il en reste {a}. Combien en a-t-on sorti ?",
        "Sur 100 coquillages, il en reste {a}. Combien de coquillages ont été pris ?"
      ],
      operation: "−",
      reponse: "100 - a",
      unite: "coquillages",
      lecon: "complement"
    },

    {
      id: "sub-centaines-31",
      ile: "soustraction",
      niveau: 3,
      competence: "sub.centaines",
      difficulte: 2,
      nombres: {
        a: { min: 320, max: 890 },
        b: { min: 120, max: "a - 1" }
      },
      contraintes: ["a - b >= 50", "emprunts(a, b) <= 2", "b % 10 != 0", "a != 2 * b"],
      enonces: [
        "Le câble mesure {a} m. On en coupe {b} m. Combien de mètres restent-ils ?",
        "La corde mesure {a} m. On en utilise {b} m. Quelle longueur reste-t-il ?",
        "Le filin mesure {a} m. On en retire {b} m. Combien de mètres restent-ils ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "mètres",
      lecon: "emprunt"
    },

    {
      id: "sub-centaines-32",
      ile: "soustraction",
      niveau: 3,
      competence: "sub.centaines",
      difficulte: 2,
      nombres: {
        a: { min: 320, max: 890 },
        b: { min: 120, max: "a - 1" }
      },
      contraintes: ["a - b >= 50", "emprunts(a, b) <= 2", "b % 10 != 0", "a != 2 * b"],
      enonces: [
        "Le trésor contenait {a} pièces. On en a pris {b}. Combien de pièces restent-elles ?",
        "Il y avait {a} pièces dans le coffre. On en retire {b}. Combien en reste-t-il ?",
        "Le pirate avait {a} pièces. Il en dépense {b}. Combien lui en reste-t-il ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "pièces",
      lecon: "emprunt"
    },

    {
      id: "sub-pose-05",
      ile: "soustraction",
      niveau: 3,
      competence: "sub.centaines",
      difficulte: 2,
      mode: "pose",
      nombres: {
        a: { min: 320, max: 899 },
        b: { min: 120, max: "a - 1" }
      },
      contraintes: ["a - b >= 50", "emprunts(a, b) <= 2", "b % 10 != 0", "a != 2 * b"],
      enonce: "{a} − {b}",
      consigne: "Pose la soustraction en colonnes, puis écris le résultat.",
      operation: "−",
      reponse: "a - b",
      lecon: "emprunt"
    },

    /* ================= NIVEAU 4 — monnaie et décimaux ================= */

    {
      id: "sub-sabre-04",
      ile: "soustraction",
      niveau: 4,
      competence: "sub.monnaie",
      difficulte: 3,
      nombres: {
        a: { min: 8, max: 25 },
        b: { min: 26, max: 60 }
      },
      contraintes: ["b > a", "b - a >= 2", "b - a <= 50", "b != 2 * a"],
      enonces: [
        "Malo a {a} pièces. Un sabre coûte {b} pièces. Combien de pièces lui manque-t-il ?",
        "Le sabre coûte {b} pièces. Malo n'en a que {a}. Combien de pièces lui manque-t-il ?",
        "Malo veut acheter une carte à {b} pièces. Il a {a} pièces. Combien lui manque-t-il ?"
      ],
      operation: "−",
      reponse: "b - a",
      unite: "pièces",
      lecon: "sens"
    },

    {
      id: "sub-monnaie-33",
      ile: "soustraction",
      niveau: 4,
      competence: "sub.monnaie",
      difficulte: 3,
      nombres: {
        a: { min: 9, max: 28 },
        b: { min: 29, max: 65 }
      },
      contraintes: ["b > a", "b - a >= 3", "b - a <= 55", "b != 2 * a"],
      enonces: [
        "Malo a {a} pièces. La boussole coûte {b} pièces. Combien lui manque-t-il ?",
        "La boussole coûte {b} pièces. Malo a {a} pièces. Combien lui manque-t-il ?",
        "Malo veut une boussole à {b} pièces. Il n'a que {a} pièces. Combien lui manque-t-il ?"
      ],
      operation: "−",
      reponse: "b - a",
      unite: "pièces",
      lecon: "sens"
    },

    {
      id: "sub-monnaie-34",
      ile: "soustraction",
      niveau: 4,
      competence: "sub.monnaie",
      difficulte: 3,
      nombres: {
        a: { min: 10, max: 30 },
        b: { min: 31, max: 70 }
      },
      contraintes: ["b > a", "b - a >= 5", "b - a <= 60", "b != 2 * a"],
      enonces: [
        "Malo a {a} pièces. Le coffre coûte {b} pièces. Combien lui manque-t-il ?",
        "Le coffre coûte {b} pièces. Malo a {a} pièces. Combien lui manque-t-il ?",
        "Pour acheter un coffre à {b} pièces, combien manque-t-il à Malo qui a {a} pièces ?"
      ],
      operation: "−",
      reponse: "b - a",
      unite: "pièces",
      lecon: "sens"
    },

    {
      id: "sub-rendu-35",
      ile: "soustraction",
      niveau: 4,
      competence: "sub.monnaie",
      difficulte: 3,
      nombres: {
        a: { min: 30, max: 80 },
        b: { min: 12, max: "a - 1" }
      },
      contraintes: ["a > b", "a - b >= 2", "a - b <= 30", "a != 2 * b"],
      enonces: [
        "Malo paie avec {a} pièces. Le sabre coûte {b} pièces. Combien lui rend-on ?",
        "Le sabre coûte {b} pièces. Malo donne {a} pièces. Combien lui rend-on ?",
        "Malo tend {a} pièces pour un sabre à {b} pièces. Combien doit-on lui rendre ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "pièces",
      lecon: "sens"
    },

    {
      id: "sub-rendu-36",
      ile: "soustraction",
      niveau: 4,
      competence: "sub.monnaie",
      difficulte: 3,
      nombres: {
        a: { min: 35, max: 85 },
        b: { min: 15, max: "a - 1" }
      },
      contraintes: ["a > b", "a - b >= 3", "a - b <= 35", "a != 2 * b"],
      enonces: [
        "Malo paie avec {a} pièces. La carte coûte {b} pièces. Combien lui rend-on ?",
        "La carte coûte {b} pièces. Malo donne {a} pièces. Combien lui rend-on ?",
        "Pour une carte à {b} pièces, Malo tend {a} pièces. Combien doit-on lui rendre ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "pièces",
      lecon: "sens"
    },

    {
      id: "sub-decimaux-08",
      ile: "soustraction",
      niveau: 4,
      competence: "sub.decimaux",
      difficulte: 3,
      decimales: 1,
      nombres: {
        a: { min: 4, max: 15, multipleDe: 0.5, decimales: 1 },
        b: { min: 1, max: 6, multipleDe: 0.5, decimales: 1 }
      },
      contraintes: ["a > b", "a - b >= 1", "a != 2 * b"],
      enonces: [
        "Une corde mesure {a} m. On en coupe {b} m. Combien de mètres restent-ils ?",
        "Le câble mesure {a} m. On en utilise {b} m. Combien en reste-t-il ?",
        "Une voile de {a} m de long est coupée de {b} m. Quelle longueur reste-t-il ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "mètres",
      lecon: "decimaux"
    },

    {
      id: "sub-decimaux-38",
      ile: "soustraction",
      niveau: 4,
      competence: "sub.decimaux",
      difficulte: 3,
      decimales: 1,
      nombres: {
        a: { min: 4, max: 15, multipleDe: 0.5, decimales: 1 },
        b: { min: 1, max: 6, multipleDe: 0.5, decimales: 1 }
      },
      contraintes: ["a > b", "a - b >= 1", "a != 2 * b"],
      enonces: [
        "Un sac pèse {a} kg. On en retire {b} kg. Combien de kg reste-t-il ?",
        "La caisse pèse {a} kg. On en enlève {b} kg. Combien pèse-t-elle maintenant ?",
        "Malo porte {a} kg de biscuits. Il en donne {b} kg. Combien en porte-t-il encore ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "kg",
      lecon: "decimaux"
    },

    {
      id: "sub-decimaux-39",
      ile: "soustraction",
      niveau: 4,
      competence: "sub.decimaux",
      difficulte: 3,
      decimales: 1,
      nombres: {
        a: { min: 4, max: 15, multipleDe: 0.5, decimales: 1 },
        b: { min: 1, max: 6, multipleDe: 0.5, decimales: 1 }
      },
      contraintes: ["a > b", "a - b >= 1", "a != 2 * b"],
      enonces: [
        "Le tonneau contient {a} L d'eau. On en verse {b} L. Combien de litres restent-ils ?",
        "Il y a {a} L de jus. On en boit {b} L. Combien de litres reste-t-il ?",
        "La citerne contient {a} L. On en retire {b} L. Combien de litres restent-ils ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "litres",
      lecon: "decimaux"
    },

    {
      id: "sub-decimaux-40",
      ile: "soustraction",
      niveau: 4,
      competence: "sub.decimaux",
      difficulte: 3,
      decimales: 1,
      nombres: {
        a: { min: 5, max: 18, multipleDe: 0.5, decimales: 1 },
        b: { min: 1, max: 7, multipleDe: 0.5, decimales: 1 }
      },
      contraintes: ["a > b", "a - b >= 1", "a != 2 * b"],
      enonces: [
        "Le mât mesure {a} m. On en coupe {b} m. Quelle hauteur reste-t-il ?",
        "La planche mesure {a} m. On en scie {b} m. Combien de mètres restent-ils ?",
        "Le câble mesure {a} m. On en perd {b} m. Quelle longueur reste-t-il ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "mètres",
      lecon: "decimaux"
    },

    {
      id: "sub-decimaux-41",
      ile: "soustraction",
      niveau: 4,
      competence: "sub.decimaux",
      difficulte: 3,
      decimales: 1,
      nombres: {
        a: { min: 5, max: 15, multipleDe: 0.5, decimales: 1 },
        b: { min: 1, max: 6, multipleDe: 0.5, decimales: 1 }
      },
      contraintes: ["a > b", "a - b >= 1", "a != 2 * b"],
      enonces: [
        "Malo a {a} €. Il dépense {b} €. Combien d'euros lui reste-t-il ?",
        "Malo possède {a} €. Il paie {b} €. Combien lui reste-t-il ?",
        "La bourse contient {a} €. On en sort {b} €. Combien d'euros restent-ils ?"
      ],
      operation: "−",
      reponse: "a - b",
      unite: "euros",
      lecon: "decimaux"
    }
  ]);
})(window.Quete);
