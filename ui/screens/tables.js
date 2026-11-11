/* ============================================================
   Salle des tables — entraînement libre aux tables de 2 à 10

   Une partie = 10 questions sur une table (ou un mélange).
   Pas de chrono, pas de pénalité : on révise, on bat son record.
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

  var TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  var TOTAL = 10;

  Q.screens.tables = function (el, params) {
    var table = params && params.table ? String(params.table) : null;
    var questions = [];
    var index = 0;
    var bonnes = 0;
    var premiere = 0;
    var saisie = "";
    var essais = 0;
    var phase = "menu";

    if (table) lancer(table);
    else menu();

    /* ---------- Menu ---------- */

    function menu() {
      phase = "menu";
      var records = Q.etat.tables || {};

      var boutons = TABLES.map(function (t) {
        var r = records[String(t)] || {};
        return '<button class="table-btn" data-table="' + t + '">' +
          "<strong>" + t + "</strong>" +
          "<small>" + (r.record ? "record " + r.record + "/10" : "pas encore joué") + "</small>" +
          "</button>";
      }).join("");

      var mixte = records.mixte || {};

      el.innerHTML = Q.ui.hud() +
        Q.ui.boutonRetour("map") +
        '<div class="titre-section espace-haut-sm"><h1 style="margin:0">' + Q.ui.icon("roue") + " La Salle des tables</h1></div>" +
        '<p class="discret">Choisis une table. Dix questions, pas de chrono, et ton record à battre.</p>' +
        '<div class="carte">' +
          '<div class="tables-grille">' + boutons +
            '<button class="table-btn table-btn--mixte" data-table="mixte">' +
              "<strong>?</strong><small>" +
              (mixte.record ? "record " + mixte.record + "/10" : "toutes les tables") +
              "</small></button>" +
          "</div>" +
        "</div>" +
        '<div class="encart espace-haut">Une table réussie 10/10 rapporte <strong>5 pièces d\'or</strong> et un badge. ' +
        "Ici, on peut se tromper autant de fois qu'on veut.</div>";

      Array.prototype.forEach.call(el.querySelectorAll("[data-table]"), function (b) {
        b.addEventListener("click", function () {
          Q.audio.son("page");
          lancer(b.getAttribute("data-table"));
        });
      });
    }

    /* ---------- Partie ---------- */

    function lancer(t) {
      table = String(t);
      questions = melanger([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (n) {
        var t2 = table === "mixte" ? TABLES[Math.floor(Math.random() * TABLES.length)] : Number(table);
        return { a: t2, b: n };
      }));
      index = 0;
      bonnes = 0;
      premiere = 0;
      dessiner();
    }

    function question() {
      return questions[index] || null;
    }

    function dessiner() {
      phase = "question";
      var q = question();
      if (!q) { bilan(); return; }
      saisie = "";
      essais = 0;
      var segments = questions.map(function (_, i) {
        var classe = i < index ? "fait" : i === index ? "encours" : "";
        return '<li class="' + classe + '"></li>';
      }).join("");

      el.innerHTML = Q.ui.hud() +
        Q.ui.boutonRetour("map") +
        '<div class="quete">' +
          '<div class="quete__barre">' +
            '<button class="btn btn--fantome btn--rond" data-action="quitter" aria-label="Quitter la salle">' +
              '<span aria-hidden="true">✕</span></button>' +
            '<ul class="segments" aria-label="Progression">' + segments + "</ul>" +
            '<span class="quete__compteur">' + (index + 1) + " / " + TOTAL + "</span>" +
          "</div>" +
          '<div class="carte question-cadre">' +
            '<p class="discret" style="margin:0 0 6px">' +
              (table === "mixte" ? "Toutes les tables" : "Table de " + table) + "</p>" +
            '<p class="texte-enonce" style="text-align:center;font-size:2rem">' +
              "<strong>" + q.a + " × " + q.b + "</strong> = ?</p>" +
            '<div class="saisie">' +
              '<div class="saisie__ecran" id="ecran" aria-live="polite">?</div>' +
              pave() +
            "</div>" +
            '<div class="zone-feedback" id="zone-feedback"></div>' +
          "</div>" +
        "</div>";

      binder(q);
    }

    function pave() {
      var touches = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) {
        return '<button class="pave__touche" data-chiffre="' + n + '">' + n + "</button>";
      }).join("");
      return '<div class="pave" role="group" aria-label="Clavier numérique">' + touches +
        '<button class="pave__touche pave__touche--outil" data-action="effacer-tout" aria-label="Tout effacer">C</button>' +
        '<button class="pave__touche" data-chiffre="0">0</button>' +
        '<button class="pave__touche pave__touche--outil" data-action="effacer" aria-label="Effacer">⌫</button>' +
        "</div>" +
        '<button class="btn btn--primaire btn--bloc espace-haut-sm" data-action="valider">Valider</button>';
    }

    function binder(q) {
      Array.prototype.forEach.call(el.querySelectorAll("[data-chiffre]"), function (b) {
        b.addEventListener("click", function () {
          if (saisie.length >= 3) return;
          saisie += b.getAttribute("data-chiffre");
          afficher();
        });
      });
      Array.prototype.forEach.call(el.querySelectorAll("[data-action]"), function (b) {
        b.addEventListener("click", function () {
          var a = b.getAttribute("data-action");
          if (a === "effacer") { saisie = saisie.slice(0, -1); afficher(); }
          if (a === "effacer-tout") { saisie = ""; afficher(); }
          if (a === "valider") valider(q);
          if (a === "quitter") Q.ui.confirmer("Quitter la salle des tables ?", "Ta partie en cours sera perdue.", "Quitter")
            .then(function (ok) { if (ok) Q.router.go("map"); });
        });
      });
    }

    function afficher() {
      var ecran = el.querySelector("#ecran");
      if (ecran) {
        ecran.textContent = saisie || "?";
        ecran.classList.toggle("saisie__ecran--vide", !saisie);
      }
    }

    function valider(q) {
      if (essais > 0 || !saisie) return;
      essais = 1;
      var juste = Number(saisie) === q.a * q.b;
      var zone = el.querySelector("#zone-feedback");
      if (juste) {
        bonnes += 1;
        premiere += 1;
        Q.audio.son("ok");
        zone.innerHTML = feedback("Bravo !", q.a + " × " + q.b + " = " + (q.a * q.b), "ok");
      } else {
        Q.audio.son("ko");
        zone.innerHTML = feedback("La réponse est " + (q.a * q.b), q.a + " × " + q.b + " = " + (q.a * q.b), "ko");
      }
      zone.innerHTML += '<div class="rangee rangee--droite espace-haut-sm">' +
        '<button class="btn btn--primaire" data-suite="1">Continuer →</button></div>';
      Array.prototype.forEach.call(el.querySelectorAll("[data-chiffre], .pave__touche"), function (b) { b.disabled = true; });
      var suite = el.querySelector("[data-suite]");
      if (suite) suite.addEventListener("click", function () {
        Q.audio.son("page");
        index += 1;
        if (index >= TOTAL) bilan();
        else dessiner();
      });
    }

    function feedback(titre, texte, type) {
      return '<div class="feedback feedback--' + type + '" role="status">' +
        '<p class="feedback__titre">' + Q.ui.echapper(titre) + "</p>" +
        "<p>" + Q.ui.echapper(texte) + "</p></div>";
    }

    /* ---------- Bilan ---------- */

    function bilan() {
      phase = "bilan";
      var cle = table;
      var fiche = Q.etat.tables[cle] || { record: 0, parties: 0 };
      fiche.parties = (fiche.parties || 0) + 1;
      var nouveauRecord = bonnes > (fiche.record || 0);
      fiche.record = Math.max(fiche.record || 0, bonnes);
      Q.etat.tables[cle] = fiche;
      if (bonnes === TOTAL) Q.jeu.ajouterOr(5);
      Q.jeu.sauver();
      var badges = Q.badges.verifier();
      Q.audio.son(bonnes >= 8 ? "fanfare" : "page");

      el.innerHTML = Q.ui.hud() +
        Q.ui.boutonRetour("map") +
        '<div class="resultat">' +
          "<h1>" + (bonnes === TOTAL ? "Table parfaite !" : "Partie terminée") + "</h1>" +
          '<p class="discret">' + (table === "mixte" ? "Toutes les tables" : "Table de " + table) + "</p>" +
          '<div class="stats-grille espace-haut">' +
            '<div class="stat"><div class="stat__valeur">' + bonnes + "/" + TOTAL + '</div><div class="stat__label">bonnes réponses</div></div>' +
            '<div class="stat"><div class="stat__valeur">' + fiche.record + "/" + TOTAL + '</div><div class="stat__label">ton record</div></div>' +
          "</div>" +
          (bonnes === TOTAL ? '<div class="encart encart--info espace-haut">+5 pièces d\'or pour cette table parfaite.</div>' : "") +
          (nouveauRecord ? '<div class="encart encart--info espace-haut">Nouveau record !</div>' : "") +
          '<div class="rangee espace-haut" style="justify-content:center;flex-wrap:wrap;gap:8px">' +
            '<button class="btn btn--primaire btn--lg" data-action="rejouer">Rejouer</button>' +
            '<button class="btn btn--secondaire btn--lg" data-action="menu">Autre table</button>' +
            '<button class="btn btn--secondaire btn--lg" data-nav="map">Carte</button>' +
          "</div>" +
        "</div>";

      Array.prototype.forEach.call(el.querySelectorAll("[data-action]"), function (b) {
        b.addEventListener("click", function () {
          var a = b.getAttribute("data-action");
          if (a === "rejouer") lancer(table);
          if (a === "menu") menu();
        });
      });

      if (badges.length) {
        Q.ui.modale({
          titre: "Nouveau badge !",
          contenu: badges.map(function (bd) {
            return '<div class="rangee" style="gap:12px;align-items:center;padding:8px 0">' +
              '<span class="badge-item__medaille badge-item--obtenu" style="margin:0">' + Q.ui.icon(bd.icone) + "</span>" +
              "<div><strong>" + Q.ui.echapper(bd.nom) + "</strong><div class=\"discret\">" +
              Q.ui.echapper(bd.desc) + "</div></div></div>";
          }).join(""),
          actions: [{ label: "Youpi !", classe: "btn--primaire" }]
        });
      }
    }
  };
})(window.Quete);
