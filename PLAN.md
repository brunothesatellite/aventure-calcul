# PLAN DE RÉALISATION — « L'Archipel des Calculs » (ex-`aventure-conjugaison`)

**Version** : 1.0 (proposition à valider)
**Public** : enfant de 10 ans, CM1, France
**Source analysée** : `D:\VS_Code_Workspaces\aventure-conjugaison` (v final, 2 profils, SRS, boutique, espace parent)
**Statut** : plan seulement — **aucune ligne de code applicatif écrite**. Ce document est la seule trace.

## ✅ Décisions validées (11/11/2026)

| Sujet | Décision |
|---|---|
| **Titre** | **« L'Archipel des Calculs »**, sous-titre « La Boussole des Opérations » |
| **Déblocage d'île** | **6 étoiles sur 12** (permissif : une opération bloquante n'enferme pas l'enfant) |
| Volume de contenu | **160 énoncés** (40 par île, 10 par niveau, 3 formulations chacun) |
| Mode de réponse | **QCM (niv. 1-2) puis pavé numérique (niv. 3-4)** |
| Division | **quotient + reste** aux niveaux 3-4 (deux champs) — pas d'arrondi au supérieur en v1 |
| Multiplication | **priorité aux tables (2 à 10)** ; les multiplications à deux chiffres se limitent à un énoncé posé |
| Périmètre | **calcul mental + décimaux (niv. 4) + calcul posé en colonnes dès la v1** |
| Univers | **archipel pirate conservé** (mêmes assets, 8 visuels à produire) |
| Outil de test | **« Tout débloquer »** dans l'espace parent, avec sauvegarde/restauration de la progression réelle |

Conséquences sur le chiffrage : le lot contenu passe de 12 h à ~20 h, le lot moteur gagne +4 h
(calcul posé), et l'arrondi au supérieur sort du périmètre v1. Total révisé : **≈ 45 h** (§ 11).

**État au 11/11/2026** : lots **L0 à L6 terminés**. Le jeu est jouable de bout en bout et le
contenu est complet : **160 énoncés** (40 par île, 10 par niveau, 3 formulations). La Salle des
tables, la carte de chaleur des parents et la **division posée en potence** (niveau 3 de l'île
Division) sont en place. Une page d'essai (`essai-retenues.html`) permet de tester les quatre
opérations posées. Reste le polish et la recette. Voir `README.md`.

---

## 0. Résumé exécutif

Le projet source est de bonne qualité : architecture sans build, `file://` compatible, sauvegarde
versionnée multi-profils, économie fermée, espace parent honnête sur sa sécurité. **80 % du code est
directement transposable** (stockage, profils, routeur, écrans, CSS, boutique, badges, PIN, export).

Mais trois modules portent la conjugaison dans leurs fondations et **ne peuvent pas être transposés** :

