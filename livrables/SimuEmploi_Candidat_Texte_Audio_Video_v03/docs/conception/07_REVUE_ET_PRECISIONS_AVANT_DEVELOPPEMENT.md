# SimuEmploi — avis de revue et précisions avant développement

**20 novembre 2026. Revue documentaire de l'architecture jointe par le porteur.** La stack Python a déjà été adoptée. Cette revue évalue sa cohérence et ses points restant à spécifier ; elle ne constitue pas une recette de production.

## 1. Verdict et portée

**Acceptable comme architecture de référence pour commencer le développement du socle.** React/TypeScript, FastAPI/Pydantic, PostgreSQL, SQLAlchemy/Alembic et Celery/RabbitMQ avec outbox forment un ensemble cohérent pour les usages prévus. Le monolithe modulaire et la séparation API/worker sont appropriés à ce stade.

Le document définit les composants, responsabilités, finalités et grands invariants. Il reste à fixer les contrats détaillés, règles de reprise, versions et conditions d'exploitation. Une stack choisie et des diagrammes syntaxiquement valides ne démontrent ni capacité nationale, ni disponibilité, ni qualité pédagogique.

La démarche recommandée est de stabiliser la stack et de compléter les spécifications au fil des premiers lots. Les précisions ci-dessous se ferment avant la livraison du module concerné. Elles n'exigent pas d'attendre que tous les modules futurs soient conçus avant de commencer le socle.

## 2. Éléments à conserver

- Sauvegarde de la réponse avant tout appel IA.
- Texte comme parcours de référence, audio facultatif et reprise explicite.
- Séparation du coaching privé, des exercices d'établissement et des campagnes recruteur.
- Permissions et quotas côté serveur ; PostgreSQL comme source de vérité.
- Scénarios, grilles, prompts et modèles versionnés ; erreurs annoncées et revue humaine.
- API et workers séparés, domaine métier commun, fournisseur derrière un adaptateur.
- Extension Burkina puis Mali/Niger, avec vérification par pays.

Celery/RabbitMQ ajoute un broker à exploiter. Ce choix reste valable, mais doit être budgété et surveillé. Kubernetes, des microservices par module et un modèle IA local n'apportent pas de bénéfice démontré au premier lot.

## 3. Précisions à fermer par lot

| Réf. | Moment de fermeture | Précision nécessaire | Preuve attendue |
|---|---|---|---|
| R01 | Avant réalisation du premier parcours | Délimiter le lot texte candidat ; espaces institutionnels ultérieurs | Backlog court avec critères de réception et fonctions différées |
| R02 | Avant fixation de l'environnement | Versions, drivers, sessions SQLAlchemy et exécution Linux | Environnement verrouillé ; migration et parcours exécutés dans les images retenues |
| R03 | Avant intégration de l'identité | Fournisseur OIDC, identité interne et politiques de session | Contrat fournisseur ; tests de connexion, expiration, révocation et accès croisés |
| R04 | Avant livraison des routes de simulation | Schémas API, idempotence, révisions et droits | OpenAPI versionné ; tests de doublon, conflit, correction et fin concurrente |
| R05 | Avant livraison de l'analyse différée | Routage, acquittements, reprise, résultat tardif et consommation | Essais de panne dispatcher/broker/worker et rapprochement du registre d'usage |
| R06 | Avant essai sur des données personnelles | Rétention locale/serveur, suppression et reprise sous la même identité | Matrice des données ; tests appareil partagé, suppression pendant analyse et restauration |
| R07 | Avant pilote exposé puis ouverture nationale | Hébergement, budget, supervision, charge et restauration | Responsables nommés ; rapport de charge/restauration et alertes vérifiées |
| R08 | Avant usage pédagogique puis recruteur | Grilles locales, erreurs IA et portée du rapport | Corpus relu, retours compris et qualité mesurée ; validation recruteur distincte |

## 4. R01 — Premier lot suffisamment petit

Construire d'abord le parcours texte : compte, scénario local relu, session, réponse persistée, analyse durable, rapport et reprise. Les partenaires peuvent participer à la recherche et au pilote candidat ; leur espace métier reste une extension.

