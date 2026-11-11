/* ============================================================
   Atelier des énoncés — banc d'essai du lot L1

   Ce n'est pas l'écran de jeu : c'est l'outil qui permet de voir
   ce que le générateur produit vraiment (nombres tirés, texte
   final, réponse) et de vérifier les bornes sur 200 tirages.
   Il disparaîtra de la navigation au lot L2.
   ============================================================ */
(function (Q) {
  "use strict";

  Q.screens.essai = function (el, params) {
    var ile = Q.ile(params.ileId) || Q.ordreIles()[0];
    if (!ile) { Q.router.go("map"); return; }

    var niveauId = params.niveauId || null;
    var afficherReponses = false;
    var apercuQuete = false;
    var controle = null;
    var questions = [];

    function gabarits() {
      return niveauId ? Q.enoncesDuNiveau(ile.id, niveauId) : Q.enoncesDeLIle(ile.id);
    }

    function generer() {
      controle = null;
      if (apercuQuete) {
        var quete = Q.session.construire({
          ileId: ile.id,
          niveauId: niveauId,
          mode: niveauId ? "niveau" : "gardien"
        });
        questions = quete ? quete.questions : [];
        return;
      }
      questions = gabarits().map(function (g) { return Q.exercices.construire(g); });
    }

    function carteQuestion(x, index) {
      var gabarit = Q.enonce(x.gabaritId);
      var source = x.source === "revue" ? "Révision" :
        x.source === "defi" ? "Défi mêlé" : "Entraînement";
      var puces =
        '<span class="pastille">' + Q.ui.echapper(Q.ui.operationLabel(x.ile) + " · niveau " + x.niveau) + "</span>" +
        '<span class="pastille">' + Q.ui.echapper(x.competence) + "</span>" +
        (x.mode === "pose" ? '<span class="pastille">posé</span>' : "") +
        (apercuQuete ? '<span class="pastille">' + source + "</span>" : "");

      return '<div class="essai-item">' +
        '<div class="essai-item__tete">' +
          '<span class="discret">' + (index + 1) + ".</span>" + puces +
        "</div>" +
        '<p class="enonce">' + Q.ui.enonceHTML(x.texte) + "</p>" +
        (x.consigne ? '<p class="discret" style="margin:6px 0 0">' + Q.ui.echapper(x.consigne) + "</p>" : "") +
        (afficherReponses
          ? '<p class="essai-item__rep">= ' + Q.ui.echapper(Q.exercices.formatReponse(x)) + "</p>"
          : "") +
        (gabarit ? '<p class="discret" style="margin:6px 0 0;font-size:12px">' +
          Q.ui.echapper(gabarit.id) + "</p>" : "") +
        "</div>";
    }

    function tableauControle() {
      if (!controle) return "";
      var lignes = controle.map(function (c) {
        var etat = c.erreurs.length ? "✗" : "✓";
        return "<tr><td>" + Q.ui.echapper(c.id) + "</td><td>" + etat + " " + c.reussis + "/" + c.demandes + "</td>" +
          "<td>" + c.distincts + "</td><td>" + (c.min == null ? "—" : c.min) + " → " + (c.max == null ? "—" : c.max) + "</td></tr>";
      }).join("");
      return '<div class="carte espace-haut"><h2>Contrôle sur 200 tirages</h2>' +
        '<table class="tableau"><thead><tr><th>Énoncé</th><th>Tirages</th><th>Textes différents</th><th>Réponses</th></tr></thead>' +
        "<tbody>" + lignes + "</tbody></table>" +
        '<p class="discret espace-haut-sm">Un énoncé qui échoue ici a des contraintes trop strictes : ' +
        "la même vérification tourne en ligne de commande avec <code>node tools/lint-enonces.js</code>.</p></div>";
    }

    function dessiner() {
      var niveaux = ile.niveaux.map(function (n) {
        return '<button class="btn ' + (niveauId === n.id ? "btn--primaire" : "btn--secondaire") + ' btn--petit" data-niveau="' + n.id + '">' +
          (ile.niveaux.indexOf(n) + 1) + ". " + Q.ui.echapper(n.titre) + "</button>";
      }).join("");

      var iles = Q.ordreIles().map(function (i) {
        return '<button class="btn ' + (i.id === ile.id ? "btn--primaire" : "btn--secondaire") + ' btn--petit" data-ile="' + i.id + '">' +
          Q.ui.signeDe(i.operation) + " " + Q.ui.echapper(i.nom) + "</button>";
      }).join("");

      el.innerHTML = Q.ui.hud() +
        '<button class="btn btn--fantome" data-retour-ile>← Retour à l\'île</button>' +
        '<div class="titre-section espace-haut-sm"><h1 style="margin:0">' + Q.ui.icon("carnet") + " Atelier des énoncés</h1></div>" +
        '<p class="discret">' + Q.ui.echapper(ile.nom) + " · " +
          (niveauId ? Q.ui.echapper((Q.niveau(ile.id, niveauId) || {}).titre || "") : "toute l'île (Gardien)") +
          " · " + Q.ui.echapper(Q.ui.operationLabel(ile.operation)) + " " + Q.ui.signeDe(ile.operation) + "</p>" +

        '<div class="carte carte--souple">' +
          '<div class="rangee" style="flex-wrap:wrap;gap:8px;margin-bottom:10px">' + iles + "</div>" +
          '<div class="rangee" style="flex-wrap:wrap;gap:8px;margin-bottom:10px">' +
            '<button class="btn ' + (!niveauId ? "btn--primaire" : "btn--secondaire") + ' btn--petit" data-niveau="">Toute l\'île</button>' +
            niveaux +
          "</div>" +
          '<div class="rangee" style="flex-wrap:wrap;gap:8px">' +
            '<button class="btn btn--secondaire" data-action="regenerer">' + Q.ui.icon("roue") + " Régénérer</button>" +
            '<button class="btn ' + (afficherReponses ? "btn--mer" : "btn--secondaire") + '" data-action="reponses">' +
              (afficherReponses ? "Masquer les réponses" : "Afficher les réponses") + "</button>" +
            '<button class="btn ' + (apercuQuete ? "btn--mer" : "btn--secondaire") + '" data-action="quete">' +
              (apercuQuete ? "Voir tous les énoncés" : "Aperçu d'une quête de 8") + "</button>" +
            '<button class="btn btn--secondaire" data-action="controler">Contrôle 200 tirages</button>' +
          "</div>" +
        "</div>" +

        ((!niveauId && !apercuQuete) ?
          '<div class="encart espace-haut">Le Gardien mélange les quatre niveaux de l\'île : ' +
          questions.length + " énoncés disponibles.</div>" : "") +

        '<div class="espace-haut">' +
          (questions.length
            ? questions.map(carteQuestion).join("")
            : '<div class="carte">Aucun énoncé pour cette sélection.</div>') +
        "</div>" +
        tableauControle();

      var retour = el.querySelector("[data-retour-ile]");
      if (retour) {
        retour.addEventListener("click", function () {
          Q.router.go("ile", { id: ile.id });
        });
      }

      Array.prototype.forEach.call(el.querySelectorAll("[data-ile]"), function (b) {
        b.addEventListener("click", function () {
          var id = b.getAttribute("data-ile");
          if (id !== ile.id) Q.router.go("essai", { ileId: id });
        });
      });

      Array.prototype.forEach.call(el.querySelectorAll("[data-niveau]"), function (b) {
        b.addEventListener("click", function () {
          var id = b.getAttribute("data-niveau");
          var p = { ileId: ile.id };
          if (id) p.niveauId = id;
          Q.router.go("essai", p);
        });
      });

      Array.prototype.forEach.call(el.querySelectorAll("[data-action]"), function (b) {
        b.addEventListener("click", function () {
          var a = b.getAttribute("data-action");
          if (a === "regenerer") {
            generer();
            dessiner();
            Q.audio.son("page");
          }
          if (a === "reponses") {
            afficherReponses = !afficherReponses;
            dessiner();
          }
          if (a === "quete") {
            apercuQuete = !apercuQuete;
            generer();
            dessiner();
          }
          if (a === "controler") {
            controle = gabarits().map(function (g) {
              var s = Q.generateur.stats(g, 200);
              return {
                id: g.id,
                demandes: s.demandes,
                reussis: s.reussis,
                distincts: s.distincts,
                min: s.min,
                max: s.max,
                erreurs: s.erreurs
              };
            });
            afficherReponses = true;
            dessiner();
            Q.ui.toast("Contrôle terminé sur " + (gabarits().length * 200) + " tirages.", "ok");
          }
        });
      });
    }

    generer();
    dessiner();
  };
})(window.Quete);
