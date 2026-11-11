/* Carnet de bord : badges, stratégies, statistiques, journal, pointes */
(function (Q) {
  "use strict";

  Q.screens.carnet = function (el) {
    var s = Q.etat.stats;
    var srs = Q.srs.stats();

    var badges = Q.badges.liste.map(function (b) {
      var obtenu = Q.badges.obtenu(b.id);
      return '<div class="badge-item ' + (obtenu ? "badge-item--obtenu" : "") + '">' +
        '<div class="badge-item__medaille">' + Q.ui.icon(b.icone) + "</div>" +
        '<div class="badge-item__nom">' + Q.ui.echapper(b.nom) + "</div>" +
        '<div class="badge-item__desc">' + Q.ui.echapper(b.desc) + "</div>" +
        "</div>";
    }).join("");

    var maitrise = Q.curriculum().ordre.map(function (id) {
      var ile = Q.ile(id);
      var v = Math.round(Q.srs.maitrise(id) * 100);
      return '<div style="margin-bottom:10px">' +
        '<div class="rangee rangee--entre"><strong>' + Q.ui.echapper(ile.nom) + " " + Q.ui.signeDe(id) +
          "</strong><span class=\"discret\">" + v + " %</span></div>" +
        '<div style="height:12px;border-radius:6px;background:var(--parchemin-3);overflow:hidden">' +
        '<div style="height:100%;width:' + v + '%;background:linear-gradient(90deg,#15803d,#4ade80)"></div></div></div>';
    }).join("");

    /* Carnet de stratégies : les astuces sont groupées par île.
       L'ouverture se fera au fil de la progression au lot L4. */
    var strategies = Q.curriculum().ordre.map(function (id) {
      var ile = Q.ile(id);
      var items = Q.competencesDeLIle(id).map(function (c) {
        var texte = Q.feedback.astuce(c.id);
        if (!texte) return "";
        return '<div class="astuce">' +
          '<span class="astuce__exemple">' + Q.ui.echapper(c.exemple || "") + "</span>" +
          "<span>" + Q.ui.echapper(texte) + "</span></div>";
      }).join("");
      return '<details class="strategies"><summary>' + Q.ui.emoji("boussole", "") + " " +
        Q.ui.echapper(ile.nom) + " " + Q.ui.signeDe(id) + "</summary>" + items + "</details>";
    }).join("");

    var erreurs = Object.keys(s.erreurs || {}).sort(function (a, b) { return s.erreurs[b] - s.erreurs[a]; }).slice(0, 5);
    var erreursHtml = erreurs.length
      ? '<table class="tableau"><thead><tr><th>Point à revoir</th><th>Fois</th></tr></thead><tbody>' +
        erreurs.map(function (k) {
          return "<tr><td>" + Q.ui.echapper(Q.feedback.typesErreurs[k] || k) + "</td><td>" + s.erreurs[k] + "</td></tr>";
        }).join("") + "</tbody></table>"
      : '<p class="discret">Aucune erreur enregistrée pour le moment.</p>';

    var journal = (Q.etat.journal || []).slice(0, 8).map(function (j) {
      var ile = Q.ile(j.ile);
      return '<div class="revoir__ligne"><span>' + new Date(j.date).toLocaleDateString("fr-FR") + "</span>" +
        "<span>" + Q.ui.echapper(ile ? ile.nom : j.ile) + "</span>" +
        '<span class="pousse">' + Q.ui.etoiles(j.etoiles, 3) + "</span></div>";
    }).join("") || '<p class="discret">Aucune quête terminée pour l\'instant.</p>';

    var pointes = ["addition", "soustraction", "multiplication", "division"].map(function (op) {
      var ok = Q.etat.pointes.indexOf(op) !== -1;
      return '<span class="aiguille-pilule ' + (ok ? "" : "aiguille-pilule--vide") + '">' +
        Q.ui.emoji("boussole", "") + " " + Q.ui.operationLabel(op) + " " + Q.ui.signeDe(op) + "</span>";
    }).join(" ");

    var achats = (Q.etat.recompensesAchetees || []).slice().sort(function (a, b) {
      return (b.date || 0) - (a.date || 0);
    });
    var historique = achats.length
      ? achats.map(function (r, i) {
          return '<div class="rec-carnet">' +
            '<span class="rec-carnet__icone" aria-hidden="true">' + Q.ui.icon(Q.iconeRecompense(r, 0)) + "</span>" +
            '<div class="rec-carnet__texte">' +
              '<div class="rec-carnet__nom">' + Q.ui.echapper(r.texte || "Récompense") + "</div>" +
              '<div class="rec-carnet__meta">' +
                (r.date ? "Échangée le " + Q.ui.dateFr(r.date) : "Récompense échangée") + "</div>" +
            "</div>" +
            '<span class="rec-carnet__prix">' + Q.ui.piece() + " " + (r.prix || 0) + "</span>" +
            '<button class="btn btn--secondaire btn--petit" data-parchemin="' + i + '">Parchemin</button>' +
            "</div>";
        }).join("")
      : '<p class="discret">Aucune récompense échangée pour le moment. File à la Boutique du Marchand !</p>';

    el.innerHTML = Q.ui.hud() +
      Q.ui.boutonRetour("map") +
      '<div class="titre-section espace-haut-sm"><h1 style="margin:0">Carnet de bord</h1></div>' +
      '<div class="carte">' +
        '<h2>Pointes de la Boussole</h2>' +
        '<div class="rangee">' + pointes + "</div>" +
        '<div class="stats-grille espace-haut">' +
          '<div class="stat"><div class="stat__valeur">' + (Q.etat.compteurs.quetes || 0) + '</div><div class="stat__label">quêtes</div></div>' +
          '<div class="stat"><div class="stat__valeur">' + (s.bonnes || 0) + '</div><div class="stat__label">bons calculs</div></div>' +
          '<div class="stat"><div class="stat__valeur">' + Q.etat.serie.record + '</div><div class="stat__label">record d\'affilée</div></div>' +
          '<div class="stat"><div class="stat__valeur">' + srs.solides + '</div><div class="stat__label">compétences solides</div></div>' +
        "</div>" +
      "</div>" +
      '<div class="carte espace-haut"><h2>' + Q.ui.icon("carnet") + " Carnet de stratégies</h2>" +
        '<p class="discret" style="margin-top:-4px">Chaque île cache ses astuces. Ouvre-les quand tu bloques.</p>' +
        strategies + "</div>" +
      '<div class="carte espace-haut"><h2>' + Q.ui.icon("trophee") + " Badges</h2>" +
        '<div class="badges-grille">' + badges + "</div></div>" +
      '<div class="carte espace-haut"><h2>' + Q.ui.icon("coffre") + " Récompenses" +
        (achats.length ? ' <span class="discret">(' + achats.length + ")</span>" : "") + "</h2>" +
        historique + "</div>" +
      '<div class="carte espace-haut"><h2>Ma maîtrise par opération</h2>' + maitrise + "</div>" +
      '<div class="carte espace-haut"><h2>Ce qu\'il faut revoir</h2>' + erreursHtml + "</div>" +
      '<div class="carte espace-haut"><h2>' + Q.ui.icon("carnet") + " Mon journal</h2>" + journal + "</div>";

    /* Réafficher le parchemin d'une récompense déjà échangée. */
    Array.prototype.forEach.call(el.querySelectorAll("[data-parchemin]"), function (b) {
      b.addEventListener("click", function () {
        var r = achats[parseInt(b.getAttribute("data-parchemin"), 10)];
        if (!r) return;
        Q.audio.son("page");
        Q.ui.modale({
          titre: "Parchemin de réussite",
          contenu: Q.ui.parcheminRecompense(r),
          actions: [
            { label: "Imprimer", classe: "btn--secondaire", action: function () { window.print(); }, fermer: false },
            { label: "Fermer", classe: "btn--primaire" }
          ]
        });
      });
    });
  };
})(window.Quete);
