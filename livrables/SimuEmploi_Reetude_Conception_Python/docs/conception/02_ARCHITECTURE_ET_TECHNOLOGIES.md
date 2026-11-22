# SimuEmploi — architecture et technologies recommandées

**Dossier de conception proposé — 20 novembre 2026.** Les technologies présentées ici sont des choix à valider lors des preuves de concept. Elles ne sont pas toutes installées et ne décrivent pas une application déjà déployée.

**Complément :** la [variante backend Python](06_OPTION_BACKEND_PYTHON.md) compare FastAPI/Django et décrit les remplacements de technologies. Le document présent conserve la proposition Node initiale pour permettre un choix explicite avant implémentation.

## 1. Principes qui guident l'architecture

1. Préserver une réponse avant de demander une analyse IA.
2. Donner un accès utile en texte et sur connexion limitée.
3. Séparer les finalités coaching personnel, exercice pédagogique et campagne recruteur.
4. Décider les droits, quotas, progression et calculs dans le serveur.
5. Garder la trace du scénario, de la grille et du modèle utilisés.
6. Rendre les erreurs et mesures indisponibles explicites.
7. Limiter le nombre de services à exploiter au démarrage.
8. Pouvoir remplacer un fournisseur sans réécrire le produit.

Ces principes répondent aux problèmes identifiés dans le prototype. Ils priment sur le choix d'un framework à la mode.

## 2. Architecture de départ

**Recommandation : application web/PWA React, API Node.js/TypeScript organisée en modules, PostgreSQL et worker asynchrone issu du même code serveur.** Le frontend, l'API et le worker ont des processus de déploiement distincts ; le domaine métier reste un monolithe modulaire.

Le frontend gère l'affichage, la saisie, les médias facultatifs et la reprise locale. L'API authentifie, contrôle les accès, applique les règles et persiste. Le worker produit les feedbacks/rapports et exécute les tâches longues. La base conserve les données et la file de travaux durable. Les systèmes externes sont accessibles par adaptateurs.

Au pilote, le worker peut partager un hôte avec l'API ; il reste un processus indépendant pour ne pas bloquer les réponses HTTP. À l'ouverture, API et workers peuvent être répliqués séparément. La disponibilité de PostgreSQL, les connexions et les limites IA deviennent les contraintes à mesurer.

Les frontières exactes sont représentées dans les vues C4 et de déploiement du [catalogue de diagrammes](03_DIAGRAMMES.md).

## 3. Stack cible

