/* ============================================================
   rewards.js — badges, boutique, familiers

   Même économie que « La Quête des Verbes » : l'or s'échange
   contre des aides (familiers), des déguisements et des
   récompenses réelles négociées avec les parents.
   ============================================================ */
(function (Q) {
  "use strict";

  function totalEtoiles(s) {
    var total = 0;
    Q.curriculum().ordre.forEach(function (id) {
      var ile = Q.ile(id);
      if (!ile) return;
      ile.niveaux.forEach(function (n) {
        total += ((s.progression || {})[n.id] || {}).etoiles || 0;
      });
    });
    return total;
  }

  function compterSolides(prefixe) {
    return Object.keys(Q.etat.srs).filter(function (k) {
      return k.indexOf(prefixe) === 0 && Q.etat.srs[k].boite >= 3;
    }).length;
  }

  var BADGES = [
    { id: "pointe-addition", nom: "La première pointe", desc: "Battre le Crabe Accumulateur",
      icone: "boussole", test: function (s) { return s.pointes.indexOf("addition") !== -1; } },
    { id: "sans-faute", nom: "Sans faute", desc: "Obtenir 3 étoiles dans un niveau",
      icone: "trophee", test: function (s) {
        return Object.keys(s.progression).some(function (k) { return s.progression[k].etoiles >= 3; });
      } },
    { id: "infaillible", nom: "L'Infaillible", desc: "Réussir 10 calculs d'affilée",
      icone: "medaille", test: function (s) { return s.serie.record >= 10; } },
    { id: "gros-magot", nom: "Gros Magot", desc: "Gagner 200 pièces d'or en tout",
      icone: "coffre", test: function (s) { return s.orGagne >= 200; } },
    { id: "maitre-des-tables", nom: "Maître des tables", desc: "Rendre solides 6 tables de multiplication",
      icone: "roue", test: function () { return compterSolides("mul.") >= 6; } },
    { id: "zero-reste", nom: "Zéro reste", desc: "Maîtriser la division avec reste",
      icone: "cle", test: function () { return compterSolides("div.reste") >= 1; } },
    { id: "premier-calcul", nom: "Premier calcul", desc: "Terminer une première quête",
      icone: "plume", test: function (s) { return ((s.compteurs || {}).quetes || 0) >= 1; } },
    { id: "chasseur-d-etoiles", nom: "Chasseur d'étoiles", desc: "Réunir 24 étoiles",
      icone: "etoile", test: function (s) { return totalEtoiles(s) >= 24; } },
    { id: "ciel-etoile", nom: "Ciel étoilé", desc: "Réunir 36 étoiles",
      icone: "lune", test: function (s) { return totalEtoiles(s) >= 36; } },
    { id: "roi-des-coffres", nom: "Roi des coffres", desc: "Obtenir les 12 étoiles de l'Addition",
      icone: "couronne", test: function () { return Q.jeu.etoilesIle("addition") >= 12; } },
    { id: "seigneur-du-gouffre", nom: "Seigneur du Gouffre", desc: "Obtenir les 12 étoiles de la Soustraction",
      icone: "tour", test: function () { return Q.jeu.etoilesIle("soustraction") >= 12; } },
    { id: "maitre-de-la-jungle", nom: "Maître de la jungle", desc: "Obtenir les 12 étoiles de la Multiplication",
      icone: "palmier", test: function () { return Q.jeu.etoilesIle("multiplication") >= 12; } },
    { id: "amiral-du-partage", nom: "Amiral du partage", desc: "Obtenir les 12 étoiles de la Division",
      icone: "ancre", test: function () { return Q.jeu.etoilesIle("division") >= 12; } },
    { id: "amiral-des-nombres", nom: "Amiral des Nombres", desc: "Réunir les quatre pointes de la Boussole",
      icone: "laurier", test: function (s) { return s.pointes.length >= 4; } },
    { id: "explorateur", nom: "Explorateur", desc: "Conquérir deux îles entières",
      icone: "carte", test: function () {
        return Q.curriculum().ordre.filter(function (id) { return Q.jeu.ileConquise(id); }).length >= 2;
      } },
    { id: "habitue-du-port", nom: "Habitué du port", desc: "Terminer une quête sur 3 jours différents",
      icone: "phare", test: function (s) { return ((s.stats || {}).jours || []).length >= 3; } },
    { id: "chasseur-de-gardiens", nom: "Chasseur de Gardiens", desc: "Battre 2 Gardiens",
      icone: "epee", test: function (s) { return ((s.compteurs || {}).gardiens || 0) >= 2; } },
    { id: "memoire-de-fer", nom: "Mémoire de fer", desc: "Rendre solides 20 compétences",
      icone: "joyau", test: function () { return Q.srs.stats().solides >= 20; } },
    { id: "apprenti-calculateur", nom: "Apprenti calculateur", desc: "Terminer 10 quêtes",
      icone: "barque", test: function (s) { return ((s.compteurs || {}).quetes || 0) >= 10; } },
    { id: "vieux-loup-de-mer", nom: "Vieux loup de mer", desc: "Terminer 30 quêtes",
      icone: "voilier", test: function (s) { return ((s.compteurs || {}).quetes || 0) >= 30; } }
  ];

  var CATALOGUE = {
    familiers: [
      { id: "crabe-compteur", nom: "Crabe Compteur", prix: 60, icone: "crabe", effet: "decomposer",
        desc: "Décompose l'opération en morceaux simples, une fois par quête." },
      { id: "perroquet-fureteur", nom: "Perroquet Fureteur", prix: 120, icone: "perroquet", effet: "eliminer",
        desc: "Élimine un mauvais choix d'un coup de bec, une fois par quête." },
      { id: "tortue-savante", nom: "Tortue Savante", prix: 200, icone: "tortue", effet: "astuce",
        desc: "Te rappelle l'astuce de calcul, une fois par quête." }
    ],
    cosmetiques: [
      { id: "bandeau", nom: "Bandeau à tête de mort", prix: 30, icone: "picto:tete-mort", desc: "Le bandeau des vrais pirates." },
      { id: "chapeau", nom: "Chapeau de capitaine", prix: 40, icone: "mousse", desc: "Pour avoir l'air d'un vrai chef de bord." },
      { id: "tatouage-ancre", nom: "Tatouage d'ancre", prix: 45, icone: "ancre", desc: "Un tatouage de marin, sans piqûre !" },
      { id: "cache-oeil", nom: "Cache-œil", prix: 50, icone: "picto:cache-oeil", desc: "Un look de vieux loup de mer." },
      { id: "etoile-mer", nom: "Étoile de mer porte-bonheur", prix: 65, icone: "picto:etoile-mer", desc: "Elle porte chance dans les tempêtes." },
      { id: "collier", nom: "Collier de coquillages", prix: 70, icone: "coquillage", desc: "Rapporte la plage partout avec toi." },
      { id: "joyau", nom: "Joyau du trésor", prix: 80, icone: "joyau", desc: "Brille dans ton carnet de bord." },
      { id: "epee", nom: "Épée de corsaire", prix: 90, icone: "epee", desc: "Pour les duels... ou pour la pose." },
      { id: "drapeau", nom: "Drapeau noir", prix: 120, icone: "pirate", desc: "Le pavillon des aventuriers." },
      { id: "bouclier", nom: "Bouclier du gardien", prix: 150, icone: "bouclier", desc: "Aucun mauvais sort ne passe." },
      { id: "plume", nom: "Plume de capitaine", prix: 220, icone: "picto:plume", desc: "Pour signer les cartes au trésor." },
      { id: "tatouage-dragon", nom: "Tatouage de dragon", prix: 260, icone: "dragon", desc: "Un dragon sur le bras, rien que ça." },
      { id: "sorciere", nom: "Chapeau de sorcière", prix: 350, icone: "picto:sorciere", desc: "Pointu, sombre, un peu magique." },
      { id: "armure", nom: "Armure de chevalier", prix: 450, icone: "picto:chevalier", desc: "Brillante comme au premier tournoi." },
      { id: "couronne", nom: "Couronne du roi", prix: 600, icone: "picto:couronne", desc: "Réservée aux vrais rois de l'Archipel." },
      { id: "kraken", nom: "Anneau du kraken", prix: 750, icone: "picto:kraken", desc: "Un anneau rapporté du fond des mers." },
      { id: "magicien", nom: "Costume de magicien", prix: 900, icone: "picto:magicienne", desc: "Pour faire apparaître les bons résultats." },
      { id: "boucle-or", nom: "Bourse de pièces d'or", prix: 1300, icone: "picto:or", desc: "Le trésor des capitaines riches." },
      { id: "sabre", nom: "Sabre du roi des mers", prix: 1600, icone: "picto:epee", desc: "Une lame légendaire, rien que pour toi." },
      { id: "laurier", nom: "Couronne de laurier", prix: 2000, icone: "picto:laurier", desc: "La récompense des héros de l'Archipel." }
    ]
  };

  /* Icônes proposées aux parents pour personnaliser les récompenses.
     Toutes existent déjà dans assets/img/icons (thème du jeu). */
  var ICONES_RECOMPENSE = [
    { id: "sablier", nom: "Temps d'écran" },
    { id: "haut-parleur", nom: "Film / dessin animé" },
    { id: "musique", nom: "Musique / chanson" },
    { id: "potion", nom: "Friandise / goûter" },
    { id: "carte", nom: "Jeu de société" },
    { id: "ile", nom: "Sortie en famille" },
    { id: "soleil", nom: "Activité dehors" },
    { id: "lune", nom: "Soirée tranquille" },
    { id: "cheval", nom: "Balade / sport" },
    { id: "voilier", nom: "Vacances / mer" },
    { id: "tortue", nom: "Animal / zoo" },
    { id: "coffre", nom: "Cadeau surprise" },
    { id: "joyau", nom: "Petit cadeau" },
    { id: "carnet", nom: "Livre / histoire" },
    { id: "plume", nom: "Dessin / création" },
    { id: "roue", nom: "Vélo / trottinette" },
    { id: "feu", nom: "Feu de camp / barbecue" },
    { id: "montagne", nom: "Randonnée" },
    { id: "cle", nom: "Choisir le programme" },
    { id: "trophee", nom: "Défi / exploit" }
  ];

  var ICONES_DEFAUT = ["sablier", "carte", "coffre"];

  Q.iconesRecompense = ICONES_RECOMPENSE;

  /* Icône d'une récompense, avec repli pour les anciennes sauvegardes. */
  Q.iconeRecompense = function (r, index) {
    var id = r && r.icone;
    var existe = ICONES_RECOMPENSE.some(function (x) { return x.id === id; });
    return existe ? id : (ICONES_DEFAUT[index] || "coffre");
  };

  Q.badges = {
    liste: BADGES,

    obtenu: function (id) {
      return Q.etat.badges.indexOf(id) !== -1;
    },

    /* Renvoie les badges nouvellement obtenus. */
    verifier: function () {
      var nouveaux = [];
      BADGES.forEach(function (b) {
        if (Q.etat.badges.indexOf(b.id) !== -1) return;
        var ok = false;
        try { ok = !!b.test(Q.etat); } catch (e) { ok = false; }
        if (ok) {
          Q.etat.badges.push(b.id);
          nouveaux.push(b);
        }
      });
      if (nouveaux.length) Q.jeu.sauver();
      return nouveaux;
    },

    parId: function (id) {
      return BADGES.filter(function (b) { return b.id === id; })[0] || null;
    }
  };

  Q.catalogue = CATALOGUE;

  Q.achat = {
    possede: function (type, id) {
      var liste = type === "familier" ? Q.etat.familiers : Q.etat.cosmetiques;
      return liste.indexOf(id) !== -1;
    },

    prix: function (type, id) {
      var liste = type === "familier" ? CATALOGUE.familiers : CATALOGUE.cosmetiques;
      var item = liste.filter(function (x) { return x.id === id; })[0];
      return item ? item.prix : 0;
    },

    acheter: function (type, id) {
      if (Q.achat.possede(type, id)) return { ok: false, raison: "deja" };
      var prix = Q.achat.prix(type, id);
      if (!Q.jeu.depenserOr(prix)) return { ok: false, raison: "or" };
      if (type === "familier") Q.etat.familiers.push(id);
      else Q.etat.cosmetiques.push(id);
      Q.jeu.sauver();
      return { ok: true, prix: prix };
    },

    /* Achat d'une récompense réelle définie par les parents.
       On garde une trace horodatée pour l'historique du carnet. */
    acheterRecompense: function (index) {
      var r = Q.etat.recompenses[index];
      if (!r) return { ok: false, raison: "absente" };
      if (!Q.jeu.depenserOr(r.prix)) return { ok: false, raison: "or" };
      var achat = {
        texte: r.texte,
        prix: r.prix,
        icone: Q.iconeRecompense(r, index),
        date: Date.now()
      };
      if (!Array.isArray(Q.etat.recompensesAchetees)) Q.etat.recompensesAchetees = [];
      Q.etat.recompensesAchetees.push(achat);
      r.achetee = achat.date;
      Q.jeu.sauver();
      return { ok: true, recompense: r, achat: achat };
    },

    aFamille: function (effet) {
      return Q.etat.familiers.some(function (id) {
        var f = CATALOGUE.familiers.filter(function (x) { return x.id === id; })[0];
        return f && f.effet === effet;
      });
    }
  };
})(window.Quete);