| Module source | Pourquoi il ne se transpose pas | Remplacement |
|---|---|---|
| `engine/morphologie.js` | découpe radical/terminaison : notion inexistante en calcul | `engine/generateur.js` |
| `engine/distractors.js` | leurres choisis dans un stock fini de formes verbales | `engine/leurres.js` (leurres **calculés par type d'erreur**) |
| `engine/srs.js` | clé `verbe\|temps\|personne` : cartes finies, mémorisables | clé `compétence\|palier` |

C'est justement ce passage d'un contenu **fini et énumérable** (187 phrases) à un contenu
**infini et paramétré** (160 gabarits × nombres tirés au hasard) qui rend le projet intéressant :
il oblige à remplacer « la bonne réponse est dans la base » par « la bonne réponse est *calculée* ».
Tout le plan tourne autour de cette bascule.

**Trois conséquences structurantes :**

1. Le type d'exercice « assemblage radical + terminaison » n'a pas d'équivalent : il devient
   **saisie au pavé numérique** (+ option « calcul posé en colonnes »).
2. Le leurre n'est plus pioché, il est **fabriqué à partir d'une erreur d'enfant réelle**
   (retenue oubliée, table voisine, inversion de chiffres…). Bénéfice secondaire énorme :
   le type d'erreur est **connu par construction**, donc le tableau de bord parent devient
   enfin pertinent (dans le code source, `feedback.analyser()` renvoie toujours `"terminaison"` — bug relevé § 10).
3. La répétition espacée ne porte plus sur des questions mais sur des **compétences**
   (`add.retenue`, `mul.table-7`, `div.reste`…). Un enfant peut donc réviser 3 ans sans que
   la carte « s'épuise », et sans jamais revoir deux fois le même énoncé.

---

## 1. Ce qui se garde, ce qui se réécrit, ce qui disparaît

### 1.1 Se garde (copie, textes adaptés)

`engine/storage.js` · `engine/state.js` · `engine/audio.js` · `ui/router.js` · `ui/components.js`
· les 10 écrans · `assets/css/*` · polices · pictos inline · émojis · gestion multi-profils
· corbeille · PIN parent · export/import JSON · mécanique Leitner · journal · récompenses réelles.

### 1.2 Se réécrit

| Fichier source | Devient | Nature du changement |
|---|---|---|
| `content/registry.js` | `content/registry.js` | validation : plus de `{trou}`/pronom, mais « réponse entière », « pas de fuite », « retenues ≤ n » |
| `content/curriculum.js` | `content/curriculum.js` | ordre des îles inchangé dans l'esprit, seuils et compétences à redéfinir |
| `content/verbs/*` (20) | *supprimé* | — |
| `content/phrases/*` (4) | `content/enonces/*` (4) | 160 gabarits paramétrés (§ 4) |
| `content/adventures/*` | `content/iles/*` | même structure, récit et décors adaptés |
| `engine/morphologie.js` | `engine/generateur.js` | nouveau |
| `engine/distractors.js` | `engine/leurres.js` | nouveau |
| `engine/exercises.js` | `engine/exercises.js` | `qcm` + `saisie` + `choix-operation` |
| `engine/feedback.js` | `engine/feedback.js` | micro-leçons procédurales par famille d'erreur |
| `engine/srs.js` | `engine/srs.js` | clé = compétence, pas question |
| `engine/rewards.js` | `engine/rewards.js` + `content/badges.js` | sortir le contenu du moteur (dette du projet source) |
| `tools/lint-content.js` | `tools/lint-enonces.js` | 500 tirages par gabarit (§ 9.4) |
| `verbs.js` (racine) | *supprimé* | vestige de la v0, non chargé |

### 1.3 Décision de confort : on garde `window.Quete`

Renommer le namespace obligerait à toucher 30 fichiers pour zéro bénéfice fonctionnel.
**On garde `window.Quete`** et on ne change que ce qui doit l'être : les clés `localStorage`
(`aventure-calcul:v1` / `:v2` / `:corbeille`) et le champ `application` des exports
(`quete-des-nombres`). Les deux jeux peuvent ainsi cohabiter sur le même appareil sans se marcher dessus.

---

## 2. Cadrage pédagogique CM1

### 2.1 Ce que dit le programme (et ce qu'on en fait)

| Attendus CM1 | Traduction dans le jeu |
|---|---|
| Tables de multiplication jusqu'à 10 | île 3, niveaux 1 à 3 (mémorisation puis reconnaissance inverse) |
| Calcul mental : doubles/moitiés, ×10/×100, compléments à 100, ±9/±11/±99 | îles 1 et 2 niveau 3, île 3 niveau 3 + « carnet de stratégies » |
| Addition/soustraction de nombres entiers et décimaux | île 1 et 2, décimaux réservés au niveau 4 |
| Multiplication d'un entier par un nombre à un chiffre, par 10/100 | île 3 niveau 4 |
| Division euclidienne (quotient et reste), diviseur à un chiffre | île 4, niveaux 3 et 4 |
| Résoudre un problème à une ou deux étapes | niveau 4 de chaque île + Gardien |
| Choisir l'opération qui convient | question « défi » mêlée, une par quête maximum |

> **Hors périmètre assumé** : division décimale (CM2), fractions opératoires (CM2),
> multiplication de deux nombres à deux chiffres posée (CM2). On ne les met pas, on ne les
> suggère pas, on ne les débloque pas « en bonus ».

### 2.2 Profil de l'apprenant (10 ans) et conséquences

| Caractéristique | Conséquence de design |
|---|---|
| Lecture fluide mais lente sur un énoncé-problème | énoncé ≤ 22 mots, une seule question finale, TTS systématique |
| Calcul mental en cours d'automatisation | **une seule retenue / un seul emprunt** par question aux niveaux 1-3 |
| Besoin de traces intermédiaires | zone « brouillon » dépliable (décomposition guidée), jamais imposée |
| Fierté de la vitesse maîtrisée | record personnel de série, **jamais** de chrono imposé |
| Erreur = normal en calcul | 2 essais, puis réponse montrée **et recalculée** pas à pas |
| Motivation par la collection | 4 pointes de boussole, 20 déguisements, 20 astuces, 22 badges |

### 2.3 Garde-fous numériques (le cœur du « réalisable de tête »)

C'est la partie la plus importante du plan : un gabarit mal borné produit des questions
infaisables, et l'enfant décroche. Chaque gabarit déclare ses bornes, et le générateur
**refuse** tout tirage qui viole une contrainte. Quatre prédicats calculés automatiquement :

- `retenues(a, b)` : nombre de retenues d'une addition (compté chiffre à chiffre) ;
- `emprunts(a, b)` : nombre d'emprunts d'une soustraction ;
- `chiffres(n)` : nombre de chiffres ;
- `magnitude(n)` : puissance de 10 dominante (sert à filtrer les leurres).

| Opération | Niveau 1 | Niveau 2 | Niveau 3 | Niveau 4 |
|---|---|---|---|---|
| **Addition** | somme ≤ 20, 1 chiffre + 1 chiffre | ≤ 100, `retenues ≤ 1` | ≤ 1000, `retenues ≤ 2`, compensation 9/11/99 | décimaux (1 décimale), somme ≤ 100, 2 étapes |
| **Soustraction** | ≤ 20, sans emprunt | ≤ 100, `emprunts ≤ 1` | ≤ 1000, `emprunts ≤ 2`, écart et complément à 100 | monnaie, décimaux, 2 étapes |
| **Multiplication** | tables 2/5/10, produit ≤ 20 | tables 3/4/6, produit ≤ 36 | tables 7/8/9 + ×10/×100/×1000 | 2 chiffres × 1 chiffre, **produit ≤ 200** |
| **Division** | ÷2, ÷5, ÷10 exacts, dividende ≤ 50 | tables exactes, dividende ≤ 72 | euclidienne, dividende ≤ 100, `reste < diviseur` | dividende ≤ 200, partage et groupement |

**Interdits absolus, dans tous les gabarits** : résultat négatif · résultat non entier quand
l'énoncé compte des objets · réponse égale à un nombre déjà écrit dans l'énoncé · opérande 0 ou 1
(sauf gabarit qui l'explique) · dividende > 200 · produit > 200 au mental · plus de 2 étapes.

> **Distinction importante** : ces bornes sont celles du **calcul de tête** (QCM, pavé numérique).
> Les gabarits **posés en colonnes** portent leur propre jeu de bornes, forcément plus large
> (jusqu'à 4 chiffres, 2 retenues / emprunts) puisqu'il ne s'agit plus d'un calcul mental.
> Chaque gabarit déclare donc `mode: "tete" | "pose"`, et le linter applique la grille correspondante.

**Budget temps** : une question = **≤ 20 s** pour un enfant de 10 ans. Si un tirage peut dépasser
ce budget (ex. 348 + 276 : deux retenues + trois chiffres), la contrainte le refuse.

### 2.4 Modèle de maîtrise (identique à l'original, seuils recalés)

- **1 ★** : quête terminée.
- **2 ★** : ≥ 7 bonnes réponses du premier coup sur 8.
- **3 ★** : 8/8 du premier coup, sans aucune aide.
- Les étoiles ne se perdent **jamais**. Une île se débloque à **8 ★ / 12**.
- Une compétence est « solide » quand sa boîte Leitner ≥ 3 **et** sans échec sur les 3 derniers passages.

---

## 3. Les quatre îles

Fil rouge : le **Comte Désordre** a démonté la **Boussole des Quatre Opérations** et dispersé ses
quatre pointes gravées (`+ − × ÷`). Chaque île reconquise rend une pointe. Les quatre réunies, la
boussole indique le Trésor de l'Archipel. (Même ressort narratif que la Boussole brisée du jeu
d'origine : progression visible, fin atteignable.)

| # | Île | Opération | Gardien | Accent |
|---|---|---|---|---|
| 1 | **La Crique des Coffres** | addition | Le Crabe Accumulateur | ambre / or |
| 2 | **Le Gouffre des Disparus** | soustraction | La Sangsue du Gouffre | bleu profond |
| 3 | **La Jungle des Multiples** | multiplication | Le Poulpe Multiplieur (8 bras = ×8) | vert |
| 4 | **Le Port du Partage** | division | Le Kraken Partageur | terracotta |

### 3.1 Découpage des 4 niveaux par île

**Île 1 — La Crique des Coffres (+)**
1. *Les Coquillages* — additions dans 10, dans 20. `add.dans10`, `add.dans20`
2. *Le Sac de Pièces* — 2 chiffres + 1 ou 2 chiffres, **une retenue**. `add.retenue`
3. *Le Grand Coffre* — jusqu'à 1000, deux retenues, compensation (37 + 9, 48 + 99), complément à 100. `add.strategie`, `add.complement`
4. *Le Butin des Équipages* — décimaux (dixièmes), monnaie, problème en 2 étapes. `add.decimaux`, `add.deuxEtapes`

**Île 2 — Le Gouffre des Disparus (−)**
1. *Les Crabes qui Partent* — soustractions dans 10 et 20, sans emprunt. `sub.dans10`, `sub.dans20`
2. *La Noix de Coco* — 2 chiffres − 1 chiffre, **un emprunt**. `sub.emprunt`
3. *Le Trésor Entamé* — 2-3 chiffres, écarts, compléments (« combien manque-t-il pour arriver à 100 ? »). `sub.ecart`, `sub.complement`
4. *La Monnaie du Marchand* — rendre la monnaie, décimaux, 2 étapes. `sub.monnaie`, `sub.decimaux`

**Île 3 — La Jungle des Multiples (×)**
1. *Les Bandes de Singes* — **tables de 2, 3, 4, 5 et 10**. `mul.table-2`, `mul.table-3`, `mul.table-4`, `mul.table-5`, `mul.table-10`
2. *La Canopée* — **tables de 6, 7, 8 et 9**. `mul.table-6`, `mul.table-7`, `mul.table-8`, `mul.table-9`
3. *Le Chantier des Pirogues* — **deux chiffres × un chiffre, faciles** : 12 à 25 × 2 à 4, produit ≤ 100, en pavé numérique. `mul.deuxChiffres`
4. *Le Comptoir des Pirogues* — **deux chiffres × un chiffre, plus grands** : 13 à 48 × 2 à 5, produit ≤ 200, en pavé **et en calcul posé** ; plus l'**aire d'un rectangle**, avec la formule rappelée dans l'énoncé (« on multiplie la longueur par la largeur »). `mul.deuxChiffresGrand`, `mul.aire`
> **Décision** : les tables occupent les deux premiers niveaux ; les niveaux 3-4 sont des calculs
> écrits à deux chiffres. **Jamais de deux chiffres × deux chiffres** (34 × 27 est exclu),
> ni de trois chiffres.

**Île 4 — Le Port du Partage (÷)**
1. *Le Partage des Coquillages* — moitié, division par 10, parts égales. `div.moitie`, `div.table-10`
2. *Les Bandes Égales* — tables inversées, retrouver le nombre de parts, ÷5. `div.inverse`, `div.table-5`
3. *Les Caisses de Boulets* — division euclidienne : **quotient + reste**. `div.reste`
4. *L'Équipage à Répartir* — dividende ≤ 200, partage et groupement, interprétation du reste dans un contexte concret (« il reste 3 boulets, il faut une caisse de plus » traité en **discussion dans la correction**, pas en réponse attendue). `div.partage`

### 3.2 Le Gardien

7 questions mêlant les 4 niveaux de l'île + 2 questions **mêlant les opérations déjà travaillées**
(c'est là que se joue « choisir la bonne opération », l'objectif CM1 le plus transférable).
Récompense : la pointe de la boussole + badge d'île. Aucun chrono, aucun échec : le Gardien se
rejoue.

---

## 4. Le modèle des 160 énoncés paramétrés

### 4.1 Principe

Un énoncé n'est plus une phrase à trou, c'est un **gabarit** + des **bornes numériques** + une
**opération**. Le texte final et la réponse sont produits au moment de la quête, puis **figés dans
la sauvegarde** (`Q.etat.quest`) : recharger la page redonne exactement la même question.

```js
{
  id: "add-coffres-01",
  ile: "addition",
  niveau: 2,
  competence: "add.retenue",
  difficulte: 2,
  nombres: {
    a: { min: 24, max: 58 },
    b: { min: 17, max: 39 }
  },
  contraintes: ["a + b <= 100", "retenues(a,b) == 1"],
  enonce: "Le cuisinier range {a} biscuits dans un coffre et {b} dans un autre. Combien de biscuits a-t-il rangés en tout ?",
  operation: "+",
  reponse: "a + b",
  unite: "biscuits",
  lecon: "retenue"
}
```

**Le mini-langage volontairement pauvre** (5 primitives, pas plus) :

| Primitive | Rôle |
|---|---|
| `{min, max}` | tirage uniforme |
| `{min, max, multipleDe}` | tirage contraint (utile pour ×10, ÷5) |
| `{calc: "q*d + r"}` | nombre **calculé** (indispensable en division) |
| `{pluriel: "perroquet|perroquets"}` | accord automatique → « 1 perroquet » / « 4 perroquets » |
| `contraintes: [...]` | expressions booléennes évaluées par le générateur (`retenues()`, `emprunts()`, `<`, `<=`) |

> Refus assumé : pas de langage de template complet, pas d'expression arithmétique libre dans le
> texte. Chaque gabarit reste **relisible et vérifiable à la main**, et le linter le teste sur
> 500 tirages.

### 4.2 Pluriels, élisions, unités

Le piège n°1 des énoncés générés est le français qui casse (« 1 perroquets », « de 1 pièces »,
« quatre-vingt-un »). La primitive `{pluriel}` couvre le cas majoritaire ; les gabarits qui
introduisent un nombre en lettres sont interdits (on n'écrit jamais le nombre en lettres).
Le générateur fournit aussi `texteOral` (les symboles devenus mots : « 47 fois 3 ») pour la
synthèse vocale, car « × » est mal prononcé par les moteurs TTS.

### 4.3 Volume et coût de rédaction

| Option | Énoncés | Par niveau | Quêtes avant de revoir un récit | Coût rédaction |
|---|---|---|---|---|
| A | 128 (32/île) | 8 | 1 quête | ~10 h |
| **B — ✅ retenu** | **160** (40/île) | **10** | **2 quêtes** | **~13 h** |
| C | 240 (60/île) | 15 | 3 à 4 quêtes | ~19 h |
| D | 400 (100/île) | 25 | ~5 quêtes | ~30 h |

Calcul : une quête consomme 7 questions du niveau (8 au niveau 1) ; avec 10 gabarits et
3 formulations, une quête affiche 8 formulations **différentes**. C'est le seuil utile :
un niveau se joue 2 à 3 fois. Au-delà de 15, le gain ne sert plus qu'à la révision espacée.
L'architecture rend l'ajout de 10 gabarits par niveau trivial (1 fichier, 0 ligne de moteur).

### 4.4 Exemples, opération par opération (extraits rédigés)

**Addition — problème, niveau 2 (retenue)**
> « Sur la plage, {a} coquillages brillent dans le sable. Malo en ramasse encore {b}.
> Combien de coquillages a-t-il maintenant ? » — `a+b ≤ 100`, `retenues(a,b) == 1`

**Addition — calcul sec, niveau 3 (compensation)**
> « {a} + {b} = ? » avec `b ∈ {9, 11, 19, 21, 99}` → la stratégie « +10 −1 » est la bonne route.

**Addition — monnaie, niveau 4 (décimaux)**
> « Malo achète une corde de {a} m et une de {b} m. Quelle longueur de corde a-t-il en tout ? »
> — `a, b` en dixièmes, somme ≤ 100, `somme` entière en dixièmes.

**Soustraction — reste, niveau 2**
> « Le sac contient {a} noix de coco. L'équipage en mange {b}. Combien en reste-t-il ? »
> — `emprunts(a,b) == 1`

**Soustraction — écart (piège du « combien de plus »), niveau 3**
> « {a} pirates sont sur le pont, {b} sont dans la cale. Combien y a-t-il de pirates de plus sur le pont ? »
> — `a > b`, réponse = écart, jamais une somme.

**Soustraction — manque, niveau 4 (renversement)**
> « Malo a {a} pièces. Un sabre coûte {b} pièces. Combien lui manque-t-il ? » — `a < b`
> Le leurre « b − a » est **volontairement** proposé : c'est l'erreur de sens la plus fréquente.

**Multiplication — groupement, niveau 1**
> « Il y a {a} coffres. Dans chaque coffre, {b} pièces d'or. Combien de pièces en tout ? »

**Multiplication — puissance de 10, niveau 3**
> « Le marchand vend {a} coquillages à 10 pièces chacun. Combien reçoit-il ? »

**Multiplication — prix unitaire, niveau 4**
> « {a} caisses pèsent {b} kg chacune. Combien pèsent-elles en tout ? » — `a` 2 chiffres, `a*b ≤ 200`

**Division — partage exact, niveau 1**
> « On partage {a} pièces entre {b} pirates. Combien chacun en reçoit-il ? » — `a = q*b`

**Division — quotient et reste, niveau 3 (deux champs)**
> « On range {a} boulets dans des caisses de {b}. Combien de caisses pleines, et combien
> reste-t-il de boulets ? » — `a = q*b + r`, `r < b`

**Division — arrondi au supérieur** *(hors périmètre v1, gardé en réserve v1.1)*
> « Pour transporter {a} pirates, combien faut-il de barques de {b} places ? »
> — réponse = `⌈a/b⌉`, avec `r > 0` imposé pour que l'arrondi serve vraiment.
> Nécessite un mode de réponse dédié. Écarté de la v1 : la règle de lecture du reste est déjà
> fragile chez un enfant de 10 ans, on l'introduit d'abord **en correction**, pas en réponse exigée.

### 4.5 Ce que le linter vérifie sur chaque gabarit (500 tirages)

1. La réponse est un entier (sauf gabarit décimaux déclaré).
2. La réponse n'est jamais négative, ni égale à un opérande écrit dans l'énoncé.
3. Aucun opérande 0 ou 1 non déclaré.
4. Toutes les contraintes sont satisfaites **à chaque tirage** (pas « en moyenne »).
5. Les valeurs tirées sont distinctes deux à deux quand l'énoncé l'exige.
6. Le texte final ne contient plus d'accolade, l'accord en nombre est correct sur les 500 tirages.
7. Trois leurres générés sont possibles, distincts, plausibles et jamais égaux à la réponse.
8. La question est résoluble par la compétence déclarée (vérification manuelle cosignée sur un échantillon).

---

## 5. Moteur de question

### 5.1 Trois types d'exercice

| Type | Niveaux | Remplace | Pourquoi |
|---|---|---|---|
| **QCM 3 choix** | 1-2 (+ Gardien) | QCM conjugaison | guidage, découverte de la compétence |
| **Saisie au pavé numérique** | 3-4 | assemblage radical/terminaison | l'enfant **produit** le résultat (clavier 0-9, effacer, valider, Entrée) |
| **Calcul posé en colonnes** | 2-3 | assemblage radical/terminaison | transplant direct de l'assemblage : on construit la réponse chiffre par chiffre, avec une ligne de retenues |
| **Choix de l'opération** | défi mêlé | — | objectif CM1 « quelle opération ? », 4 boutons `+ − × ÷` |

**Calcul posé (dans la v1)** : addition, soustraction et multiplication. L'opération est affichée
en colonnes alignées ; l'enfant remplit les chiffres du résultat de droite à gauche, une ligne de
retenues étant réservée au-dessus. Deux règles de conception :
- la grille **ne montre jamais** combien de chiffres contient le résultat (sinon on donne un indice
  d'ordre de grandeur) — mais elle limite le nombre de cases au maximum théorique ;
- une case fausse n'invalide pas tout : on signale la colonne fautive et son type d'erreur
  (`retenue`, `emprunt`), ce qui alimente directement les micro-leçons du § 5.3.

Pour la division, la version jouable garde les deux champs « quotient / reste ». Une **potence
complète** (chiffres descendus, produits et différences de chaque étape) est disponible sur la
page d'essai `essai-retenues.html` : on valide d'abord la lisibilité et le geste sur mobile avant
de l'intégrer aux quêtes.

### 5.2 Leurres : fabriqués par famille d'erreur

Le générateur de leurres ne tire **jamais** un nombre au hasard (l'enfant le repérerait par la
taille et le jeu deviendrait un test de lecture d'ordre de grandeur).

| Famille | Erreur modélisée | Exemple (bonne réponse 42) |
|---|---|---|
| `retenue-oubliee` | retenue non reportée | 32 |
| `retenue-ajoutee` | retenue comptée deux fois | 52 |
| `table-voisine` | table n±1 | 36 ou 48 |
| `inversion` | chiffres permutés | 24 |
| `dizaine` | ±10 / ±100 | 32 ou 142 |
| `operation-voisine` | `a+b` au lieu de `a×b`, `b−a` au lieu de `a−b` | 13 |
| `reste-egal-quotient` | quotient et reste confondus | (9, 9) au lieu de (9, 2) |
| `reste-superieur` | reste ≥ diviseur | (8, 7) pour 45 ÷ 5 |
| `moitie-double` | double au lieu de moitié | 84 |

Règles dures :
- 2 leurres, **2 familles différentes**, jamais deux fois la même famille dans une quête ;
- magnitude du leurre à ±25 % de la bonne réponse (sinon on l'élimine « à l'œil ») ;
- le leurre le plus probable est **pondéré par l'historique d'erreurs de l'enfant** (`stats.erreurs`) :
  l'app lui fait retravailler précisément ce qu'il rate ;
- dédoublonnage strict : un leurre égal à la réponse annule la question (le linter le détecte sur 500 tirages).

### 5.3 Feedback : la micro-leçon devient procédurale

Différence clé avec la conjugaison : ici on ne peut pas seulement dire la règle, il faut **montrer
le geste**. Chaque erreur produit trois lignes : *ce qui s'est passé* → *le geste* → *le résultat*.

| Code | Message type |
|---|---|
| `retenue` | « 7 + 8 = 15 : j'écris **5** et je retiens **1** dizaine. Tu l'avais oubliée. » |
| `emprunt` | « 2 − 8 est impossible : j'emprunte une dizaine à côté. » |
| `table` | « 6 × 7 = 42. 6 × 8 = 48 : c'est la table voisine. » |
| `dizaine` | « × 10 : j'ajoute un zéro, je ne multiplie pas par 10 en comptant. » |
| `reste` | « 5 × 9 = 45. 47 − 45 = 2 : il reste 2. » |
| `reste-superieur` | « Le reste doit toujours être plus petit que le diviseur. » |
| `sens-operation` | « Ils partent : le nombre **diminue**. » |
| `inversion` | « 52 et 25 n'ont pas les mêmes chiffres au même endroit. » |
| `ordre-de-grandeur` | « 48 × 3, c'est presque 50 × 3 = 150 : la réponse doit être proche de 150. » |

Deux affordances visuelles, activables : **la décomposition** (`47 + 38` → `40 + 30` et `7 + 8`)
et **l'opération posée** en colonnes, chiffres alignés, retenue en petit. Le brouillon reste
**fermé par défaut** : on ne donne pas la réponse, on donne la méthode.

### 5.4 Audio

TTS sur l'énoncé complet (jamais la réponse), voix `fr-FR`. `texteOral` obligatoire.
Les sons d'interface du jeu source sont conservés tels quels.

Dans les réglages : **choix de la voix** parmi les voix françaises de l'appareil et
**réglette de vitesse** (0,70 → 1,30). Les deux valeurs sont relues à chaque lecture et
sauvegardées dans le profil (`reglages.voixNom`, `reglages.voixVitesse`).

---

## 6. Répétition espacée et composition de quête

### 6.1 SRS par compétence

- Clé : `competence|palier` (ex. `mul.table-7|2`). ~40 compétences (§ 3.1) × 3 paliers max = plafond
  naturel d'environ 120 cartes, très en dessous du quota `localStorage`.
- Mêmes intervalles Leitner que l'original : J+1, J+3, J+7, J+21.
- `dues()` ne renvoie que des compétences **déjà rencontrées et dont l'île est débloquée** : on ne
  révise jamais une division avant d'avoir ouvert le Port du Partage.
- Anti-répétition narrative : un anneau des 40 derniers `gabarit.id` interdits au tirage suivant.

### 6.2 Une quête = 8 questions

1. **2 révisions** (compétences dues, îles déjà travaillées)
2. **Le niveau du jour**, puis un **rappel des niveaux précédents** de la même île
   (60 % / 40 %). C'est ce rappel qui casse la monotonie quand un niveau ne compte que
   deux ou trois énoncés.
3. **1 défi mêlé** : une autre opération déjà travaillée.

**Anti-répétition**, à trois étages :
- chaque énoncé existe en **plusieurs formulations** (`enonces`) : dans une même quête, un
  énoncé répété change de texte ;
- un gabarit sert d'abord ceux qu'on a le moins vus ;
- deux questions identiques ne se suivent jamais (échange avec une voisine).

Durée estimée : **2 min 30** (contre 3-4 min en conjugaison : les questions sont plus rapides).
Seuils d'étoiles : 7/8 → 2 ★, 8/8 → 3 ★.

> **Point d'attention** : comme les questions sont plus rapides, la boucle de récompense tourne plus
> vite. Deux parades, à trancher après test : 8 questions au lieu de 7 (proposé), et/ou prix de
> boutique +20 %. Ne pas toucher aux deux à la fois.

---

## 7. Économie, boutique, badges, carnet, parents

### 7.1 Économie (héritée, à calibrer)

| Gain | Montant |
|---|---|
| Bonne réponse du premier coup | +2 or (+3 aux niveaux 3-4) |
| Bonne réponse après correction | +1 or |
| Quête sans erreur | +10 or |
| Gardien vaincu | +25 or |

Mêmes garde-fous que l'original : aucun achat ne conditionne l'accès à un contenu, les familiers
aident mais ne jouent pas, un puits à or cosmétique empêche l'inflation.

### 7.2 Boutique : 3 familiers transposés

| Familier | Prix | Effet |
|---|---|---|
| **Crabe Compteur** | 60 | *Coup de pouce* : affiche la décomposition de l'opération, 1×/quête |
| **Singe Fureteur** | 120 | *Élimine un mauvais choix*, 1×/quête |
| **Tortue Savante** | 200 | *Rappelle l'astuce* (stratégie de calcul), 1×/quête |

**20 déguisements** conservés (mêmes icônes, quelques renommages pour le thème : compas de marine,
chapeau d'amiral, bâton de comptage…). **3 récompenses réelles** négociées avec les parents :
mécanique conservée à l'identique, parchemins imprimables compris — c'est le dispositif de
rétention le plus efficace du jeu source.

### 7.3 Badges (22, adaptés)

`Sans faute` (3 ★) · `L'Infaillible` (10 d'affilée) · `Gros Magot` (200 or gagnés) ·
`Maître des tables` (les 10 tables rencontrées sans faute) · `Zéro reste` (10 divisions exactes) ·
`Roi du partage` · `As du calcul posé` · `Première pointe` · `Amiral des Nombres` (4 pointes) ·
`Calcul éclair` (30 compétences solides) · 4 badges de fin d'île · 4 badges de Gardien · etc.
Chaque badge est visible grisé dans le carnet : **jamais d'objectif caché**.

### 7.4 Nouveau : le Carnet de stratégies

20 astuces à **collectionner** (débloquées par la maîtrise d'une compétence), qui remplacent les
« règles » de conjugaison et donnent du contenu au carnet :

> `+ 9` → « j'ajoute 10, j'enlève 1 » · `× 4` → « je double deux fois » ·
> `× 5` → « × 10 puis ÷ 2 » · `× 25` → « × 100 puis ÷ 4 » · `÷ 2` → « la moitié » ·
> `complément à 100` → « je monte à la dizaine, puis à la centaine »

Intérêt : c'est du **contenu pédagogique réel**, ça se collectionne, et ça sert directement dans
l'espace « Tortue Savante ».

### 7.5 Espace parent

Conservé (PIN 4 chiffres, appui long 1,2 s, export/import, corbeille) avec un tableau de bord
**plus utile que l'original** :

- chaleur par île × niveau (étoiles) ;
- **carte des erreurs par famille** (retenue / emprunt / table / reste / sens / inversion) :
  c'est un diagnostic, pas une statistique ;
- top 5 des compétences fragiles, avec le nombre de passages ;
- temps de jeu par jour, journal des quêtes, récompenses achetées ;
- **« Tout débloquer »** (outil de test) : ouvre les 4 îles à 2 ★, en mettant la progression
  réelle de côté ; un second bouton la restaure. Rien n'est détruit.

---

## 8. Architecture cible

```
aventure-calcul/
├─ index.html               ordre des <script>
├─ main.js                  démarrage, réglages, navigation globale (inchangé)
├─ PLAN.md                  ce document
├─ content/
│  ├─ registry.js           enregistrement + validation (nouvelles règles)
│  ├─ curriculum.js         ordre des îles, seuils, rangs, taille de quête
│  ├─ competences.js        ← nouveau : taxonomie des ~40 compétences
│  ├─ strategies.js         ← nouveau : les 20 astuces
│  ├─ badges.js             ← nouveau : contenu sorti du moteur
│  ├─ enonces/
│  │  ├─ addition.js        50 gabarits
│  │  ├─ soustraction.js    50
│  │  ├─ multiplication.js  50
│  │  └─ division.js        50
│  └─ iles/                 4 fichiers (récit, décors, niveaux, Gardien)
├─ engine/
│  ├─ storage.js            clés aventure-calcul:v1/v2/corbeille
│  ├─ state.js              + strategies[], gabaritsVus[], stats par compétence
│  ├─ generateur.js         ← nouveau : tirage, contraintes, texte, pluriels
│  ├─ leurres.js            ← nouveau : leurres par famille d'erreur
│  ├─ exercises.js          qcm | saisie | posé en colonnes | choix-operation
│  ├─ feedback.js           réécrit : erreur connue par construction
│  ├─ srs.js                clé = compétence|palier
│  ├─ session.js            même squelette, 8 questions
│  ├─ rewards.js            or, badges, familiers
│  └─ audio.js              inchangé
├─ ui/                      router, components, 10 écrans (textes adaptés)
├─ assets/                  CSS, polices, pictos, émojis repris
│                           + 4 fonds d'île + 4 Gardiens + 4 pointes de boussole
└─ tools/
   ├─ lint-enonces.js       ← nouveau : 500 tirages par gabarit
   ├─ lint-contenu.js       structure îles/niveaux/badges
   └─ test-navigateur.mjs   test de bout en bout (adapté du source)
```

**Contraintes techniques conservées à l'identique** (elles font la valeur du projet source) :
aucun build · aucun CDN · aucun `import`/`export` ES · double-clic sur `index.html` en `file://` ·
`localStorage` uniquement · aucune donnée envoyée · aucune police ou image distante ·
respect de `prefers-reduced-motion` · navigation clavier complète.

**Licences** : code MIT, contenus pédagogiques CC BY-SA 4.0, pictos game-icons (CC BY 3.0),
émojis Twemoji (CC BY 4.0), polices OFL. `CREDITS.md` et `assets/manifest.json` conservés et
complétés pour les 8 nouveaux visuels.

---

## 9. Améliorations proposées (au-delà de la transposition)

Classées par rapport valeur / coût.

| # | Proposition | Pourquoi | Coût |
|---|---|---|---|
| 1 | **Leurres par famille d'erreur** | supprime le tricheur « je repère la taille », et rend le diagnostic parent exploitable | moteur, inclus |
| 2 | **SRS par compétence** | le contenu étant infini, la carte doit être une *compétence*, pas une question | petit |
| 3 | **Pavé numérique + calcul posé** | passer de « reconnaître » à « produire » : c'est là que l'apprentissage se fait | moyen |
| 4 | **Carnet de stratégies (20 astuces)** | transforme les règles en collection ; sert d'aide contextuelle | moyen |
| 5 | **Brouillon / décomposition à la demande** | l'aide montre la *méthode*, pas la réponse | petit |
| 6 | **Salle des tables** (bonus sur la carte) | le besoin n°1 du CM1, coût quasi nul avec le générateur : 10 tables en rafale, record personnel | petit |
| 7 | **Carte de chaleur des erreurs (parents)** | passe d'une statistique à un diagnostic | petit |
| 8 | **Défi mêlé « quelle opération ? »** | objectif CM1 le plus transférable, et casse la monotonie d'une île | petit |
| 9 | **Question `estimation` en fin de Gardien** | « le résultat est plutôt 100, 200 ou 300 ? » : enseigne l'ordre de grandeur | petit |
| 10 | **Linter à 500 tirages** | sur du contenu généré, un bug est *probabiliste* : seul un tirage massif le révèle | petit |
| 11 | **Assainissement : contenu hors du moteur** | le source mélange 22 badges dans `rewards.js` et 20 cosmétiques dans le même fichier | petit |
| 12 | **Mode `défi éclair` optionnel** (5 questions, chrono désactivable) | certains enfants de 10 ans aiment la vitesse ; **désactivé par défaut**, jamais pénalisant | petit |

---

## 10. Bugs repérés dans le code source, à ne pas recopier

Relevés pendant l'analyse, sans les corriger dans le projet d'origine :

1. **`engine/feedback.js:83-85`** — `analyser()` renvoie `"terminaison"` **dans tous les cas** :
   les deux branches finales sont identiques. Conséquence : le tableau de bord parent
   (« types d'erreurs les plus fréquents ») affiche une seule catégorie. Dans le nouveau projet,
   l'erreur est **connue par construction** (on sait quelle famille a produit le leurre choisi),
   donc le problème disparaît.
2. **`content/registry.js:45`** — la vérification des prérequis est du code mort
   (`!....some(...) && !pid` est toujours vrai quand `pid` est vide).
3. **`engine/exercises.js:20`** — `doitAssembler` utilise `Q.etat.reglages` comme garde-fou
   sémantique alors qu'il teste la présence des réglages, pas une préférence.
4. **`engine/session.js:154-160`** — `stats.questions` est incrémenté aussi sur l'échec, ce qui
   rend le ratio « bonnes réponses / questions » non interprétable.

Aucun de ces points n'est bloquant pour le jeu source, mais les trois premiers se propageraient
silencieusement dans un fork.

---

## 11. Lots de réalisation

**L0, L1, L2 et L3 sont terminés** (11/11/2026). Livrables vérifiables :
`node tools/lint-enonces.js` (64 000 tirages, 0 erreur) et `node tools/smoke-navigateur.mjs`
(59 étapes, dont une quête jouée au clic, 0 erreur console).

| Lot | Contenu | Livrable vérifiable | Est. |
|---|---|---|---|
| **L0 — Fork & socle** | copie, nettoyage du contenu conjugaison, clés de stockage, titres, 4 îles vides | on navigue, le profil survit au rechargement | 2 h |
| **L1 — Générateur** | DSL (5 primitives), contraintes (`retenues`, `emprunts`), pluriels, `texteOral`, 20 gabarits d'essai + linter | `node tools/lint-enonces.js` = 0 erreur sur 10 000 tirages | 4 h |
| **L2 — Moteur de question** | qcm, pavé numérique, **calcul posé en colonnes**, leurres par famille, feedback procédural, TTS | ✅ quête de 8 questions jouable, y compris posée et division à 2 champs | 9 h — fait |
| **L3 — Contenu** | **160 gabarits** (40/île, 10/niveau), 4 Gardiens, récit, badges, 20 stratégies | ✅ 4 îles terminables, 0 erreur de lint | 13 h — fait |
| **L4 — Progression** | SRS compétences, étoiles, or, boutique, carnet, **Salle des tables** | ✅ boucle complète, record et badge de table | 2 h — fait |
| **L5 — Parents & données** | PIN, récompenses, **carte de chaleur**, erreurs par famille, export/import, corbeille | ✅ parchemin imprimé + sauvegarde restaurée | 2 h — fait |
| **L6 — Division posée** | potence interactive dans les quêtes (quotient, produits, différences, chiffres descendus) | ✅ 8 gabarits de niveau 3, test DOM de bout en bout | 1 h — fait |
| **L7 — Polish** | accessibilité, clavier, responsive 320 px, animations, contrastes | recette accessibilité passée | 2 h |
| **L8 — Recette** | lint massif, test navigateur, test « vrai enfant », calibrage or | liste de bugs corrigée | 3 h |

**Total ≈ 44 h**, dont **15 h réalisées** (L0-L2) et **≈ 29 h restantes** (contenu, Salle des
tables, parents, polish). Le jeu est jouable dès maintenant ; le contenu (L3) est le premier
poste de dépense.

---

## 12. Risques et parades

| Risque | Impact | Parade |
|---|---|---|
| Énoncé ambigu (« combien de plus » vs « combien en tout ») | apprentissage faux | linter + relecture cosignée de chaque gabarit ; famille d'énoncés normalisée |
| Nombre qui rend la question infaisable (2 retenues + 3 chiffres) | découragement | contraintes `retenues()/emprunts()` **vérifiées à chaque tirage** |
| Français cassé par le tirage (« 1 perroquets ») | crédibilité | primitive `{pluriel}` + test des 500 tirages sur le texte final |
| Leurre repérable à la taille | jeu trivialisé | magnitude ±25 %, calculé par famille d'erreur |
| Lassitude : 50 gabarits/île s'épuisent | abandon | 1 gabarit = 4 plages ; extension par fichier, sans toucher au moteur |
| Division à reste mal comprise | erreur installée | deux champs séparés + micro-leçon « le reste est plus petit que le diviseur » |
| Inflation de l'or (questions plus rapides) | récompenses dévaluées | 8 questions/quête, calibrage après 2 semaines, jamais les deux leviers à la fois |
| Décimaux qui débordent du programme | surcharge | décimaux limités au niveau 4 de 2 îles, jamais de division décimale |
| Fork contaminé par les bugs du source (§ 10) | dette invisible | corriger explicitement aux lots L0/L2 |

---

## 13. Décisions à valider

| # | Sujet | Décision |
|---|---|---|
| 1 | **Titre** | ✅ « L'Archipel des Calculs », sous-titre « La Boussole des Opérations » |
| 2 | **Univers** | ✅ archipel pirate conservé (continuité visuelle, mêmes assets) |
| 3 | **Modes de réponse** | ✅ QCM (niv. 1-2) puis pavé numérique (niv. 3-4) |
| 4 | **Calcul posé en colonnes** | ✅ **dans la v1** (addition, soustraction, multiplication) |
| 5 | **Division** | ✅ exacte aux niv. 1-2, **quotient + reste** aux niv. 3-4 (2 champs) |
| 6 | **Arrondi au supérieur** (barques) | ❌ hors v1 — traité en correction, réévalué en v1.1 |
| 7 | **Décimaux / monnaie** | ✅ uniquement au niveau 4 des îles 1 et 2, jamais ailleurs |
| 8 | **Volume de contenu** | ✅ **160 énoncés** (40/île, 10/niveau) |
| 9 | **Taille de quête** | 8 questions, seuils 7/8 et 8/8 |
| 10 | **Économie** | montants du source conservés, recalibrage après test réel |
| 11 | **Chrono** | aucun par défaut ; mode « défi éclair » optionnel, désactivé |
| 12 | **Salle des tables** | oui, bonus débloqué après l'île 3 |
| 13 | **Namespace** | on garde `window.Quete`, seules les clés de stockage changent |
| 14 | **Sons / voix** | identiques au source (Web Audio + `speechSynthesis`) |

### Reste à trancher (non bloquant, peut se décider en cours de route)

1. **Nom du méchant** : « Le Comte Désordre » (proposé) — à valider, c'est lui qui portera les dialogues.
2. **Économie** : montants du source conservés, à recalibrer après deux semaines de test réel.

> Ces deux points n'empêchent pas de démarrer le lot L2.

---

## 14. Prochaine étape

**L0 à L3 sont livrés** : 160 énoncés, 480 formulations, 64 000 tirages validés, 59 étapes
de test navigateur au vert.

Reste :

1. **L7** — polish accessibilité, calibrage de l'or après deux semaines de test réel.
2. **L8** — recette : lint massif, test navigateur, test « vrai enfant ».

Le contenu peut encore grandir : ajouter 10 énoncés à un niveau demande un fichier et zéro
ligne de moteur.
