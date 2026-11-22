# S0-0.4 — Référence des parcours et contrats

22 novembre 2026. Cette référence adapte le premier produit à l’exigence d’entretien contextuel et de plusieurs API/IA. Les anciens contrats de S0-0.3 sont conservés dans l’archive livrée. Les routes privées ci-dessous sont des spécifications ; l’OpenAPI réellement implémenté reste celui du catalogue local.

## Référence principale

`07_ENTRETIEN_ADAPTATIF_ET_MULTI_IA.md` décrit la politique, les snapshots, les contrats de prochaine question, validations, pannes, routage et provenance. En cas d’écart avec une proposition antérieure de plan fixe, S0-0.4 prime.

## Douze écrans et critères

| Écran | Action / contenu à recevoir | Contrôle essentiel |
|---|---|---|
| C01 Découverte | Utilité et limite, première préparation accessible | Aucun média obligatoire ni garantie d’embauche |
| C02 Connexion | OIDC, retour interne autorisé, refus et expiration | Identité serveur, aucun jeton fournisseur exposé |
| C03 Objectif | Stage/emploi, préférences facultatives | Confirmation serveur et révision ; pas de préférence inventée |
| C04 Accueil | Reprendre prioritairement / préparer | État propriétaire, aucun score fictif |
| C05 Catalogue | Objectif, mode adaptatif, axes et limite proposée | Banque distincte d’une liste de questions déjà générées |
| C06 Préparation | Première question, cinq axes, jusqu’à sept tours proposés | Politique/grille figées ; démarrage idempotent |
| C07 Réponse | Question effectivement posée, aide adaptée, valider et pause | Brouillon ≠ conservé ; attente de prochaine question distincte de l’IA de retour |
| C08 Retour | Preuve/commentaire/limites ; demander la prochaine question | Évaluation et génération indépendantes ; aucune note de secours |
| C09 Fin | Fin confirmée, raison et couverture | Pas de fin silencieuse par le fournisseur ; rapport partiel annoncé |
| C10 Historique | Reprendre ou relire les tours réels | Une lecture ne regénère jamais une question |
| C11 Rapport | Axes couverts, tours et références, conseils | Évaluations de la bonne question et versions ; pas de classement |
| C12 Compte | Préférences, demandes de données et déconnexion | Confirmation, annulation, statut réel et nettoyage sous bonne identité |

Maquette guidée/autonome : référence à comparer. Minimum de conception 320 px, actions de 44 px, labels visibles, aide par question, focus et annonces textuelles. Les images décoratives n’empêchent pas questions et actions. Les appareils réels, lecteur d’écran et clavier virtuel restent à tester.

## Identité, droits et erreurs

OIDC : `GET /auth/login`, `GET /auth/callback`, `POST /auth/logout`. État/nonce/issuer/audience/signature/expiration et flux PKCE approprié ; secrets serveur. Utilisateur lié par `(issuer, subject)`, sans fusion automatique par email. Cookies Secure/HttpOnly et CSRF qualifiés avec le fournisseur avant S2.

`GET /api/v1/me`, `PUT /api/v1/me/preferences` : propriétaire, références autorisées, révision attendue, confirmation durable. Objectif stage/emploi et expérience facultative ; aucun propriétaire choisi par le client.

Catalogue visible public ; compte/session/question/réponse/retour/rapport/demande réservés au propriétaire. Ressource privée inexistante ou d’un autre compte : 404 cohérent, sans contenu d’un tiers. Administration sans accès ordinaire au coaching privé ; interventions exceptionnelles bornées et journalisées.

Erreur : code/message/correlation_id et éventuellement erreurs de champ sans recopier la saisie. 401 accès absent ; 409 révision/état/clé ; 422 format ; 429 quota ; 503 non accepté durablement. Une panne après conservation devient un état de travail, jamais une réponse effacée.

## Invariants conservés

- Texte non blanc, limite proposée 4 000 caractères Unicode ; aucune compétence déduite de la longueur.
- Une réponse finale est immuable dans ce premier lot ; relire n’écrit pas. Correction pédagogique dans un nouvel essai.
- Idempotence par principal/opération/ressource/empreinte ; même requête relecture, clé incompatible conflit. Échéances compatibles avec reprises et contraintes métier.
- Évaluation liée à la question réellement posée, réponse/révision, critères autorisés et preuve exacte. Aucun score global ou diagnostic d’apparence/personnalité.
- Rapport sur tours réellement acceptés et évaluations référencées ; publication stable, couverture partielle visible.
- Export/suppression couvrent aussi question contextualisée, contexte, synthèse et travaux. Politique de sauvegardes/sous-traitance à recevoir avant pilote ; pas de durée légale inventée.

La pause et la reprise sont des mutations explicites ; les lectures ne déclenchent ni transition ni appel IA. La fin conserve raison et couverture ; l’IA ne peut pas effacer ou réécrire l’historique.

## Recette des contrats à préparer pour la réalisation

Deux comptes A/B, soumissions concurrentes, coupure après commit, job doublé, réponse invalide, mauvaise ancre, question répétée, question prête relue après changement de fournisseur, timeout incertain, budget global, fournisseur non autorisé et suppression pendant génération. Ces garanties seront testées sur le code métier ; les maquettes simulent seulement les transitions.