| Besoin | Choix recommandé | Raison et vérification nécessaire |
|---|---|---|
| Langage partagé | TypeScript strict | Contrats lisibles et erreurs détectées ; ajouter les types React et limiter `any` |
| Runtime serveur | Node.js 26 LTS cible ; Node.js 24 LTS si compatibilité requise | Versions LTS maintenues ; figer le patch et vérifier SDK/ORM/build sur la cible |
| Frontend | React + Vite | Réutilisation du prototype ; chargement différé des modules audio/vidéo |
| Style et composants | Tailwind CSS + composants accessibles | Conserver les styles utiles et tester clavier, contraste et lecteur d'écran |
| Navigation | React Router ou équivalent maintenu | Vraies routes, contrôle de reprise et URLs autorisées |
| Données serveur côté client | TanStack Query ou couche équivalente | États de chargement, invalidation et polling ; éviter les retries non idempotents |
| API initiale | Express maintenu, TypeScript, modules métier explicites | Réutilisation du serveur ; services, autorisation et validation séparés |
| Schémas d'entrée/sortie | Zod | Validation runtime du JSON client et du JSON IA ; contrat cohérent avec OpenAPI |
| Contrats HTTP | OpenAPI versionné | Documentation, génération éventuelle de client et tests de contrat |
| Données principales | PostgreSQL 18 comme base de POC | Transactions, relations, contraintes et politique d'accès ; valider offre d'hébergement/support |
| Accès SQL et migrations | Prisma, version maintenue figée après POC | Schéma/contrat typé, migrations revues et transactions ; SQL spécifique si nécessaire |
| Tâches différées | pg-boss sur PostgreSQL | Queue durable et retries sans ajouter Redis au premier déploiement |
| Identité | Fournisseur OIDC contractualisé | Éviter de développer mots de passe/récupération ; vérifier pays, coûts et lieux de données |
| Session navigateur | Cookie sécurisé, session serveur | Jetons fournisseur conservés serveur ; révocation et protections CSRF appropriées |
| Cache et reprise | IndexedDB + Service Worker | Données structurées locales et assets publics ; gestion des appareils partagés |
| Audio | Web Audio / MediaRecorder ; transcription sous adaptateur | Mesures descriptives, contrôle de formats et fournisseur autorisé |
| IA textuelle | Adaptateur Gemini initial, modèle configurable | Réutilisation existante ; validation JSON, grille, budget et tests d'évaluation |
| Fichiers facultatifs | Stockage objet compatible S3, bucket privé | CV et médias choisis ; accès court, contrôle de contenu et rétention |
| Paiement | Adaptateur d'un prestataire agréé et disponible localement | Signature/confirmation serveur, rapprochement et registre d'usage |
| Journaux et métriques | Logs structurés + OpenTelemetry | Accès, latence, coûts, queue et incidents ; ne pas journaliser les réponses brutes par défaut |
| Livraison | Docker + CI GitHub Actions si dépôt GitHub | Environnement reproductible, tests et images versionnées ; secrets protégés |

Les versions Node 26 et 24 sont LTS au jour de cette étude. Ce statut n'est pas une preuve de compatibilité des dépendances de SimuEmploi. Source : [calendrier et versions Node.js](https://nodejs.org/en/about/previous-releases).

PostgreSQL permet des politiques de sécurité par ligne. L'usage doit être configuré avec des rôles et transactions adaptés, et testé ; les propriétaires/superutilisateurs peuvent contourner certaines politiques. Source : [documentation PostgreSQL](https://www.postgresql.org/docs/18/ddl-rowsecurity.html).

Prisma documente la génération des contrats et les migrations ; les commandes et formats dépendent de la version retenue. Ne pas copier des procédures d'une ancienne version sans vérification. Source : [migrations Prisma](https://www.prisma.io/docs/orm/prisma-migrate).

