# Responsables, décisions et backlog S0

Référence S0-0.4, 22 novembre 2026. **OUOBA Abdou Rasmané** est l’interlocuteur nommé pour produit, métier et coordination. Les cinq noms ci-dessous sont reçus dans ce chat et affectés dans leur ordre de présentation. Disponibilité confirmée : 24 heures par personne et par sprint, soit 120 heures brutes. Les estimations et la compréhension des nouveaux périmètres restent à confirmer.

**Confirmation reçue ensuite le 22/11/2026 :** le coordinateur répond « tout est bon » après la question sur les cinq périmètres et le backlog estimé. Les périmètres et le backlog ci-dessous sont acceptés sans ajustement demandé. Les estimations ne sont pas des heures consommées ; les corrections issues des essais seront réestimées si nécessaire.

## Affectation du travail

| Place | Responsabilité complète | Revue / dépendance | Affectation nominative |
|---|---|---|---|
| D1 | Accès, préférences, matrice de droits et demandes de données | D2 ; double revue D5 sur identité/données | Ouoba |
| D2 | Catalogue, politique/axes/grille, questions adaptatives figées par tour, session et transitions | D3 ; coordination métier avec OUOBA | Abdou |
| D3 | Ports IA par capacité, validation de question, évaluation, preuves, budgets, erreurs et résultat tardif | D4 ; grille D2 et exploitation D5 | Rasmané |
| D4 | Parcours, composants, aide, mobile, protocole et observations UX | D5 ; contenu D1–D3 | limata |
| D5 | Architecture, contrats transversaux, environnements et exploitation | D1 ; orchestration avec chaque domaine | Oumou |

L’atelier permet noms ou pseudonymes, heures disponibles sur un sprint de deux semaines et confirmation de compréhension du périmètre. Une personne portant plusieurs rôles ne compte qu’une fois dans la capacité ; aucune affectation ne permet de multiplier ses heures disponibles. La revue doit être indépendante quand possible ; sinon tracer la limite.

## Décisions reçues et propositions techniques

| ID | Décision / proposition | État / responsable |
|---|---|---|
| S0-DEC-01 | Construction neuve, candidat d’abord, Burkina puis AES | Reçu du porteur |
| S0-DEC-02 | Premier emploi/stage en français, coaching privé | Priorité reçue ; notices et périmètre adulte à confirmer avant pilote / OUOBA |
| S0-DEC-03 | React/TypeScript + Python/FastAPI, monolithe modulaire | Stack reçue ; versions du démarrage vérifiées |
| S0-DEC-04 | PostgreSQL/SQLAlchemy/Alembic ; Celery/RabbitMQ + outbox | Architecture reçue ; qualification d’environnement en S1 / D5 |
| S0-DEC-05 | Présentation guidée en référence initiale | Proposition à valider après essais / OUOBA + D4 |
| S0-DEC-06 | Texte non blanc 1–4 000 caractères, sans seuil de compétence par longueur | Proposition de contrat / D2 + D3 |
| S0-DEC-07 | Réponse confirmée immuable ; reprise explicite ; nouveau travail dans nouvel essai | Proposition de simplification initiale / D2 |
| S0-DEC-08 | Pas de score global ; preuves exactes ; pas d’appréciation de personnalité | Référence de coaching à recevoir / OUOBA + D3 |
| S0-DEC-09 | Noms canoniques `sessions` et `privacy` ; `profile` sous-domaine d’`identity` | Clarification de nommage avec l’ADR ; anciens noms simulation/data_rights restent des alias documentaires / D5 |
| S0-DEC-10 | Catalogue public ; ressources privées d’autrui retournent 404 | Proposition cohérente d’anti-divulgation / D1 + D5 |
| S0-DEC-11 | Quotas, enveloppe monétaire et tentatives fournisseur par capacité | Valeurs à décider et qualifier avant activation `next_question` en S3 ; aucune offre illimitée / OUOBA + D3/D5 |
| S0-DEC-12 | Rétention, notices, hébergement et traitement des sauvegardes | Politique à recevoir avant collecte privée/pilote ; ne pas inventer de durée légale / OUOBA + D1/D5 |
| S0-DEC-13 | Question suivante fondée sur précédente question et réponse confirmée | Exigence reçue ; banque/politique et limites de 5 axes, 7 tours, 2 relances proposées pour relecture / D2 + OUOBA |
| S0-DEC-14 | Plusieurs API/IA possibles, registre et ports par capacité | Exigence reçue ; adaptateurs et règles de repli proposés, qualification par capacité avant activation / D3 + D5 |
| S0-DEC-15 | AgentRouter comme premier candidat à qualifier pour les entretiens texte | Priorité reçue du porteur le 22/11/2026 ; offre, modèle, données, coûts et secours encore ouverts / OUOBA + D3/D5 |

