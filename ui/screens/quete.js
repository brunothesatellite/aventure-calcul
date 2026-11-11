/* ============================================================
   Écran de quête : QCM, pavé numérique, calcul posé, aides, feedback
   ============================================================ */
(function (Q) {
  "use strict";

  var SOURCE_LABEL = {
    revue: "Révision",
    cible: "Entraînement",
    defi: "Défi mêlé"
  };

  Q.screens.quete = function (el) {
    var quete = Q.etat.quest;
    if (!quete || quete.fini) { Q.router.go("map"); return; }

    var saisie = "";
    var saisieChamps = {};
    var champActif = null;

    function questionCourante() {
      return quete.questions[quete.index] || null;
    }

    /* ---------- Rendu ---------- */

    function dessiner() {
      var q = questionCourante();
      if (!q) { Q.router.go("map"); return; }

      saisie = "";
      saisieChamps = {};
      champActif = q.champs ? q.champs[0] : null;

      var segments = quete.questions.map(function (_, i) {
        var classe = i < quete.index ? "fait" : i === quete.index ? "encours" : "";
        return '<li class="' + classe + '"></li>';
      }).join("");

      el.innerHTML = '<div class="quete">' +
        '<div class="quete__barre">' +
          '<button class="btn btn--fantome btn--rond" data-action="quitter" aria-label="Quitter la quête"><span aria-hidden="true">✕</span></button>' +
          '<ul class="segments" aria-label="Progression dans la quête">' + segments + "</ul>" +
          '<span class="quete__compteur">' + (quete.index + 1) + " / " + quete.questions.length + "</span>" +
        "</div>" +

        '<div class="carte question-cadre">' +
          '<div class="rangee rangee--entre" style="margin-bottom:10px">' +
            '<span class="discret">' + Q.ui.echapper(Q.ui.operationLabel(q.ile)) + "</span>" +
            '<span class="discret">' + (SOURCE_LABEL[q.source] || "") + "</span>" +
          "</div>" +

          (q.source === "defi"
            ? '<div class="encart encart--defi">Défi : une question sur une opération que tu as déjà travaillée.</div>'
            : "") +

          '<p class="texte-enonce" id="enonce">' + Q.ui.enonceHTML(q.texte) + "</p>" +

          '<div class="rangee" style="margin-top:10px">' +
            '<span class="discret">' + (q.type === "pose" ? "Pose l'opération" : "Trouve le résultat") + "</span>" +
            '<button class="btn btn--fantome btn--rond" data-action="ecouter" aria-label="Écouter l\'énoncé">' +
              Q.ui.icon("haut-parleur") + "</button>" +
          "</div>" +

          (q.consigne ? '<p class="discret" style="margin:8px 0 0">' + Q.ui.echapper(q.consigne) + "</p>" : "") +

          zoneReponse(q) +
          aidesHTML(q) +
          '<div class="zone-feedback" id="zone-feedback"></div>' +
        "</div>" +
      "</div>";

      binder(q);
      if (q.termine) restaurer(q);
    }

    function zoneReponse(q) {
      if (q.type === "qcm") {
        return '<div class="options" id="options">' + q.options.map(function (o, i) {
          return '<button class="option" data-choix="' + o.valeur + '" data-index="' + i + '">' +
            '<span class="option__lettre">' + "ABC".charAt(i) + "</span>" +
            "<span>" + Q.generateur.formatNombre(o.valeur) + "</span></button>";
        }).join("") + "</div>";
      }
      if (q.type === "pose") {
        return '<div class="pose-zone">' +
          Q.exercices.poseHTML(q) +
          pave(q) +
        "</div>";
      }
      return '<div class="saisie">' +
        (q.champs ? champsHTML(q) : '<div class="saisie__ecran" id="ecran" aria-live="polite">?</div>') +
        pave(q) +
      "</div>";
    }

    function champsHTML(q) {
      var labels = q.labels || {};
      var defaut = { quotient: "Part entière", reste: "Reste" };
      return '<div class="deux-champs" id="deux-champs">' + q.champs.map(function (c) {
        return '<button class="champ-reponse' + (c === champActif ? " actif" : "") + '" data-champ="' + c + '">' +
          '<span class="champ-reponse__label">' + Q.ui.echapper(labels[c] || defaut[c] || c) + "</span>" +
          '<span class="champ-reponse__valeur" data-valeur="' + c + '">?</span></button>';
      }).join("") + "</div>" +
      '<p class="discret centre" style="margin:6px 0 0">Touche une case, puis écris le nombre.</p>';
    }

    function pave(q) {
      var virgule = !q.champs && (q.decimales > 0 ||
        (typeof q.reponse === "number" && Math.abs(q.reponse - Math.round(q.reponse)) > 1e-9));
      var touches = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) {
        return '<button class="pave__touche" data-chiffre="' + n + '">' + n + "</button>";
      }).join("");
      return '<div class="pave" role="group" aria-label="Clavier numérique">' + touches +
        (virgule
          ? '<button class="pave__touche" data-chiffre="," aria-label="Virgule">,</button>'
          : '<button class="pave__touche pave__touche--vide" tabindex="-1" aria-hidden="true"></button>') +
        '<button class="pave__touche" data-chiffre="0">0</button>' +
        '<button class="pave__touche pave__touche--outil" data-action="effacer" aria-label="Effacer le dernier chiffre">⌫</button>' +
        "</div>" +
        '<button class="btn btn--primaire btn--bloc espace-haut-sm" data-action="valider">Valider</button>';
    }

    function aidesHTML(q) {
      var html = '<div class="aides">';
      html += '<button class="aide-btn" data-aide="indice"' + (q.indiceVu ? " disabled" : "") + ">" +
        Q.ui.emoji("ampoule", "") + " Indice</button>";
      if (q.type === "qcm" && Q.achat.aFamille("eliminer")) {
        html += '<button class="aide-btn" data-aide="eliminer"' + ((quete.aides.eliminer || 0) >= 1 ? " disabled" : "") + ">" +
          Q.ui.emoji("perroquet", "") + " Éliminer un choix</button>";
      }
      if (Q.achat.aFamille("decomposer")) {
        html += '<button class="aide-btn" data-aide="decomposer"' + ((quete.aides.decomposer || 0) >= 1 ? " disabled" : "") + ">" +
          Q.ui.emoji("crabe", "") + " Décomposer</button>";
      }
      if (Q.achat.aFamille("astuce")) {
        html += '<button class="aide-btn" data-aide="astuce"' + ((quete.aides.astuce || 0) >= 1 ? " disabled" : "") + ">" +
          Q.ui.emoji("tortue", "") + " L'astuce</button>";
      }
      return html + "</div>";
    }

    function feedbackHTML(f, type, extra) {
      return '<div class="feedback feedback--' + type + '" role="status">' +
        '<p class="feedback__titre">' + f.titre + "</p>" +
        "<p>" + f.texte + "</p>" +
        (f.regle ? '<p class="feedback__regle">' + Q.ui.emoji("ampoule", "") + " " + f.regle + "</p>" : "") +
        (extra || "") +
        "</div>";
    }

    /* ---------- Affichage de la saisie ---------- */

    function majAffichage(q) {
      if (q.champs) {
        q.champs.forEach(function (c) {
          var cible = el.querySelector('[data-valeur="' + c + '"]');
          if (cible) cible.textContent = saisieChamps[c] || "?";
        });
        Array.prototype.forEach.call(el.querySelectorAll("[data-champ]"), function (b) {
          b.classList.toggle("actif", b.getAttribute("data-champ") === champActif);
        });
        return;
      }
      if (q.type === "pose") {
        var pose = el.querySelector("#pose-resultat");
        if (pose) pose.textContent = saisie || "?";
        return;
      }
      var ecran = el.querySelector("#ecran");
      if (ecran) ecran.textContent = saisie || "?";
    }

    /* ---------- Actions ---------- */

    function ajouterChiffre(c) {
      var q = questionCourante();
      if (!q || q.termine || q.type === "qcm") return;
      if (q.champs) {
        if (c === ",") return;
        var actuel = saisieChamps[champActif] || "";
        if (actuel.length >= 3) return;
        saisieChamps[champActif] = actuel + c;
      } else {
        if (c === "," && saisie.indexOf(",") !== -1) return;
        if (c !== "," && saisie.replace(",", "").length >= 7) return;
        saisie += c;
      }
      Q.audio.son("page");
      majAffichage(q);
    }

    function effacer() {
      var q = questionCourante();
      if (!q || q.termine || q.type === "qcm") return;
      if (q.champs) {
        var actuel = saisieChamps[champActif] || "";
        saisieChamps[champActif] = actuel.slice(0, -1);
      } else {
        saisie = saisie.slice(0, -1);
      }
      majAffichage(q);
    }

    function valider() {
      var q = questionCourante();
      if (!q || q.termine) return;

      var valeur;
      if (q.champs) {
        var incomplet = q.champs.some(function (c) { return !saisieChamps[c]; });
        if (incomplet) {
          Q.ui.toast("Remplis les deux cases.", "ko");
          return;
        }
        valeur = {};
        q.champs.forEach(function (c) {
          valeur[c] = Q.exercices.normaliser(saisieChamps[c]);
        });
      } else {
        if (!saisie) {
          Q.ui.toast("Écris un nombre avant de valider.", "ko");
          return;
        }
        valeur = Q.exercices.normaliser(saisie);
      }

      if (valeur == null) {
        Q.ui.toast("Ce n'est pas un nombre.", "ko");
        return;
      }
      traiter(valeur);
    }

    function traiter(valeur, bouton) {
      var q = questionCourante();
      if (!q || q.termine) return;
      Q.audio.reveiller();

      var r = Q.session.repondre(valeur);
      var zone = el.querySelector("#zone-feedback");
      if (!zone) return;

      if (r.correct) {
        Q.audio.son("ok");
        if (r.premierCoup) Q.audio.son("piece");
        marquerBonne(q, bouton);
        desactiverTout();
        zone.innerHTML = feedbackHTML(Q.feedback.succes(q), "ok") + boutonSuivant();
        lierSuivant();
        return;
      }

      Q.audio.son("ko");
      if (r.essais >= 2) {
        desactiverTout();
        var f = Q.feedback.aide(q, 2, r.famille);
        zone.innerHTML = feedbackHTML(f, "ko", correctionHTML(q)) + boutonSuivant();
        afficherCorrection(q);
        lierSuivant();
        return;
      }

      if (q.type === "qcm" && bouton) marquer(bouton, "option--mauvaise");
      else {
        saisie = "";
        saisieChamps = {};
        majAffichage(q);
      }
      zone.innerHTML = feedbackHTML(Q.feedback.aide(q, 1, r.famille), "ko");
      var premierChamp = el.querySelector("[data-champ]");
      if (premierChamp) premierChamp.focus();
    }

    function correctionHTML(q) {
      var texte = Q.exercices.decomposition(q);
      if (!texte) return "";
      return '<p class="feedback__regle">' + Q.ui.emoji("crabe", "") + " " + Q.ui.echapper(texte) + "</p>";
    }

    function marquer(bouton, classe) {
      if (!bouton) return;
      bouton.classList.add(classe);
      bouton.disabled = true;
    }

    function marquerBonne(q, bouton) {
      if (q.type !== "qcm") return;
      if (bouton) { marquer(bouton, "option--bonne"); return; }
      var bonne = el.querySelector('[data-choix="' + q.reponse + '"]');
      if (bonne) marquer(bonne, "option--bonne");
    }

    function desactiverTout() {
      Array.prototype.forEach.call(el.querySelectorAll(".option, .pave__touche, [data-aide], [data-action='valider']"), function (b) {
        b.disabled = true;
      });
      Array.prototype.forEach.call(el.querySelectorAll("[data-champ]"), function (b) {
        b.disabled = true;
      });
    }

    /* Révèle la bonne réponse dans la zone de réponse. */
    function afficherCorrection(q) {
      if (q.type === "qcm") {
        var bonne = el.querySelector('[data-choix="' + q.reponse + '"]');
        if (bonne) bonne.classList.add("option--bonne");
        return;
      }
      if (q.type === "pose") {
        var zonePose = el.querySelector(".pose");
        if (zonePose) zonePose.outerHTML = Q.exercices.poseHTML(q, { corrige: true });
        return;
      }
      if (q.champs) {
        q.champs.forEach(function (c) {
          var cible = el.querySelector('[data-valeur="' + c + '"]');
          if (cible) cible.textContent = Q.generateur.formatNombre(q.reponse[c]);
        });
        return;
      }
      var ecran = el.querySelector("#ecran");
      if (ecran) ecran.textContent = Q.generateur.formatNombre(q.reponse);
    }

    function boutonSuivant() {
      return '<div class="rangee rangee--droite espace-haut-sm">' +
        '<button class="btn btn--primaire" data-suite="1">Continuer →</button></div>';
    }

    function lierSuivant() {
      var b = el.querySelector("[data-suite]");
      if (!b) return;
      b.addEventListener("click", function () {
        Q.audio.son("page");
        var r = Q.session.suivante();
        if (r.fini) terminer(r.resultat);
        else dessiner();
      });
    }

    /* ---------- Liaisons ---------- */

    function binder(q) {
      Array.prototype.forEach.call(el.querySelectorAll("[data-choix]"), function (b) {
        b.addEventListener("click", function () {
          if (b.disabled) return;
          traiter(Number(b.getAttribute("data-choix")), b);
        });
      });

      Array.prototype.forEach.call(el.querySelectorAll("[data-chiffre]"), function (b) {
        b.addEventListener("click", function () {
          ajouterChiffre(b.getAttribute("data-chiffre"));
        });
      });

      Array.prototype.forEach.call(el.querySelectorAll("[data-champ]"), function (b) {
        b.addEventListener("click", function () {
          champActif = b.getAttribute("data-champ");
          majAffichage(q);
        });
      });

      Array.prototype.forEach.call(el.querySelectorAll("[data-aide]"), function (b) {
        b.addEventListener("click", function () {
          if (b.disabled) return;
          utiliserAide(b.getAttribute("data-aide"), q, b);
        });
      });

      Array.prototype.forEach.call(el.querySelectorAll("[data-action]"), function (b) {
        b.addEventListener("click", function () {
          var a = b.getAttribute("data-action");
          if (a === "effacer") effacer();
          if (a === "valider") valider();
          if (a === "ecouter") Q.audio.parler(q.texteOral || q.texte);
          if (a === "quitter") {
            Q.ui.confirmer("Quitter la quête ?", "Tu pourras la reprendre plus tard, là où tu t'es arrêté.", "Quitter")
              .then(function (ok) { if (ok) Q.router.go("map"); });
          }
        });
      });
    }

    function utiliserAide(type, q, bouton) {
      var zone = el.querySelector("#zone-feedback");
      if (type === "indice") {
        q.indiceVu = true;
        quete.aides.indice = (quete.aides.indice || 0) + 1;
        bouton.disabled = true;
        zone.innerHTML = feedbackHTML({
          titre: "Un petit coup de pouce",
          texte: "Relis l'énoncé, puis demande-toi : est-ce que j'ajoute, j'enlève, je multiplie ou je partage ?",
          regle: ""
        }, "");
        Q.audio.son("page");
      }
      if (type === "eliminer") {
        quete.aides.eliminer = (quete.aides.eliminer || 0) + 1;
        bouton.disabled = true;
        var mauvais = Array.prototype.slice.call(el.querySelectorAll(".option")).filter(function (b) {
          return !b.disabled && Number(b.getAttribute("data-choix")) !== q.reponse;
        });
        var cible = mauvais[Math.floor(Math.random() * mauvais.length)];
        if (cible) {
          cible.classList.add("option--retiree");
          cible.disabled = true;
          Q.ui.toast("Le perroquet a éliminé un mauvais choix !");
        } else {
          Q.ui.toast("Plus aucun mauvais choix à éliminer.", "ko");
        }
      }
      if (type === "decomposer") {
        quete.aides.decomposer = (quete.aides.decomposer || 0) + 1;
        bouton.disabled = true;
        var texte = Q.exercices.decomposition(q);
        zone.innerHTML = feedbackHTML({
          titre: "Le crabe décompose le calcul",
          texte: "",
          regle: texte
        }, "");
        Q.audio.parler(texte);
      }
      if (type === "astuce") {
        quete.aides.astuce = (quete.aides.astuce || 0) + 1;
        bouton.disabled = true;
        var astuce = Q.feedback.astuce(q.competence);
        zone.innerHTML = feedbackHTML({
          titre: "La tortue te rappelle l'astuce",
          texte: "",
          regle: astuce
        }, "");
        Q.audio.parler(astuce);
      }
      Q.jeu.sauver();
    }

    /* ---------- Reprise après rechargement ---------- */

    function restaurer(q) {
      desactiverTout();
      var zone = el.querySelector("#zone-feedback");
      if (!zone) return;
      if (q.reussi) {
        zone.innerHTML = feedbackHTML(Q.feedback.succes(q), "ok") + boutonSuivant();
      } else {
        zone.innerHTML = feedbackHTML(Q.feedback.aide(q, 2, "calcul"), "ko", correctionHTML(q)) + boutonSuivant();
      }
      afficherCorrection(q);
      lierSuivant();
    }

    function terminer(res) {
      if (!res) { Q.router.go("map"); return; }
      if (!res.revision) {
        Q.jeu.enregistrerQuete(res.ileId, res.niveauId, res);
        if (res.gardien) {
          var ile = Q.ile(res.ileId);
          if (ile) Q.jeu.ajouterPointe(ile.operation);
        }
      }
      res.nouveauxBadges = Q.badges.verifier();
      Q.etat.quest = null;
      Q.jeu.sauver();
      Q.audio.son("fanfare");
      Q.router.go("resultat", { resultat: res });
    }

    /* ---------- Clavier physique ---------- */

    if (Q.__queteClavier) document.removeEventListener("keydown", Q.__queteClavier);
    Q.__queteClavier = function (e) {
      if (Q.router.ecran !== "quete") return;
      var q = questionCourante();
      if (!q || q.termine) return;
      if (/^[0-9]$/.test(e.key)) {
        if (q.type !== "qcm") { ajouterChiffre(e.key); e.preventDefault(); }
        return;
      }
      if (e.key === "," || e.key === ".") {
        if (q.type !== "qcm") { ajouterChiffre(","); e.preventDefault(); }
        return;
      }
      if (e.key === "Backspace") {
        if (q.type !== "qcm") { effacer(); e.preventDefault(); }
        return;
      }
      if (e.key === "Enter" && document.activeElement &&
          document.activeElement.tagName !== "BUTTON") {
        if (q.type !== "qcm") { valider(); e.preventDefault(); }
      }
    };
    document.addEventListener("keydown", Q.__queteClavier);

    dessiner();
  };
})(window.Quete);