pg-boss fournit une file PostgreSQL et des mécanismes de transactions/reprise. Les effets chez un fournisseur externe exigent malgré tout une idempotence applicative et une gestion des appels au résultat incertain. Source : [documentation du projet pg-boss](https://github.com/timgit/pg-boss).

### Express, NestJS ou autre backend ?

Conserver Express est raisonnable pour reprendre ce code avec une petite équipe connaissant Node. La condition est d'abandonner le fichier serveur monolithique au profit de modules testables. Si l'équipe construit un backend neuf et maîtrise NestJS, celui-ci peut fournir une structure de modules, injection de dépendances et contrôles transversaux. Il s'appuie notamment sur des adaptateurs HTTP ; il ne remplace pas la définition du domaine ou des droits. Source : [modules NestJS](https://docs.nestjs.com/fundamentals/modules).

Laravel, Django ou Spring Boot restent des options si ce sont les compétences disponibles. Une migration ajoute toutefois du travail d'intégration avec le prototype. **Le dossier retient Express modulaire comme base ; NestJS est une alternative, pas une dépendance supplémentaire.**

Redis/BullMQ, Kubernetes et une base vectorielle séparée restent différés. Ils sont introduits si une contrainte mesurée le justifie. Aucune raison actuelle ne nécessite une base différente pour chaque module.

## 4. Outils pour bien faire la réétude et le développement

| Étape | Outils légers recommandés | Livrable produit |
|---|---|---|
| Comprendre le besoin | Guide d'entretien, observation, formulaires et registre des hypothèses | Problème documenté, personas observés, parcours et alternatives |
| Étudier la viabilité | Tableau de coûts/recettes, catalogue de partenaires et offres pilotes | Économie par session/contrat et engagements vérifiables |
| Définir le périmètre | User stories, critères d'acceptation et backlog priorisé | MVP, exclusions et règles métier |
| Concevoir l'expérience | Penpot ou Figma si disponible ; prototype de parcours | Maquettes testées texte/audio, reprise et partage |
| Dessiner l'architecture | Mermaid, C4 et journal de décisions ADR | Diagrammes versionnés et choix expliqués |
| Développer | VS Code ou IDE de l'équipe, Git, gestionnaire unique et lock figé | Code relu, historique et environnement reproductible |
| Tester les fonctions | Vitest, tests SQL/intégration et Playwright | Vérifications des règles et parcours à risque |
| Tester la charge | k6 et supervision serveur | Rapport de capacité et limites de consommation |
| Évaluer l'IA | Corpus versionné, grilles humaines, harness de comparaison | Qualité, répétabilité, provenance et erreurs analysées |
| Vérifier la sécurité | Revue de menaces, dépendances/secrets, OWASP ZAP selon périmètre | Risques documentés, corrections et tests d'accès |
| Livrer/exploiter | Docker, CI, registre d'images, sauvegardes et procédures | Version de production, restauration et retour arrière |

Les outils de recherche ne doivent pas collecter de CV ou d'enregistrement sans finalité, information et conditions appropriées. Les diagrammes sont conservés avec le code pour évoluer ensemble.

## 5. Modules métier

| Module | Responsabilités | Données principales |
|---|---|---|
| Identité et autorisation | Principal utilisateur, rôles, organisations, sessions d'accès | Users, memberships, access sessions |
| Référentiels | Scénarios, grilles, niveaux, langues et publication | Scenarios, scenario versions, rubric versions |
| Simulation | Session, questions, réponses, pause, reprise et fin | Sessions, questions, answers |
| Évaluation et rapport | Travail IA, validation, provenance et feedback | Evaluations, reports, processing jobs |
| Établissements | Cohortes, inscriptions et exercices attribués | Cohorts, cohort members, assignments |
| Recrutement | Campagne, participants, revue et contestation | Campaigns, participants, reviews, appeals |
| Partage et données | Autorisations explicites, finalités, rétention, export/suppression | Share grants, notices, processing records, deletion requests |
| Consommation et paiement | Réservations, consommation, achat et rapprochement | Usage ledger, payment events, transactions |
| Exploitation | Audit, feedback produit, incidents et notifications | Audit events, feedbacks, notification jobs |

Une route appelle un service métier ; le service utilise des interfaces de dépôt et de fournisseur. Les règles d'accès ne sont pas dispersées dans les composants React. Le worker réutilise les services nécessaires, avec un compte de service limité.

### Structure de dépôt proposée

```text
apps/
  web/                  interface React et reprise locale
  api/                  bootstrap HTTP et routes
  worker/               bootstrap des tâches différées
packages/
  contracts/            schémas Zod, contrats HTTP et types publics
  domain/               règles, modules et cas d'utilisation
  database/             contrat SQL/ORM, migrations et dépôts
  integrations/         OIDC, IA, transcription, stockage, paiement
  ui/                   composants accessibles réutilisables
tests/
  integration/          base réelle de test, autorisations, idempotence
  e2e/                  parcours candidat/établissement/recruteur
  load/                 scénarios de montée de charge
  ai-evaluation/        corpus autorisé et protocole de relecture
docs/
  architecture/         diagrammes, ADR, règles et procédures
```

Cette structure est une cible. La migration peut commencer dans le dossier actuel avec les mêmes frontières, puis évoluer en workspace si cela simplifie les tests et la livraison. Ne pas créer des packages vides sans besoin.

## 6. Règles métier fondamentales

- Une session appartient à un utilisateur et possède une finalité immuable.
- Une session personnelle a `organization_id = null`. Une session institutionnelle appartient à une organisation et à un utilisateur identifié.
- Un scénario et une grille sont figés par version pour la session/campagne. Une nouvelle publication n'altère pas les résultats anciens.
- Le nombre de questions et la progression sont calculés serveur.
- Une réponse validée est conservée avant son évaluation ; une correction ultérieure suit une politique versionnée, stricte en campagne.
- Un rapport référence les réponses et évaluations utilisées. Une modalité absente reste non mesurée.
- Un quota est réservé atomiquement puis consommé/libéré selon la politique commerciale.
- Un membre d'organisation n'obtient pas automatiquement les données personnelles de tous ses membres.
- Le pays/locale contextualise le contenu ; il n'autorise pas un accès ni ne garantit l'hébergement local.
- Une décision recruteur est une action humaine distincte du résultat IA.

## 7. Données : schéma conceptuel et contraintes

Le diagramme entités-relations décrit les tables centrales, sans prétendre être une migration SQL prête à appliquer. Des tables annexes — notifications, consentements facultatifs, documents et demandes de suppression — sont ajoutées selon le périmètre.

| Entité | Champs importants | Contraintes |
|---|---|---|
| User | id, identity_subject, locale | Identité fournisseur unique ; aucun mot de passe conservé si OIDC |
| Organization | id, type, country_code | Type école/recruteur/partenaire ; paramètres de rétention |
| Membership | user_id, organization_id, role, status | Paire unique ; révocation prise en compte |
| ScenarioVersion | id, scenario_id, version, country_code, locale, rubric_version_id | Version publiée immuable ; grille compatible |
| Session | id, owner_user_id, organization_id nullable, purpose, scenario_version_id, status, revision | Propriété et finalité obligatoires ; référence de version |
| Question | id, session_id, ordinal, text, source | Unicité session/ordinal ; provenance référentiel/IA |
| Answer | id, question_id, client_submission_id, validated_text, duration_ms, status | Identifiant de soumission unique dans la portée autorisée |
| Evaluation | id, answer_id, rubric_version_id, model_id, prompt_version, status, evidence | Une version courante unique par réponse et grille ; provenance requise |
| Report | id, session_id, version, status, generated_at | Référence aux évaluations et liste explicite des mesures disponibles |
| Campaign | id, organization_id, rubric_version_id, status | Grille et règles de participation figées avant invitations |
| Participant | id, campaign_id, user_id, session_id nullable | Session liée au même candidat, à la même organisation et finalité recrutement |
| Review | id, participant_id, reviewer_user_id, rationale, outcome | Relecteur habilité ; motif et date obligatoires |
| ShareGrant | resource_id, grantor_user_id, recipient_user_id/organization_id, scope, expires_at, revoked_at | Destinataire, finalité et portée valides ; révocation effective |
| UsageEntry | principal, operation_id, kind, units, status | Opération unique ; registre des ajustements plutôt que modifications silencieuses |
| PaymentEvent | provider, event_id, status, payload_digest | Paire fournisseur/événement unique |
| AuditEvent | actor, action, resource, timestamp, correlation_id | Accès restreint ; contenu minimal et rétention |

Le cache d'un rapport ne doit pas contourner une révocation. Un média privé utilise une référence d'objet et un contrôle d'accès ; les URL temporaires expirent selon une durée courte documentée. Une session supprimée entraîne les travaux de suppression ou anonymisation applicables.

### Isolation des organisations

Le serveur déduit l'organisation autorisée de l'identité et des memberships valides ; il ne fait pas confiance à un `organization_id` reçu seul. Les requêtes filtrent propriétaire, organisation, finalité et droits de partage.

Une politique PostgreSQL RLS peut renforcer ces vérifications : principal de requête placé par `SET LOCAL` dans une transaction, connexions poolées nettoyées, rôle applicatif non propriétaire et sans privilège de contournement. Les tâches de fond reçoivent un contexte de service limité. Les exports et opérations d'administration utilisent des chemins explicitement contrôlés.

Les relations campagne/participant/session doivent aussi être validées par contraintes ou transactions. Un UUID difficile à deviner ne constitue pas une politique d'accès.

## 8. Flux d'une réponse et traitement asynchrone

1. Le candidat relit sa transcription et valide. Le client crée un identifiant de soumission stable et conserve un brouillon local jusqu'à l'accusé.
2. L'API authentifie, vérifie la session, son état, les permissions et les limites.
3. Une transaction sauvegarde la réponse, réserve la consommation et inscrit le travail dans la queue PostgreSQL.
4. L'API confirme la sauvegarde et un statut en attente. Le client peut consulter l'avancement ; il ne renvoie pas une nouvelle réponse à cause d'un timeout.
5. Le worker revendique le travail, lit scénario/grille/réponses autorisés et appelle l'adaptateur IA avec un budget.
6. La sortie est validée : structure, bornes et extraits présents dans la réponse. Le serveur calcule un score éventuel selon la grille ; un extrait réel ne prouve pas à lui seul la justesse de son interprétation.
7. Résultat, usage et progression sont enregistrés de manière cohérente. Le client affiche le feedback et la question suivante ou la fin.
8. En cas d'échec, le résultat est indisponible ou différé. Une question du référentiel peut permettre de continuer en mode annoncé. Le rapport final indique les limites et ne fabrique aucune note.

Le traitement externe peut être relancé après une panne. La queue et les contraintes empêchent les doublons d'effet dans l'application, mais **un fournisseur peut facturer deux tentatives** si la première a eu un résultat réseau incertain. Enregistrer les tentatives, plafonner les reprises et distinguer coût fournisseur de consommation client.

## 9. Contrats API proposés

| Route | Rôle | Règle essentielle |
|---|---|---|
| `POST /api/v1/sessions` | Créer une session depuis un scénario/version | Serveur fixe propriétaire, finalité, nombre de questions et contexte |
| `GET /api/v1/sessions/{id}` | Lire état, questions et progression autorisés | Pas de fuite entre utilisateurs/organisations |
| `POST /api/v1/sessions/{id}/answers` | Soumettre une réponse validée | Idempotency-Key + identifiant stable ; réponse sauvegardée avant IA |
| `POST /api/v1/sessions/{id}/complete` | Terminer et demander un rapport | État/version vérifiés ; pas de travaux duplicatifs |
| `GET /api/v1/sessions/{id}/report` | Lire rapport et statut | Pending/ready/partial/failed ; portée des résultats expliquée |
| `POST /api/v1/cohorts/{id}/assignments` | Attribuer un exercice | Rôle formateur et cohortes autorisés |
| `POST /api/v1/campaigns` | Créer une campagne | Organisation recruteur, grille approuvée |
| `POST /api/v1/campaigns/{id}/reviews` | Ajouter une revue humaine | Relecteur habilité et justification obligatoire |
| `POST /api/v1/shares` | Accorder un accès limité | Ressource appartenant à l'auteur, portée et expiration |
| `DELETE /api/v1/shares/{id}` | Révoquer | Accès coupé, caches invalidés |
| `POST /api/v1/payments` | Initier un achat | Prix/offre déterminés serveur |
| `POST /api/v1/webhooks/payments/{provider}` | Confirmer/mettre à jour un paiement | Validation fournisseur et déduplication |
| `POST /api/v1/data-requests` | Export/suppression/correction | Identité, finalité et traitement tracés |

`202 Accepted` peut signaler la réponse sauvegardée et l'analyse différée ; `409` un conflit de version/état ; `429` une limite atteinte ; `503` une indisponibilité temporaire. Retour d'erreur avec code stable, message utilisateur et correlation_id ; pas de stack ou secret.

Le contrat contient les schémas détaillés, limites, exemples et permissions. Zod est utilisé côté serveur ; les types du client ne remplacent pas la validation runtime. Sources : [Zod](https://zod.dev/), [OpenAPI](https://www.openapis.org/what-is-openapi).

## 10. Audio, hors ligne et reprise

**Texte** : modalité de référence. Il permet un parcours complet sans dépendance à la transcription.

**Audio** : autorisation choisie, transcription corrigeable, gestion des formats, des interruptions et de la lecture vocale du système. Le compteur de mots et la durée réelle peuvent fournir un débit indicatif. Aucune estimation de personnalité/confidence à partir du volume.

La Web Speech API a un support variable ; certains navigateurs transmettent l'audio à un serveur par défaut. La reconnaissance locale est une capacité à détecter et tester, pas une garantie universelle. Si le navigateur ne permet pas un traitement compatible avec le contrat, proposer texte ou un fournisseur explicitement autorisé. Source : [MDN, SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

**Hors ligne** : ressources et questions préchargées, réponses locales, indication de statut, aucune analyse IA cloud annoncée. Une session hors ligne utilise un plan de questions fixé ; la synchronisation retrouve le même utilisateur et la même finalité, applique les règles/quotas serveur et gère les conflits. Le cache local ne crée pas de droits institutionnels hors connexion.

IndexedDB convient aux données structurées et blobs, mais sa capacité et sa persistance dépendent du navigateur. Prévoir quota, éviction et absence de garantie de stockage permanent. Source : [MDN, IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

Background Sync est une optimisation ultérieure. La reprise doit fonctionner par une action visible au retour du réseau, même sans cette API. Effacer le cache sensible à la déconnexion choisie ; ne pas promettre un chiffrement local sans gérer réellement les clés et l'usage partagé.

## 11. IA et évaluation

Un fournisseur reçoit uniquement le contexte nécessaire et autorisé. L'adaptateur décrit capacités, modèles, budgets et contraintes par pays/finalité. Les prompts séparent consignes du système, scénario publié et contenu du candidat.

La grille définit les critères, exemples de niveaux, poids éventuels et cas non observables. Le modèle produit une appréciation avec preuve ; le serveur contrôle les références et les bornes. Les questions factuelles métier utilisent des contenus relus ; une référence à un CV ne prouve pas que l'expérience déclarée est vraie.

Le catalogue de modèles est configurable ; son changement déclenche des tests sur le corpus et une mise à jour de provenance. Ne pas changer silencieusement un modèle pendant une campagne. Les notes d'anciennes versions ne sont pas automatiquement comparables.

La personnalisation CV/offre n'exige pas une infrastructure RAG au premier pilote : extraire et sélectionner un contexte court, relu/autorisé. Si la bibliothèque devient volumineuse, étudier une recherche documentaire, éventuellement `pgvector` dans PostgreSQL ; l'autorisation et le filtre organisation s'appliquent avant de transmettre un extrait.

L'usage recruteur passe par une évaluation indépendante, revue humaine et règles spécifiques de contestation. La conformité et les restrictions d'âge/fournisseur sont traitées dans l'étude précédente et recontrôlées avant ouverture.

## 12. Déploiement et exploitation

**Développement** : données synthétiques, PostgreSQL de test, fournisseurs simulés et appels IA limités à des exemples autorisés. **Préproduction** : environnement séparé, restauration et charge, identités de test. **Production** : mêmes artefacts versionnés, configuration distincte et accès limités.

Frontend statique servi en HTTPS. Seuls l'API et les callbacks autorisés sont exposés. PostgreSQL et workers sont privés. Identité, IA, stockage, notification et paiement sont des prestataires contractuellement autorisés. Les logs et sauvegardes font partie de la cartographie des transferts.

Au pilote : serveur applicatif dimensionné, base gérée si le contrat le permet, sauvegardes chiffrées et supervision. À l'ouverture : instances API multiples, workers séparés, base à disponibilité adaptée et restauration ponctuelle. La haute disponibilité, le lieu de traitement et les niveaux de service doivent être contractualisés ; un diagramme ne les prouve pas.

Mesurer débit, latences HTTP/IA, erreurs, complétion, travaux en retard, connexions DB, tokens/coût et saturation. Les données de produit et de recherche sont minimisées. Alertes sur perte de sauvegarde, surconsommation, échec de travaux et accès privilegiés.

## 13. Sécurité, risques et pannes

| Risque | Mesure de conception | Vérification |
|---|---|---|
| Accès à une autre organisation | Vérification ressource, filtres et RLS adaptée | Tests croisés et export non autorisé |
| Coût IA abusif | Quotas atomiques, budget, rate limit et concurrence | Requêtes simultanées et limites atteintes |
| Réponse manipulant l'IA | Instructions séparées, validation et corpus adversarial | Grille conservée face aux injections |
| Réponse perdue | Transaction avant IA, local outbox et idempotence | Coupure après commit et avant accusé |
| Double crédit paiement | Événement unique et rapprochement serveur | Callbacks répétés, hors ordre et timeout |
| Fuite dans logs/stockage | Logs minimaux, bucket privé et URLs courtes | Revue de contenu, permissions et expiration |
| Mauvais retour/score | Corpus humain, provenance et statut non mesuré | Répétabilité, extraits et contre-exemples |
| Fuite appareil partagé | Identité cohérente, déconnexion et purge locale | Changement de compte sans transmission des brouillons précédents |
| Panne fournisseur | Deadline, retries bornés et fonctionnement dégradé | Analyse différée sans note fictive |
| Panne/erreur DB | Sauvegarde, restauration et migrations revues | RPO/RTO et suppression réappliquée |

Les attaques d'injection ne sont pas résolues par un unique prompt. Le système doit limiter les effets possibles du modèle et tester les frontières de données/droits.

## 14. Qualité et stratégie de tests

- Tests unitaires des règles : finalité, progression, calcul selon grille, permission et registre d'usage.
- Tests d'intégration avec PostgreSQL réel de test : transactions, RLS, contraintes, queue et déduplication.
- Tests de contrat : schémas client/API, réponses IA invalides et callbacks fournisseur.
- Tests Playwright : texte complet, refus micro/caméra, reprise, déconnexion et accès des rôles.
- Tests de charge : débuts simultanés de cohortes, fournisseur lent, workers arrêtés et DB sollicitée.
- Tests d'évaluation IA : corpus versionné, double relecture, comparaison de versions et erreurs non masquées.
- Tests de restauration et retour arrière : données, droits et demandes de suppression cohérents.

Playwright fournit une infrastructure de tests navigateurs ; son usage n'a pas été exécuté sur cette architecture cible. Source : [documentation Playwright](https://playwright.dev/docs/test-intro).

Les objectifs de réception détaillés du [cahier révisé](../CAHIER_DES_CHARGES_REVISE.md) sont repris dans le plan d'étude. Les rapports de recette indiquent versions, appareils, conditions réseau, taille du corpus et limites.

## 15. Migration depuis le prototype

1. Conserver une référence intacte de l'archive et un environnement de build reproductible.
2. Retirer les faux résultats et corriger le parcours avant d'ajouter de nouvelles fonctions.
3. Extraire les contrats et modules ; ajouter identité, base, sessions et migrations.
4. Transformer `/respond` et `/generate-report` en opérations persistantes/idempotentes avec travaux différés.
5. Introduire l'adaptateur IA et la version des grilles ; conserver les fonctionnalités utiles de l'interface.
6. Ajouter reprise locale, parcours texte et droits établissements.
7. Valider paiements et recrutement dans des lots dédiés.
8. Préparer les profils Mali/Niger après stabilité et preuves Burkina.

La migration de l'historique local est une opération choisie : validation du format et du propriétaire, exclusion des données de démonstration et provenance « import prototype non validé ». Ne pas convertir ces anciennes notes en résultats certifiés.