Le porteur a précisé une construction neuve, candidats en premier et cinq développeurs. Les usages individuels, établissements et recruteurs restent dans la cible ; les espaces institutionnels, campagnes, paiements, CV et audio avancé ont des lots/recettes ultérieurs. Le [dossier candidat](../candidat/README.md) prime pour le premier lot.

## 5. R02 et R03 — Environnement et identité

Fixer les versions de Python, PostgreSQL, FastAPI/Pydantic, SQLAlchemy/Alembic, Celery/Kombu et RabbitMQ après un essai de compatibilité. Consigner drivers et images ; verrouiller les dépendances. La documentation courante peut contenir des exemples de plusieurs versions : leur présence ne prouve pas leur compatibilité ensemble.

Le modèle d'exécution SQLAlchemy doit être explicite : session propre à une requête/tâche, moteur/pool initialisé dans le processus approprié, aucun objet session partagé avec un worker forké. Une API async et un worker synchrone peuvent coexister avec des adaptateurs adaptés ; la configuration choisie doit être testée.

**Workers Linux.** Sur le poste Windows, utiliser des conteneurs Linux via Docker/WSL2 et les éprouver en CI. Celery ne prend pas officiellement en charge Windows. Source : [FAQ Celery](https://docs.celeryq.dev/en/stable/faq.html#does-celery-support-windows).

Choisir le fournisseur OIDC avec coûts, récupération de compte, MFA des administrateurs, lieux de traitement et contrat. L'identité externe est la paire `iss`/`sub`, liée à un UUID interne ; l'email ne fusionne pas automatiquement des comptes. Définir le flux de connexion, validation des jetons, état/nonce, protection du callback, durée des sessions, révocation et CSRF pour les cookies. Source : [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html#ClaimStability).

## 6. R04 — Contrats et cohérence des résultats

Le tableau des routes doit devenir un contrat avec payloads, limites de taille, pagination, codes d'erreur et permissions. Une clé d'idempotence est associée à une portée autorisée et à une empreinte de la demande. Même clé/même contenu : réponse existante ; même clé/contenu différent : conflit. Documenter la rétention de ces clés et vérifier les soumissions concurrentes.

Définir les versions d'entrée : réponse validée pour une évaluation, ensemble de réponses/évaluations figé pour un rapport. Une correction n'écrase pas silencieusement les données d'un résultat déjà publié. Un travail tardif publie un résultat seulement si son entrée et son autorisation restent valides ; la fin de session peut autoriser un rapport en attente selon la règle définie.

Le champ de révision doit correspondre à la ressource analysée. Une nouvelle réponse à une autre question ne rend pas automatiquement invalide une évaluation encore pertinente de la réponse précédente. Pour un rapport, enregistrer explicitement le snapshot des évaluations utilisées.

## 7. R05 — Travaux, outbox et consommation

**Deux corrections de formulation sont nécessaires :** la queue n'empêche pas à elle seule les doublons métier ; une confirmation de publication n'est pas une confirmation de traitement.

Les états métier des travaux doivent couvrir attente, exécution, attente de reprise, succès, échec final et annulation. L'outbox conserve l'intention de transport ; PostgreSQL conserve l'état et l'identifiant de l'opération. Le message contient surtout des identifiants et une version de contrat, avec sérialisation JSON contrôlée.

Le dispatcher traite les événements par lots avec revendication courte. Il vérifie la confirmation **et le routage vers la queue attendue** avant de marquer l'événement publié. Un message non routable peut être confirmé par RabbitMQ : prévoir une détection de retour/erreur avec le client utilisé. Les queues durables, messages persistants et paramètres de réplication sont qualifiés selon la disponibilité visée. Source : [RabbitMQ, confirmations et routage](https://www.rabbitmq.com/docs/confirms).

La revendication du worker utilise une échéance et un jeton. Le commit du résultat vérifie atomiquement le jeton courant, l'état du travail et la validité des entrées. Si un travail a été repris par un autre worker, l'ancien ne peut pas écraser son résultat. Un mécanisme de réconciliation détecte travaux bloqués, événements publiés sans progression et opérations annulées.

Configurer et tester acquittements, disparition d'un worker, timeouts, backoff, nombre maximal de tentatives et traitement des erreurs permanentes. `acks_late` demande des tâches idempotentes et ne résout pas tous les cas de perte d'un processus. La reprise doit aussi être pilotée par l'état métier. Source : [Celery, tâches et acquittements](https://docs.celeryq.dev/en/stable/userguide/tasks.html).

La réservation client et le coût fournisseur sont deux registres liés mais distincts. Définir consommation, libération et ajustement en cas d'échec/annulation. Une reprise ne réserve pas une deuxième unité pour la même opération. Fixer des budgets par utilisateur, organisation et plateforme, ainsi que des plafonds de concurrence qui restent communs à plusieurs workers.

Un timeout fournisseur peut laisser un coût incertain. L'idempotence locale ne garantit pas un seul appel facturé ; tracer les tentatives et rapprocher les coûts sans les transformer automatiquement en deuxième consommation client.

## 8. R06 — Reprise locale et cycle des données

Le cache Service Worker conserve les ressources publiques ; les réponses privées de l'API ne sont pas mises en cache globalement. Les brouillons IndexedDB sont rattachés au compte, à la session et à la finalité, avec politique d'expiration et nettoyage explicite.

Un brouillon hors ligne reste « en attente de synchronisation ». Sa sauvegarde serveur peut être refusée après expiration, fermeture de campagne ou révocation. Le produit doit rendre ce conflit compréhensible sans transférer le brouillon à un autre compte.

Une suppression invalide les travaux concernés. Le worker recontrôle l'autorisation des données avant l'appel externe puis avant publication du résultat. Si une suppression arrive pendant un appel, elle ne peut pas annuler rétroactivement l'envoi déjà réalisé ; traiter les obligations applicables avec le fournisseur et empêcher la réapparition du résultat.

La politique précise réponses, rapports, médias, logs, outbox et sauvegardes. Une restauration réapplique les demandes de suppression et réconcilie les travaux avant les nouvelles analyses. Le profil pays contextualise le produit ; il ne certifie pas le lieu de chaque traitement.

## 9. R07 et R08 — Pilote et preuve d'ouverture

Le développement peut employer Docker Compose et des données synthétiques. Pour le pilote, définir qui exploite API, base, broker, sauvegardes et fournisseur IA, et le budget correspondant. Un hôte partagé est une possibilité de pilote avec une panne commune explicitement acceptée ; il ne prouve pas la haute disponibilité.

Les seuils du [cahier révisé](../CAHIER_DES_CHARGES_REVISE.md) restent des cibles de réception. Mesurer une charge définie : sessions actives, cadence des réponses, appels IA simultanés, taille des textes et temps d'attente de queue. Le temps de rapport inclut attente + analyse + enregistrement. Une capacité de 200 sessions ne signifie pas 200 appels IA simultanés.

Tester restauration et migrations avant ouverture ; des copies de sauvegarde présentes ne prouvent pas qu'elles se restaurent. Un déploiement conserve la compatibilité API/worker/messages pendant la transition, ou suspend proprement les travaux. Les règles d'accès et de suppression sont vérifiées après reprise.

La qualité du coaching est évaluée sur contenus burkinabè relus et réponses autorisées. Mesurer conseils utiles, commentaires non fondés, coût et répétabilité. La pertinence d'une note pour le recrutement exige une validation propre au poste et une revue humaine ; un résultat pédagogique ne suffit pas à la certifier.

## 10. Décision de passage

**Commencer le socle Python est justifié dès maintenant.** Fermer R01/R02 pour le premier parcours, puis R03 à R06 pendant ses lots. Autoriser le pilote après recette technique, cadre des données et qualité pédagogique nécessaires à son périmètre. Ouvrir à l'échelle nationale après mesures de coût, capacité, restauration et support. L'extension AES suit une réception par pays.

Cette revue ajoute des précisions à l'[architecture de référence](02_ARCHITECTURE_ET_TECHNOLOGIES.md). Aucun backend de production, benchmark, test de panne ou contrat fournisseur n'a été réalisé pour produire cet avis.
