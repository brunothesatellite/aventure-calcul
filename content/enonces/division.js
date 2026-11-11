/* ============================================================
   Énoncés — DIVISION (île « Le Port du Partage »)

   - quotient seul (division exacte, niveaux 1-2)
   - quotient ET reste (division euclidienne, niveau 3)
   ============================================================ */
(function (Q) {
  Q.registerEnonces([

    {
      id: "div-coquillages-01",
      ile: "division",
      niveau: 1,
      competence: "div.moitie",
      difficulte: 1,
      nombres: {
        a: { min: 8, max: 40, multipleDe: 2 }
      },
      contraintes: ["a / 2 >= 4"],
      enonces: [
        "Malo partage {a} coquillages entre 2 pirates. Combien chacun en reçoit-il ?",
        "On répartit {a} coquillages dans 2 paniers. Combien par panier ?",
        "{a} coquillages sont partagés en 2 parts égales. Combien dans chaque part ?"
      ],
      operation: "÷",
      reponse: "a / 2",
      unite: "coquillages",
      lecon: "partage"
    },

    {
      id: "div-boulets-02",
      ile: "division",
      niveau: 3,
      competence: "div.reste",
      difficulte: 3,
      nombres: {
        q: { min: 3, max: 9 },
        b: { min: 3, max: 8 },
        r: { min: 1, max: "b - 1" },
        a: { calc: "q * b + r" }
      },
      contraintes: ["r < b", "a <= 100", "q >= 3", "q != b"],
      enonces: [
        "On range {a} boulets dans des caisses de {b}. Combien de caisses pleines, et combien de boulets restent dehors ?",
        "Le canon a {a} boulets à ranger par caisses de {b}. Combien de caisses pleines, et combien reste-t-il de boulets ?",
        "{a} boulets sont mis dans des caisses de {b} places. Combien de caisses remplit-on, et combien de boulets restent ?"
      ],
      operation: "÷",
      reponse: { quotient: "q", reste: "r" },
      champs: ["quotient", "reste"],
      labels: { quotient: "Caisses pleines", reste: "Boulets restants" },
      unite: "boulets",
      lecon: "reste"
    },

    {
      id: "div-membres-03",
      ile: "division",
      niveau: 2,
      competence: "div.inverse",
      difficulte: 2,
      nombres: {
        q: { min: 2, max: 9 },
        b: { min: 2, max: 8 },
        a: { calc: "q * b" }
      },
      contraintes: ["a <= 72", "q >= 2", "b != q"],
      enonces: [
        "Le pirate partage {a} pièces entre les membres de son équipage. Chaque membre reçoit {q} pièces. Combien y a-t-il de membres ?",
        "On distribue {a} pièces à parts égales. Chacun reçoit {q} pièces. Combien y a-t-il de personnes ?",
        "{a} pièces sont réparties. Chaque pirate en reçoit {q}. Combien de pirates y a-t-il ?"
      ],
      operation: "÷",
      reponse: "b",
      lecon: "inverse"
    },

    {
      id: "div-barques-04",
      ile: "division",
      niveau: 4,
      competence: "div.partage",
      difficulte: 3,
      nombres: {
        q: { min: 3, max: 9 },
        b: { min: 2, max: 6 },
        a: { calc: "q * b" }
      },
      contraintes: ["a <= 200", "q >= 3", "q != b"],
      enonces: [
        "{a} pirates montent dans {b} barques identiques. Combien de pirates y a-t-il dans chaque barque ?",
        "On répartit {a} pirates dans {b} barques. Combien de pirates par barque ?",
        "{a} pirates se placent également dans {b} barques. Combien par barque ?"
      ],
      operation: "÷",
      reponse: "q",
      unite: "pirates",
      lecon: "partage"
    },

    {
      id: "div-tresor-05",
      ile: "division",
      niveau: 1,
      competence: "div.table-10",
      difficulte: 1,
      nombres: {
        a: { min: 20, max: 120, multipleDe: 10 }
      },
      contraintes: ["a / 10 >= 2"],
      enonces: [
        "Le trésor de {a} pièces est partagé entre 10 pirates. Combien chacun reçoit-il ?",
        "On partage un trésor de {a} pièces en 10 parts égales. Combien par part ?",
        "{a} pièces sont réparties entre 10 pirates. Combien chacun en reçoit-il ?"
      ],
      operation: "÷",
      reponse: "a / 10",
      unite: "pièces",
      lecon: "dizaine"
    },

    {
      id: "div-table5-06",
      ile: "division",
      niveau: 2,
      competence: "div.table-5",
      difficulte: 2,
      nombres: {
        a: { min: 15, max: 60, multipleDe: 5 }
      },
      contraintes: ["a / 5 >= 3"],
      enonces: [
        "{a} pièces sont partagées entre 5 pirates. Combien chacun reçoit-il ?",
        "On répartit {a} pièces en 5 parts égales. Combien par part ?",
        "{a} coquillages remplissent 5 sacs identiques. Combien par sac ?"
      ],
      operation: "÷",
      reponse: "a / 5",
      lecon: "partage"
    },

    {
      id: "div-boites-07",
      ile: "division",
      niveau: 3,
      competence: "div.reste",
      difficulte: 3,
      nombres: {
        q: { min: 3, max: 9 },
        b: { min: 3, max: 8 },
        r: { min: 1, max: "b - 1" },
        a: { calc: "q * b + r" }
      },
      contraintes: ["r < b", "a <= 100", "q >= 3", "q != b"],
      enonces: [
        "{a} biscuits sont rangés dans des boîtes de {b}. Combien de boîtes pleines, et combien de biscuits restent ?",
        "On range {a} biscuits par boîtes de {b}. Combien de boîtes remplit-on, et combien restent dehors ?",
        "Il y a {a} biscuits à mettre en boîtes de {b}. Combien de boîtes pleines, et combien de biscuits restent ?"
      ],
      operation: "÷",
      reponse: { quotient: "q", reste: "r" },
      champs: ["quotient", "reste"],
      labels: { quotient: "Boîtes pleines", reste: "Biscuits restants" },
      unite: "biscuits",
      lecon: "reste"
    },

    {
      id: "div-partage-08",
      ile: "division",
      niveau: 4,
      competence: "div.partage",
      difficulte: 3,
      nombres: {
        q: { min: 3, max: 9 },
        b: { min: 2, max: 6 },
        a: { calc: "q * b" }
      },
      contraintes: ["a <= 200", "q >= 3", "q != b"],
      enonces: [
        "{a} pièces sont partagées entre {b} pirates. Combien chacun reçoit-il ?",
        "On répartit {a} pièces entre {b} pirates. Combien par pirate ?",
        "{a} coquillages sont partagés entre {b} sacs. Combien par sac ?"
      ],
      operation: "÷",
      reponse: "q",
      lecon: "partage"
    },

    {
      id: "div-corde-09",
      ile: "division",
      niveau: 1,
      competence: "div.moitie",
      difficulte: 2,
      nombres: {
        a: { min: 10, max: 40, multipleDe: 2 }
      },
      contraintes: ["a / 2 >= 5"],
      enonces: [
        "Le pirate coupe {a} m de corde en 2 morceaux égaux. Quelle longueur fait chaque morceau ?",
        "On partage {a} m de corde en 2 parties égales. Combien mesure chaque partie ?",
        "Une corde de {a} m est pliée en 2. Quelle longueur fait chaque moitié ?"
      ],
      operation: "÷",
      reponse: "a / 2",
      unite: "mètres",
      lecon: "partage"
    },

    /* ===== Niveau 1 (suite) : moitié et division par 10 ===== */

    {
      id: "div-moitie-10",
      ile: "division",
      niveau: 1,
      competence: "div.moitie",
      difficulte: 1,
      nombres: { a: { min: 8, max: 40, multipleDe: 2 } },
      contraintes: ["a / 2 >= 4"],
      enonces: [
        "{a} perles sont partagées en 2 colliers identiques. Combien de perles par collier ?",
        "Malo répartit {a} perles dans 2 colliers. Combien de perles par collier ?",
        "On partage {a} perles entre 2 pirates. Combien chacun en reçoit-il ?"
      ],
      operation: "÷",
      reponse: "a / 2",
      unite: "perles",
      lecon: "partage"
    },

    {
      id: "div-moitie-11",
      ile: "division",
      niveau: 1,
      competence: "div.moitie",
      difficulte: 1,
      nombres: { a: { min: 8, max: 40, multipleDe: 2 } },
      contraintes: ["a / 2 >= 4"],
      enonces: [
        "{a} biscuits sont rangés dans 2 boîtes identiques. Combien de biscuits par boîte ?",
        "On partage {a} biscuits en 2 parts égales. Combien par part ?",
        "Le cuisinier met {a} biscuits dans 2 paniers. Combien par panier ?"
      ],
      operation: "÷",
      reponse: "a / 2",
      unite: "biscuits",
      lecon: "partage"
    },

    {
      id: "div-moitie-12",
      ile: "division",
      niveau: 1,
      competence: "div.moitie",
      difficulte: 1,
      nombres: { a: { min: 10, max: 40, multipleDe: 2 } },
      contraintes: ["a / 2 >= 5"],
      enonces: [
        "{a} jetons sont partagés entre 2 joueurs. Combien de jetons par joueur ?",
        "On répartit {a} jetons en 2 tas égaux. Combien par tas ?",
        "Malo donne {a} jetons à 2 amis, à parts égales. Combien chacun en reçoit-il ?"
      ],
      operation: "÷",
      reponse: "a / 2",
      unite: "jetons",
      lecon: "partage"
    },

    {
      id: "div-table10-13",
      ile: "division",
      niveau: 1,
      competence: "div.table-10",
      difficulte: 1,
      nombres: { a: { min: 20, max: 120, multipleDe: 10 } },
      contraintes: ["a / 10 >= 2"],
      enonces: [
        "{a} boulets sont rangés en paquets de 10. Combien de paquets y a-t-il ?",
        "On range {a} boulets par paquets de 10. Combien de paquets remplit-on ?",
        "Le canonnier a {a} boulets. Il fait des paquets de 10. Combien de paquets ?"
      ],
      operation: "÷",
      reponse: "a / 10",
      unite: "paquets",
      lecon: "dizaine"
    },

    {
      id: "div-table10-14",
      ile: "division",
      niveau: 1,
      competence: "div.table-10",
      difficulte: 1,
      nombres: { a: { min: 20, max: 120, multipleDe: 10 } },
      contraintes: ["a / 10 >= 2"],
      enonces: [
        "{a} clous sont rangés en boîtes de 10. Combien de boîtes y a-t-il ?",
        "Le menuisier met {a} clous par boîtes de 10. Combien de boîtes remplit-il ?",
        "Il y a {a} clous. Combien de boîtes de 10 peut-on remplir ?"
      ],
      operation: "÷",
      reponse: "a / 10",
      unite: "boîtes",
      lecon: "dizaine"
    },

    {
      id: "div-table10-15",
      ile: "division",
      niveau: 1,
      competence: "div.table-10",
      difficulte: 1,
      nombres: { a: { min: 20, max: 120, multipleDe: 10 } },
      contraintes: ["a / 10 >= 2"],
      enonces: [
        "{a} coquillages sont répartis en 10 tas égaux. Combien par tas ?",
        "On partage {a} coquillages en 10 parts égales. Combien par part ?",
        "Malo répartit {a} coquillages entre 10 pirates. Combien chacun en reçoit-il ?"
      ],
      operation: "÷",
      reponse: "a / 10",
      unite: "coquillages",
      lecon: "dizaine"
    },

    {
      id: "div-table10-16",
      ile: "division",
      niveau: 1,
      competence: "div.table-10",
      difficulte: 1,
      nombres: { a: { min: 20, max: 120, multipleDe: 10 } },
      contraintes: ["a / 10 >= 2"],
      enonces: [
        "{a} cartes sont rangées en paquets de 10. Combien de paquets y a-t-il ?",
        "On range {a} cartes par paquets de 10. Combien de paquets obtient-on ?",
        "Malo range {a} cartes en 10 paquets égaux. Combien de cartes par paquet ?"
      ],
      operation: "÷",
      reponse: "a / 10",
      unite: "paquets",
      lecon: "dizaine"
    },

    /* ===== Niveau 2 (suite) : division inverse et table de 5 ===== */

    {
      id: "div-inverse-17",
      ile: "division",
      niveau: 2,
      competence: "div.inverse",
      difficulte: 2,
      nombres: {
        q: { min: 2, max: 9 },
        b: { min: 2, max: 8 },
        a: { calc: "q * b" }
      },
      contraintes: ["a <= 72", "q >= 2", "b != q"],
      enonces: [
        "{a} coquillages remplissent des sacs de {q} coquillages. Combien de sacs y a-t-il ?",
        "On range {a} coquillages par sacs de {q}. Combien de sacs remplit-on ?",
        "Malo a {a} coquillages et met {q} coquillages par sac. Combien de sacs utilise-t-il ?"
      ],
      operation: "÷",
      reponse: "b",
      unite: "sacs",
      lecon: "inverse"
    },

    {
      id: "div-inverse-18",
      ile: "division",
      niveau: 2,
      competence: "div.inverse",
      difficulte: 2,
      nombres: {
        q: { min: 2, max: 9 },
        b: { min: 2, max: 8 },
        a: { calc: "q * b" }
      },
      contraintes: ["a <= 72", "q >= 2", "b != q"],
      enonces: [
        "{a} biscuits sont rangés par boîtes de {q}. Combien de boîtes remplit-on ?",
        "Le cuisinier a {a} biscuits et en met {q} par boîte. Combien de boîtes utilise-t-il ?",
        "On range {a} biscuits dans des boîtes de {q}. Combien de boîtes faut-il ?"
      ],
      operation: "÷",
      reponse: "b",
      unite: "boîtes",
      lecon: "inverse"
    },

    {
      id: "div-inverse-19",
      ile: "division",
      niveau: 2,
      competence: "div.inverse",
      difficulte: 2,
      nombres: {
        q: { min: 2, max: 9 },
        b: { min: 2, max: 8 },
        a: { calc: "q * b" }
      },
      contraintes: ["a <= 72", "q >= 2", "b != q"],
      enonces: [
        "{a} pirates montent par barques de {q}. Combien de barques faut-il ?",
        "On répartit {a} pirates par barques de {q}. Combien de barques remplit-on ?",
        "Le capitaine place {a} pirates dans des barques de {q}. Combien de barques utilise-t-il ?"
      ],
      operation: "÷",
      reponse: "b",
      unite: "barques",
      lecon: "inverse"
    },

    {
      id: "div-inverse-20",
      ile: "division",
      niveau: 2,
      competence: "div.inverse",
      difficulte: 2,
      nombres: {
        q: { min: 2, max: 9 },
        b: { min: 2, max: 8 },
        a: { calc: "q * b" }
      },
      contraintes: ["a <= 72", "q >= 2", "b != q"],
      enonces: [
        "{a} boulets sont rangés par tas de {q}. Combien de tas y a-t-il ?",
        "On range {a} boulets en tas de {q}. Combien de tas obtient-on ?",
        "Le canonnier fait des tas de {q} boulets avec {a} boulets. Combien de tas ?"
      ],
      operation: "÷",
      reponse: "b",
      unite: "tas",
      lecon: "inverse"
    },

    {
      id: "div-table5-21",
      ile: "division",
      niveau: 2,
      competence: "div.table-5",
      difficulte: 2,
      nombres: { a: { min: 15, max: 60, multipleDe: 5 } },
      contraintes: ["a / 5 >= 3"],
      enonces: [
        "{a} coquillages sont répartis en 5 sacs égaux. Combien par sac ?",
        "On partage {a} coquillages entre 5 pirates. Combien chacun en reçoit-il ?",
        "Malo répartit {a} coquillages en 5 tas. Combien par tas ?"
      ],
      operation: "÷",
      reponse: "a / 5",
      unite: "coquillages",
      lecon: "partage"
    },

    {
      id: "div-table5-22",
      ile: "division",
      niveau: 2,
      competence: "div.table-5",
      difficulte: 2,
      nombres: { a: { min: 15, max: 60, multipleDe: 5 } },
      contraintes: ["a / 5 >= 3"],
      enonces: [
        "{a} biscuits sont rangés dans 5 boîtes égales. Combien par boîte ?",
        "On partage {a} biscuits en 5 parts égales. Combien par part ?",
        "Le cuisinier met {a} biscuits dans 5 paniers. Combien par panier ?"
      ],
      operation: "÷",
      reponse: "a / 5",
      unite: "biscuits",
      lecon: "partage"
    },

    {
      id: "div-table5-23",
      ile: "division",
      niveau: 2,
      competence: "div.table-5",
      difficulte: 2,
      nombres: { a: { min: 15, max: 60, multipleDe: 5 } },
      contraintes: ["a / 5 >= 3"],
      enonces: [
        "{a} boulets sont répartis en 5 tas égaux. Combien par tas ?",
        "On range {a} boulets en 5 tas. Combien de boulets par tas ?",
        "Le canonnier partage {a} boulets en 5 parts. Combien par part ?"
      ],
      operation: "÷",
      reponse: "a / 5",
      unite: "boulets",
      lecon: "partage"
    },

    {
      id: "div-table5-24",
      ile: "division",
      niveau: 2,
      competence: "div.table-5",
      difficulte: 2,
      nombres: { a: { min: 15, max: 60, multipleDe: 5 } },
      contraintes: ["a / 5 >= 3"],
      enonces: [
        "{a} pièces sont partagées en 5 parts égales. Combien par part ?",
        "On répartit {a} pièces entre 5 pirates. Combien chacun en reçoit-il ?",
        "Malo partage {a} pièces en 5 tas. Combien par tas ?"
      ],
      operation: "÷",
      reponse: "a / 5",
      unite: "pièces",
      lecon: "partage"
    },

    /* ===== Niveau 3 (suite) : quotient et reste ===== */

    {
      id: "div-reste-25",
      ile: "division",
      niveau: 3,
      competence: "div.reste",
      difficulte: 3,
      mode: "potence",
      nombres: {
        q: { min: 12, max: 99 },
        b: { min: 2, max: 9 },
        r: { min: 1, max: "b - 1" },
        a: { calc: "q * b + r" }
      },
      contraintes: ["r < b", "a >= 100", "a <= 999", "q >= 12", "q != b"],
      enonces: [
        "{a} boulets sont rangés dans des caisses de {b}. Combien de caisses pleines, et combien de boulets restent ?",
        "On range {a} boulets par caisses de {b}. Combien de caisses remplit-on, et combien restent dehors ?",
        "Il y a {a} boulets à mettre en caisses de {b}. Combien de caisses pleines, et combien de boulets restent ?"
      ],
      operation: "÷",
      reponse: { quotient: "q", reste: "r" },
      labels: { quotient: "Caisses pleines", reste: "Boulets restants" },
      lecon: "reste"
    },

    {
      id: "div-reste-26",
      ile: "division",
      niveau: 3,
      competence: "div.reste",
      difficulte: 3,
      mode: "potence",
      nombres: {
        q: { min: 12, max: 99 },
        b: { min: 2, max: 9 },
        r: { min: 1, max: "b - 1" },
        a: { calc: "q * b + r" }
      },
      contraintes: ["r < b", "a >= 100", "a <= 999", "q >= 12", "q != b"],
      enonces: [
        "{a} biscuits sont rangés dans des boîtes de {b}. Combien de boîtes pleines, et combien de biscuits restent ?",
        "On range {a} biscuits par boîtes de {b}. Combien de boîtes remplit-on, et combien restent dehors ?",
        "Il y a {a} biscuits à mettre en boîtes de {b}. Combien de boîtes pleines, et combien de biscuits restent ?"
      ],
      operation: "÷",
      reponse: { quotient: "q", reste: "r" },
      labels: { quotient: "Boîtes pleines", reste: "Biscuits restants" },
      lecon: "reste"
    },

    {
      id: "div-reste-27",
      ile: "division",
      niveau: 3,
      competence: "div.reste",
      difficulte: 3,
      mode: "potence",
      nombres: {
        q: { min: 12, max: 99 },
        b: { min: 2, max: 9 },
        r: { min: 1, max: "b - 1" },
        a: { calc: "q * b + r" }
      },
      contraintes: ["r < b", "a >= 100", "a <= 999", "q >= 12", "q != b"],
      enonces: [
        "{a} coquillages sont rangés dans des sacs de {b}. Combien de sacs pleins, et combien de coquillages restent ?",
        "On range {a} coquillages par sacs de {b}. Combien de sacs remplit-on, et combien restent dehors ?",
        "Il y a {a} coquillages à mettre en sacs de {b}. Combien de sacs pleins, et combien restent ?"
      ],
      operation: "÷",
      reponse: { quotient: "q", reste: "r" },
      labels: { quotient: "Sacs pleins", reste: "Coquillages restants" },
      lecon: "reste"
    },

    {
      id: "div-reste-28",
      ile: "division",
      niveau: 3,
      competence: "div.reste",
      difficulte: 3,
      mode: "potence",
      nombres: {
        q: { min: 12, max: 99 },
        b: { min: 2, max: 9 },
        r: { min: 1, max: "b - 1" },
        a: { calc: "q * b + r" }
      },
      contraintes: ["r < b", "a >= 100", "a <= 999", "q >= 12", "q != b"],
      enonces: [
        "{a} pièces sont rangées en tas de {b}. Combien de tas complets, et combien de pièces restent ?",
        "On range {a} pièces par tas de {b}. Combien de tas forme-t-on, et combien de pièces restent ?",
        "Il y a {a} pièces à ranger en tas de {b}. Combien de tas complets, et combien de pièces restent ?"
      ],
      operation: "÷",
      reponse: { quotient: "q", reste: "r" },
      labels: { quotient: "Tas complets", reste: "Pièces restantes" },
      lecon: "reste"
    },

    {
      id: "div-reste-29",
      ile: "division",
      niveau: 3,
      competence: "div.reste",
      difficulte: 3,
      mode: "potence",
      nombres: {
        q: { min: 12, max: 99 },
        b: { min: 2, max: 9 },
        r: { min: 1, max: "b - 1" },
        a: { calc: "q * b + r" }
      },
      contraintes: ["r < b", "a >= 100", "a <= 999", "q >= 12", "q != b"],
      enonces: [
        "{a} pirates montent dans des barques de {b}. Combien de barques pleines, et combien de pirates restent ?",
        "On répartit {a} pirates par barques de {b}. Combien de barques remplit-on, et combien de pirates restent ?",
        "Il y a {a} pirates à placer dans des barques de {b}. Combien de barques pleines, et combien restent ?"
      ],
      operation: "÷",
      reponse: { quotient: "q", reste: "r" },
      labels: { quotient: "Barques pleines", reste: "Pirates restants" },
      lecon: "reste"
    },

    {
      id: "div-reste-30",
      ile: "division",
      niveau: 3,
      competence: "div.reste",
      difficulte: 3,
      mode: "potence",
      nombres: {
        q: { min: 12, max: 99 },
        b: { min: 2, max: 9 },
        r: { min: 1, max: "b - 1" },
        a: { calc: "q * b + r" }
      },
      contraintes: ["r < b", "a >= 100", "a <= 999", "q >= 12", "q != b"],
      enonces: [
        "{a} livres sont rangés sur des étagères de {b}. Combien d'étagères pleines, et combien de livres restent ?",
        "On range {a} livres par étagères de {b}. Combien d'étagères remplit-on, et combien de livres restent ?",
        "Il y a {a} livres à ranger sur des étagères de {b}. Combien d'étagères pleines, et combien restent ?"
      ],
      operation: "÷",
      reponse: { quotient: "q", reste: "r" },
      labels: { quotient: "Étagères pleines", reste: "Livres restants" },
      lecon: "reste"
    },

    {
      id: "div-reste-31",
      ile: "division",
      niveau: 3,
      competence: "div.reste",
      difficulte: 3,
      mode: "potence",
      nombres: {
        q: { min: 12, max: 99 },
        b: { min: 2, max: 9 },
        r: { min: 1, max: "b - 1" },
        a: { calc: "q * b + r" }
      },
      contraintes: ["r < b", "a >= 100", "a <= 999", "q >= 12", "q != b"],
      enonces: [
        "{a} poissons sont rangés dans des filets de {b}. Combien de filets pleins, et combien de poissons restent ?",
        "On range {a} poissons par filets de {b}. Combien de filets remplit-on, et combien de poissons restent ?",
        "Il y a {a} poissons à mettre en filets de {b}. Combien de filets pleins, et combien restent ?"
      ],
      operation: "÷",
      reponse: { quotient: "q", reste: "r" },
      labels: { quotient: "Filets pleins", reste: "Poissons restants" },
      lecon: "reste"
    },

    {
      id: "div-reste-32",
      ile: "division",
      niveau: 3,
      competence: "div.reste",
      difficulte: 3,
      mode: "potence",
      nombres: {
        q: { min: 12, max: 99 },
        b: { min: 2, max: 9 },
        r: { min: 1, max: "b - 1" },
        a: { calc: "q * b + r" }
      },
      contraintes: ["r < b", "a >= 100", "a <= 999", "q >= 12", "q != b"],
      enonces: [
        "{a} cartes sont rangées en paquets de {b}. Combien de paquets complets, et combien de cartes restent ?",
        "On range {a} cartes par paquets de {b}. Combien de paquets forme-t-on, et combien de cartes restent ?",
        "Il y a {a} cartes à ranger en paquets de {b}. Combien de paquets complets, et combien restent ?"
      ],
      operation: "÷",
      reponse: { quotient: "q", reste: "r" },
      labels: { quotient: "Paquets complets", reste: "Cartes restantes" },
      lecon: "reste"
    },

    /* ===== Niveau 4 (suite) : partage équitable ===== */

    {
      id: "div-partage-33",
      ile: "division",
      niveau: 4,
      competence: "div.partage",
      difficulte: 3,
      nombres: {
        q: { min: 3, max: 9 },
        b: { min: 2, max: 6 },
        a: { calc: "q * b" }
      },
      contraintes: ["a <= 200", "q >= 3", "q != b"],
      enonces: [
        "{a} coquillages sont répartis dans {b} sacs identiques. Combien par sac ?",
        "On partage {a} coquillages en {b} sacs égaux. Combien de coquillages par sac ?",
        "Malo répartit {a} coquillages entre {b} sacs. Combien par sac ?"
      ],
      operation: "÷",
      reponse: "q",
      unite: "coquillages",
      lecon: "partage"
    },

    {
      id: "div-partage-34",
      ile: "division",
      niveau: 4,
      competence: "div.partage",
      difficulte: 3,
      nombres: {
        q: { min: 3, max: 9 },
        b: { min: 2, max: 6 },
        a: { calc: "q * b" }
      },
      contraintes: ["a <= 200", "q >= 3", "q != b"],
      enonces: [
        "{a} boulets sont répartis dans {b} caisses identiques. Combien par caisse ?",
        "On partage {a} boulets en {b} caisses égales. Combien de boulets par caisse ?",
        "Le canonnier répartit {a} boulets entre {b} caisses. Combien par caisse ?"
      ],
      operation: "÷",
      reponse: "q",
      unite: "boulets",
      lecon: "partage"
    },

    {
      id: "div-partage-35",
      ile: "division",
      niveau: 4,
      competence: "div.partage",
      difficulte: 3,
      nombres: {
        q: { min: 3, max: 9 },
        b: { min: 2, max: 6 },
        a: { calc: "q * b" }
      },
      contraintes: ["a <= 200", "q >= 3", "q != b"],
      enonces: [
        "{a} biscuits sont répartis dans {b} boîtes identiques. Combien par boîte ?",
        "On partage {a} biscuits en {b} boîtes égales. Combien de biscuits par boîte ?",
        "Le cuisinier répartit {a} biscuits entre {b} boîtes. Combien par boîte ?"
      ],
      operation: "÷",
      reponse: "q",
      unite: "biscuits",
      lecon: "partage"
    },

    {
      id: "div-partage-36",
      ile: "division",
      niveau: 4,
      competence: "div.partage",
      difficulte: 3,
      nombres: {
        q: { min: 3, max: 9 },
        b: { min: 2, max: 6 },
        a: { calc: "q * b" }
      },
      contraintes: ["a <= 200", "q >= 3", "q != b"],
      enonces: [
        "{a} cartes sont réparties en {b} paquets identiques. Combien par paquet ?",
        "On partage {a} cartes en {b} paquets égaux. Combien de cartes par paquet ?",
        "Malo répartit {a} cartes entre {b} paquets. Combien par paquet ?"
      ],
      operation: "÷",
      reponse: "q",
      unite: "cartes",
      lecon: "partage"
    },

    {
      id: "div-partage-37",
      ile: "division",
      niveau: 4,
      competence: "div.partage",
      difficulte: 3,
      nombres: {
        q: { min: 3, max: 9 },
        b: { min: 2, max: 6 },
        a: { calc: "q * b" }
      },
      contraintes: ["a <= 200", "q >= 3", "q != b"],
      enonces: [
        "{a} poissons sont répartis dans {b} filets identiques. Combien par filet ?",
        "On partage {a} poissons en {b} filets égaux. Combien de poissons par filet ?",
        "Le pêcheur répartit {a} poissons entre {b} filets. Combien par filet ?"
      ],
      operation: "÷",
      reponse: "q",
      unite: "poissons",
      lecon: "partage"
    },

    {
      id: "div-partage-38",
      ile: "division",
      niveau: 4,
      competence: "div.partage",
      difficulte: 3,
      nombres: {
        q: { min: 3, max: 9 },
        b: { min: 2, max: 6 },
        a: { calc: "q * b" }
      },
      contraintes: ["a <= 200", "q >= 3", "q != b"],
      enonces: [
        "{a} places sont réparties dans {b} barques identiques. Combien de places par barque ?",
        "On partage {a} places entre {b} barques. Combien par barque ?",
        "Le port répartit {a} places dans {b} barques. Combien de places par barque ?"
      ],
      operation: "÷",
      reponse: "q",
      unite: "places",
      lecon: "partage"
    },

    {
      id: "div-partage-39",
      ile: "division",
      niveau: 4,
      competence: "div.partage",
      difficulte: 3,
      nombres: {
        q: { min: 3, max: 9 },
        b: { min: 2, max: 6 },
        a: { calc: "q * b" }
      },
      contraintes: ["a <= 200", "q >= 3", "q != b"],
      enonces: [
        "{a} livres sont répartis sur {b} étagères identiques. Combien par étagère ?",
        "On partage {a} livres entre {b} étagères. Combien de livres par étagère ?",
        "La bibliothèque répartit {a} livres sur {b} étagères. Combien par étagère ?"
      ],
      operation: "÷",
      reponse: "q",
      unite: "livres",
      lecon: "partage"
    },

    {
      id: "div-partage-40",
      ile: "division",
      niveau: 4,
      competence: "div.partage",
      difficulte: 3,
      nombres: {
        q: { min: 3, max: 9 },
        b: { min: 2, max: 6 },
        a: { calc: "q * b" }
      },
      contraintes: ["a <= 200", "q >= 3", "q != b"],
      enonces: [
        "{a} pièces sont réparties entre {b} pirates. Combien de pièces par pirate ?",
        "On partage {a} pièces en {b} parts égales. Combien par part ?",
        "Le capitaine répartit {a} pièces entre {b} pirates. Combien chacun en reçoit-il ?"
      ],
      operation: "÷",
      reponse: "q",
      unite: "pièces",
      lecon: "partage"
    }
  ]);
})(window.Quete);