Une décision technique préparée n’est pas une approbation produit. Les décisions ouvertes ont un responsable et un point de fermeture avant le lot concerné ; elles ne sont pas déclarées résolues pour fermer S0.

## Comparaison OIDC pour le choix avant S2

Comparaison qualitative de conception, sans tarif, contrat signé ni essai fournisseur. Tout fournisseur doit permettre validation OIDC, révocation, retours autorisés et exploitation compatible avec les besoins du pilote.

| Option | Intérêt | Charge / vérifications requises |
|---|---|---|
| Keycloak hébergé pour le projet | Contrôle de configuration et déploiement OIDC | Exploitation, patchs, sauvegarde/restauration, courrier et disponibilité à assumer ; ne pas héberger sans capacité D5 |
| Service OIDC géré, par exemple Auth0 | Exploitation d’identité en partie externalisée | Contrat, localisation, export, coûts et modes d’accès réels à vérifier avec le fournisseur |
| Fournisseur OIDC déjà exploité par un partenaire | Réemploi possible d’une exploitation existante | Dépendance au partenaire, publics autorisés, partage des données et sortie à contractualiser |

Recommandation : choisir selon la capacité d’exploitation et le mode d’accès réellement utilisable par les candidats. Ne pas exiger un email comme identifiant sans vérifier l’usage ; ne pas imposer des SMS payants sans coût et fiabilité connus. POC avant S2 : connexion/refus/reconnexion, expiration et révocation, JWKS/rotation, mauvais issuer/audience, retour interdit, suppression de contexte réutilisé et absence de jetons dans les traces.

## Backlog de clôture estimable

Les durées ci-dessous concernent le travail humain restant et sont des hypothèses à relire, pas des temps déjà consommés ni une promesse. Une tâche préparée attend sa revue ; les essais ne sont pas déjà réalisés.

Les heures suivantes sont une **proposition de travail humain restant**, pas des heures consommées ni des validations obtenues. Chaque durée comprend la lecture, les notes et la revue indiquée. L’équipe les réestime avant engagement ; la préparation matérielle déjà faite n’est pas à recréer.

