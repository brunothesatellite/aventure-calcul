/* ============================================================
   session.js — composition et déroulement d'une quête de 8 questions

   2 révisions espacées + des questions du niveau + un rappel des
   niveaux précédents + 1 défi mêlé.

   Deux garde-fous contre la répétition :
   - un gabarit sert d'abord ceux qu'on a le moins vus ;
   - dans une même quête, un gabarit répété change de formulation.
   ============================================================ */
(function (Q) {
  "use strict";

  function melanger(tab) {
    var a = tab.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* Choisit un gabarit en répartissant les occurrences : on épuise
     la liste avant de réutiliser, et on évite les histoires vues
     récemment. Un gabarit peut revenir avec d'autres nombres. */
  function choisirGabarit(gabarits, compteurs) {
    if (!gabarits.length) return null;
    var mini = Infinity;
    gabarits.forEach(function (g) {
      var c = compteurs[g.id] || 0;
      if (c < mini) mini = c;
    });
    var candidats = gabarits.filter(function (g) { return (compteurs[g.id] || 0) === mini; });
    var recent = Q.etat.gabaritsVus || [];
    var frais = candidats.filter(function (g) { return recent.indexOf(g.id) === -1; });
    var liste = frais.length ? frais : candidats;
    return liste[Math.floor(Math.random() * liste.length)];
  }

  function generer(gabarit, source, ctx) {
    var vues = ctx.variantes[gabarit.id] || [];
    var q = Q.exercices.construire(gabarit, { exclure: vues });
    if (!ctx.variantes[gabarit.id]) ctx.variantes[gabarit.id] = [];
    ctx.variantes[gabarit.id].push(q.variante);
    q.source = source;
    return q;
  }

  function tirerQuestions(gabarits, n, source, ctx, accumulateur) {
    var ajoutees = 0;
    while (ajoutees < n) {
      var g = choisirGabarit(gabarits, ctx.compteurs);
      if (!g) break;
      ctx.compteurs[g.id] = (ctx.compteurs[g.id] || 0) + 1;
      accumulateur.push(generer(g, source, ctx));
      ajoutees += 1;
    }
    return ajoutees;
  }

  /* Deux fois la même histoire d'affilée, c'est trop : on échange
     avec une question voisine d'un autre gabarit. */
  function eviterVoisins(liste) {
    for (var i = 1; i < liste.length; i++) {
      if (liste[i].gabaritId !== liste[i - 1].gabaritId) continue;
      for (var j = i + 1; j < liste.length; j++) {
        if (liste[j].gabaritId !== liste[i - 1].gabaritId) {
          var t = liste[i]; liste[i] = liste[j]; liste[j] = t;
          break;
        }
      }
    }
    return liste;
  }

  function queteVide(mode, operation) {
    return {
      ileId: null,
      niveauId: null,
      mode: mode,
      operation: operation || "mixte",
      creeLe: Date.now(),
      questions: [],
      index: 0,
      aides: { eliminer: 0, decomposer: 0, astuce: 0, indice: 0 },
      orGagne: 0,
      fini: false
    };
  }

  Q.session = {
    /* Compose une quête sans la démarrer.
       options = { ileId, niveauId, mode: "niveau" | "gardien" } */
    composer: function (options) {
      var ile = Q.ile(options.ileId);
      if (!ile) return null;

      var config = Q.curriculum();
      var total = config.questionsParQuete || 8;
      var nbRevues = Math.min(config.revuesParQuete || 2, total - 2);
      var gardien = options.mode === "gardien";
      var niveauNum = Q.numeroDeNiveau(options.niveauId);

      var poolCible = gardien
        ? Q.enoncesDeLIle(ile.id)
        : Q.enoncesDuNiveau(ile.id, options.niveauId);

      /* Rappel : les niveaux déjà traversés de la même île. C'est ce
         qui casse la monotonie quand un niveau ne compte que deux ou
         trois énoncés. */
      var poolAvant = gardien
        ? []
        : Q.enoncesDeLIle(ile.id).filter(function (g) { return g.niveau < niveauNum; });

      if (!poolCible.length) return null;

      var ctx = { compteurs: {}, variantes: {} };
      var questions = [];

      /* 1. Révisions espacées : on retrouve la compétence, pas la question. */
      var dues = Q.srs.dues(total, ile.id);
      dues.forEach(function (d) {
        if (questions.length >= nbRevues) return;
        var pool = Q.enoncesDeLIle(ile.id).filter(function (g) { return g.competence === d.cle; });
        if (!pool.length) return;
        var g = choisirGabarit(pool, ctx.compteurs);
        if (!g) return;
        ctx.compteurs[g.id] = (ctx.compteurs[g.id] || 0) + 1;
        questions.push(generer(g, "revue", ctx));
      });

      /* 2. Le niveau du jour, puis un rappel des niveaux précédents. */
      var slots = Math.max(0, total - questions.length - 1);
      if (gardien) {
        tirerQuestions(poolCible, slots, "cible", ctx, questions);
      } else {
        var nbCible = poolAvant.length ? Math.max(1, Math.ceil(slots * 0.6)) : slots;
        var faits = tirerQuestions(poolCible, nbCible, "cible", ctx, questions);
        if (faits < slots) faits += tirerQuestions(poolAvant, slots - faits, "cible", ctx, questions);
        if (faits < slots) tirerQuestions(poolCible, slots - faits, "cible", ctx, questions);
      }

      /* 3. Défi mêlé : une autre opération déjà travaillée. */
      var autres = (config.ordre || []).filter(function (id) {
        return id !== ile.id && Q.jeu.ileCommencee(id);
      });
      if (autres.length) {
        var ileDefi = Q.ile(melanger(autres)[0]);
        if (ileDefi) {
          var niveauHasard = ileDefi.niveaux[Math.floor(Math.random() * ileDefi.niveaux.length)];
          tirerQuestions(Q.enoncesDuNiveau(ileDefi.id, niveauHasard.id), 1, "defi", ctx, questions);
        }
      }

      /* 4. Compléter si le contenu est trop court. */
      if (questions.length < total) {
        var secours = gardien ? poolCible : poolCible.concat(poolAvant);
        tirerQuestions(secours, total - questions.length, "cible", ctx, questions);
      }

      /* Les révisions restent en début de quête (échauffement). */
      var revues = questions.filter(function (q) { return q.source === "revue"; });
      var corps = eviterVoisins(melanger(questions.filter(function (q) { return q.source === "cible"; })));
      var defis = questions.filter(function (q) { return q.source === "defi"; });

      if (revues.length && corps.length &&
          revues[revues.length - 1].gabaritId === corps[0].gabaritId) {
        for (var i = 1; i < corps.length; i++) {
          if (corps[i].gabaritId !== corps[0].gabaritId) {
            var t = corps[0]; corps[0] = corps[i]; corps[i] = t;
            break;
          }
        }
      }

      var quete = queteVide(gardien ? "gardien" : "niveau", ile.operation);
      quete.ileId = ile.id;
      quete.niveauId = options.niveauId || null;
      quete.questions = revues.concat(corps, defis);

      /* Anti-répétition narrative d'une quête à l'autre. */
      var vus = (Q.etat.gabaritsVus || []).slice();
      quete.questions.forEach(function (q) {
        if (vus.indexOf(q.gabaritId) === -1) vus.push(q.gabaritId);
      });
      Q.etat.gabaritsVus = vus.slice(-80);

      return quete;
    },

    construire: function (options) {
      return Q.session.composer(options);
    },

    /* Révision express : uniquement les compétences dues. */
    construireRevision: function (limite) {
      var dues = Q.srs.dues(24);
      if (!dues.length) return null;

      var ctx = { compteurs: {}, variantes: {} };
      var questions = [];
      dues.forEach(function (d) {
        var pool = Q.tousLesEnonces().filter(function (g) { return g.competence === d.cle; });
        if (!pool.length) return;
        var g = pool[Math.floor(Math.random() * pool.length)];
        try {
          questions.push(generer(g, "revue", ctx));
        } catch (e) { /* un gabarit cassé ne bloque pas la révision */ }
      });
      if (!questions.length) return null;

      var quete = queteVide("revision", "mixte");
      quete.questions = melanger(questions).slice(0, limite || 8);
      return quete;
    },

    courante: function () {
      var q = Q.etat.quest;
      if (!q || q.fini) return null;
      return q.questions[q.index] || null;
    },

    /* Enregistre une réponse. Accepte un nombre (QCM, pavé) ou un
       objet { quotient, reste } pour la division euclidienne. */
    repondre: function (reponse) {
      var quete = Q.etat.quest;
      if (!quete) return null;
      var q = quete.questions[quete.index];
      if (!q || q.termine) return null;

      q.essais = (q.essais || 0) + 1;
      var bonne = Q.exercices.verifier(q, reponse);

      if (bonne) {
        q.termine = true;
        q.reussi = true;
        var premier = q.essais === 1;
        q.premierCoup = premier;
        var gain = premier ? (q.difficulte >= 3 ? 3 : 2) : 1;
        quete.orGagne = (quete.orGagne || 0) + gain;
        Q.jeu.ajouterOr(gain);

        if (premier) {
          Q.etat.serie.actuelle += 1;
          Q.etat.serie.record = Math.max(Q.etat.serie.record, Q.etat.serie.actuelle);
          Q.etat.stats.premierCoup += 1;
        }
        Q.srs.enregistrer(q.competence, premier);
        Q.etat.stats.questions += 1;
        Q.etat.stats.bonnes += 1;
        var c = Q.etat.stats.competences;
        c[q.competence] = (c[q.competence] || 0) + 1;
        Q.jeu.sauver();
        return { correct: true, premierCoup: premier, gain: gain, question: q };
      }

      /* Mauvaise réponse : la famille d'erreur vient du leurre choisi
         (QCM) ou de l'écart avec la bonne réponse (saisie). */
      var famille = "calcul";
      if (q.options) famille = Q.leurres.familleDe(q.options, reponse);
      else famille = Q.feedback.classifier(q, reponse);

      if (q.essais >= 2) {
        q.termine = true;
        q.reussi = false;
        Q.etat.serie.actuelle = 0;
        Q.etat.stats.questions += 1;
        Q.srs.enregistrer(q.competence, false);
        Q.feedback.analyser(famille);
      }

      Q.jeu.sauver();
      return { correct: false, essais: q.essais, famille: famille, question: q };
    },

    suivante: function () {
      var quete = Q.etat.quest;
      if (!quete) return null;
      quete.index += 1;
      if (quete.index >= quete.questions.length) {
        quete.fini = true;
        quete.finiLe = Date.now();
        var res = Q.session.resultat(quete);
        var bonus = (res.parfait ? 10 : 0) + (res.gardien ? 25 : 0);
        if (bonus) Q.jeu.ajouterOr(bonus);
        res.bonus = bonus;
        res.orGagne = quete.orGagne || 0;
        quete.resultat = res;
        Q.jeu.sauver();
        return { fini: true, resultat: res };
      }
      Q.jeu.sauver();
      return { fini: false };
    },

    resultat: function (quete) {
      quete = quete || Q.etat.quest;
      if (!quete) return null;
      var total = quete.questions.length;
      var premierCoup = quete.questions.filter(function (x) { return x.premierCoup; }).length;
      var bonnes = quete.questions.filter(function (x) { return x.reussi; }).length;
      var seuils = Q.curriculum().seuilsEtoiles || { deux: 7, trois: 8 };

      var etoiles = 1;
      if (premierCoup >= seuils.deux) etoiles = 2;
      if (premierCoup >= seuils.trois) etoiles = 3;
      if (bonnes === 0) etoiles = 1;

      var aides = quete.aides || {};
      var aidesUtilisees = (aides.indice || 0) + (aides.astuce || 0) +
        (aides.decomposer || 0) + (aides.eliminer || 0);
      if (aidesUtilisees > 0 && etoiles === 3) etoiles = 2;

      return {
        ileId: quete.ileId,
        niveauId: quete.niveauId,
        mode: quete.mode,
        operation: quete.operation,
        total: total,
        premierCoup: premierCoup,
        bonnes: bonnes,
        etoiles: etoiles,
        parfait: premierCoup === total,
        gardien: quete.mode === "gardien",
        revision: quete.mode === "revision",
        orGagne: quete.orGagne || 0,
        aidesUtilisees: aidesUtilisees,
        revoir: quete.questions
          .filter(function (x) { return !x.premierCoup; })
          .map(function (x) { return { question: x }; }),
        duree: Math.round((Date.now() - quete.creeLe) / 1000)
      };
    }
  };
})(window.Quete);