| ID | Travail et résultat concret attendu | Réalisation proposée | Revue proposée / dépendance |
|---|---|---|---|
| S0-01 | Chaque personne lit son périmètre, confirme la responsabilité et signale une indisponibilité éventuelle | D1–D5 : 1 h chacun | OUOBA coordonne ; noms et 24 h déjà connus |
| S0-02 | Relire accès, droits sur contexte, expiration et reprise ; consigner décisions ouvertes avant collecte | D1 : 4 h | D5 : 1 h ; matrice des droits et critères OIDC |
| S0-03 | Relire les 3 banques / 15 questions, axes, conseils et limites adaptatives ; produire 3 avis métier ou corrections précises | D2 : 4 h | D4 : 1 h ; avis final métier d’OUOBA hors capacité développeur |
| S0-04 | Vérifier conservation, question figée, ancrage, idempotence, attente/panne et fin ; annoter le contrat | D2 : 5 h | D3 : 2 h ; contrat 0.4 et résultat de S0-03 |
| S0-05 | Relire ports IA, validations, preuves, tentatives et sortie tardive ; préciser critères de qualification avant activation | D3 : 5 h | D2 : 1 h ; politique et opérations de S0-04 |
| S0-06 | Parcourir les 12 écrans et les deux variantes ; vérifier aide, progression et 3 confirmations compréhensibles | D4 : 3 h | D1 : 1 h ; maquettes 0.4 |
| S0-07 | Préparer puis animer une première boucle de 3 personnes ; consigner les 10 tâches, aide fournie et bilan de chaque séance | D4 : 5 h | D2 : 1 h ; OUOBA organise les participants, disponibilité réelle nécessaire |
| S0-08 | Analyser les observations, attribuer les difficultés, corriger et retester les points essentiels | D4 : 4 h | D3 : 1 h et D5 : 1 h ; observations S0-07, corrections plus lourdes à réestimer |
| S0-09 | Relire registre fournisseurs, données, outbox, secrets et exploitation ; documenter décisions et responsables | D5 : 5 h | D1 : 1 h ; contrats et ADR 0.4 |
| S0-10 | Réestimer les lots avec 120 h/sprint et nouvelles dépendances ; produire avis backlog et liste des conditions avant chaque lot | D5 : 3 h | D3 : 1 h ; aucun lot futur réalisé ici |
| S0-11 | Relire avis/observations/corrections, vérifier le registre puis proposer décision datée sur S0-0.4 | D1–D5 : 1 h chacun | Réception décidée par OUOBA après les preuves précédentes |

Répartition estimée : **D1 8 h, D2 13 h, D3 11 h, D4 15 h, D5 12 h**, total **59 h**. Cela tient dans les 24 h chacun à ce stade de préparation ; les corrections issues des essais restent inconnues. Sur 120 h, une réserve proposée de 36 h laisse 25 h non engagées après ces 59 h. Ces 25 h ne constituent pas une autorisation de commencer S1 : elles peuvent absorber une seconde boucle d’essais ou une correction réestimée. Le temps produit/métier et le recrutement des participants par OUOBA ne sont pas chiffrés et ne sont pas ajoutés artificiellement à la capacité développeur.

Séquence : S0-01 puis relectures S0-02 à S0-06/S0-09 ; essais S0-07 ; corrections S0-08 ; consolidation S0-10/S0-11. Les relectures indépendantes peuvent se dérouler en parallèle ; les essais dépendent d’une référence compréhensible et disponible. Si une personne cumule des rôles, recalculer sa charge réelle.

**Planification reçue pour S0-07 :** première boucle de trois essais le 22 novembre 2026. Aucun participant ni résultat n’est créé à partir de cette date. L’atelier permet de préparer la séance puis de noter la date effectivement observée, les dix tâches, l’aide et le bilan.

## Risques attribués

| Risque | Responsable de suivi | Preuve de maîtrise à recevoir |
|---|---|---|
| Questions peu comprises ou déconnectées du premier emploi | OUOBA / D2 / D4 | Avis métier et notes candidats |
| Confusion brouillon, serveur et retour IA | D4 / D2 | Essais T04/T06, correction et nouvel essai |
| Accès au coaching d’un autre compte | D1 / D5 | Matrice relue, puis essais A/B sur code privé en S2/S3 |
| Duplications et résultat tardif après suppression | D2 / D3 / D5 | Contrat relu, puis pannes et contraintes en implémentation |
| Dépenses fournisseur incertaines | OUOBA / D3 / D5 | Budget et registre d’usage qualifiés avant activation |
| Capacité d’équipe et exploitation non confirmées | OUOBA / D5 | Nominations/disponibilités, propriétaire d’exploitation |
| Données privées, sous-traitance et sauvegardes mal définies | OUOBA / D1 / D5 | Politique et notices reçues avant pilote |

## Révision adaptative et multi-IA

Les tâches de génération, questions figées par tour, attente/panne et registre par capacités sont détaillées dans `07_ENTRETIEN_ADAPTATIF_ET_MULTI_IA.md`. Les anciennes estimations en jours sont remplacées ci-dessus par une proposition en heures pour le travail restant. D2 porte les opérations/questions et D3 les ports/validations ; D5 contrôle données et routage. `08_IMPACTS_ET_CAPACITE.md` prime sur les hypothèses de capacité des anciens sprints.
