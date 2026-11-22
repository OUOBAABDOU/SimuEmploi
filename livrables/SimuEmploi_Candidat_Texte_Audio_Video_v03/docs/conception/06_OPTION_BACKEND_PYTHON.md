# SimuEmploi — backend Python retenu

**20 novembre 2026. Choix adopté par le porteur ; construction neuve à réaliser.** Le porteur a confirmé l'utilisation de ce dossier Python. FastAPI/Pydantic, PostgreSQL, SQLAlchemy/Alembic, Celery/RabbitMQ et l'outbox deviennent la stack backend de référence. React/TypeScript reste le frontend. Les versions et les objectifs de performance seront qualifiés par POC.

**Actualisation ADR-12 :** le produit sera construit à neuf, candidats en premier, par cinq développeurs full stack. Les comparaisons de technologies ci-dessous expliquent l'historique des choix ; elles ne prescrivent pas la reprise du code. Le [dossier candidat](../candidat/README.md) définit les maquettes, sprints et contrats du premier produit.

## 1. Décision retenue

**SimuEmploi utilisera Python avec FastAPI, PostgreSQL, SQLAlchemy/Alembic et des workers Celery/RabbitMQ, avec React/TypeScript pour le frontend.** L'[architecture générale](02_ARCHITECTURE_ET_TECHNOLOGIES.md) et les diagrammes sont alignés sur ce choix.

La proposition Node précédente privilégiait la réutilisation du serveur de l'archive et un langage partagé. Python a été retenu pour la trajectoire du produit et sa proximité avec l'écosystème d'analyse de documents, audio, données et évaluation de modèles. La comparaison ci-dessous explique ce choix et reste utile pour un éventuel réexamen.

Une application qui appelle seulement une API Gemini n'obtient pas automatiquement de meilleurs résultats en passant à Python. La qualité du coaching dépend des grilles, du contexte, de la validation et des tests ; la fiabilité dépend des transactions, permissions, files, délais et opérations.

Python constitue le backend métier cible. Node reste un outil de build du frontend React.

## 2. Python et Node : comparaison pour ce projet

| Critère | Python | Node / TypeScript |
|---|---|---|
| Reprise du serveur actuel | Réécriture des routes et intégrations | Réutilisation directe plus simple |
| Appels à des API IA | SDK/HTTP possibles | SDK/HTTP possibles ; aucun avantage automatique de qualité |
| Analyse locale audio/document/données | Écosystème adapté et intégration facilitée | Possible ; services spécialisés si nécessaire |
| Développement du frontend React | Contrat HTTP entre deux langages | Types partageables, avec validation runtime nécessaire |
| Traitements HTTP concurrents | Async possible avec bibliothèques adaptées | Async adapté également |
| Travail CPU lourd | Processus/workers spécialisés et bibliothèques optimisées | Workers/processus spécialisés également |
| Administration prête à l'emploi | Atout de Django ; FastAPI demande plus d'assemblage | Nécessite une solution d'administration dédiée |
| Fiabilité nationale | Dépend de l'architecture et de l'exploitation | Dépend des mêmes exigences |

Python n'a pas besoin d'exécuter tous les calculs dans une requête HTTP. Une extraction de document, une transcription ou un traitement CPU important doit être isolé dans un worker. `async` aide principalement pour les attentes réseau/IO ; il ne rend pas un calcul lourd instantané. Source : [FastAPI, concurrence et parallélisme](https://fastapi.tiangolo.com/async/).

## 3. FastAPI ou Django ?

| Option | Atouts pour SimuEmploi | Effort supplémentaire |
|---|---|---|
| **FastAPI** | API dédiée au frontend React, validation Pydantic, contrat OpenAPI, interfaces IA et endpoints async | Ajouter identité, droits métier, ORM/migrations, administration et tâches durables |
| **Django + Django REST Framework** | ORM/migrations, administration et fonctions de gestion intégrées ; API et politiques de permissions | Adapter le domaine, les workflows IA et les traitements longs ; tester les composants async/sync choisis |
| Flask | API légère, liberté d'assemblage | Davantage de conventions à construire pour les contrats, permissions et grandes fonctions métier |

**Choix adopté : FastAPI**, car le frontend React existe et l'API de simulation constitue le centre du parcours. Django/DRF est conservé comme alternative de réexamen si un back-office complexe devient prioritaire ; la stack actuelle utilise FastAPI.

Ne pas lancer FastAPI et Django simultanément sans besoin précis : deux frameworks métier augmenteraient l'intégration et l'exploitation. Sources : [FastAPI](https://fastapi.tiangolo.com/), [Django](https://docs.djangoproject.com/en/stable/), [Django REST Framework](https://www.django-rest-framework.org/).

## 4. Stack Python retenue

| Besoin | Choix | Rôle |
|---|---|---|
| Langage | Python maintenu, version figée après POC | Compatibilité SDK, drivers et bibliothèques ; aucun changement de version silencieux |
| API | FastAPI + Uvicorn | HTTP/ASGI, endpoints et cycle de vie |
| Contrats | Pydantic + OpenAPI | Validation des entrées, résultats IA et schéma public |
| Base | PostgreSQL | Réponses, organisations, rapports, usage, paiements et outbox |
| ORM | SQLAlchemy avec driver PostgreSQL compatible | Transactions et requêtes ; sessions propres à chaque tâche/requête |
| Migrations | Alembic | Modifications de schéma versionnées et revues |
| Travaux longs | Celery + RabbitMQ | Transport de travaux et workers distincts de l'API |
| Statut des travaux | PostgreSQL | Source de vérité métier, indépendamment du broker |
| Échange base/broker | Outbox transactionnelle + dispatcher | Ne pas perdre un travail entre commit DB et publication |
| IA | SDK Python Gemini ou client HTTP sous adaptateur | Modèle, validation, budget, retries et provenance |
| Identité | Même principe OIDC/session serveur | Authentification externe ; autorisation propre au produit |
| Tests | pytest + HTTPX ; Playwright côté interface | Règles, contrats, intégration et parcours |
| Qualité du code | Ruff + contrôle de types mypy ou Pyright | Format, analyse et contrats typés |
| Dépendances | uv et lock versionné | Environnement Python reproductible |
| Livraison | Docker et CI | Images séparées API/worker, versions et configuration |

Les bibliothèques citées ne sont pas installées pour constituer un backend opérationnel dans cette mission. Le POC doit vérifier leurs versions compatibles et les drivers choisis.

Pydantic valide des structures ; il ne prouve pas la pertinence du jugement IA. SQLAlchemy fournit une gestion des sessions/transactions, mais une même session async ne doit pas être partagée librement entre tâches concurrentes. Sources : [Pydantic](https://docs.pydantic.dev/latest/), [SQLAlchemy asyncio](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html), [Alembic](https://alembic.sqlalchemy.org/en/latest/).

uv fournit la gestion de projet et le verrouillage des dépendances ; pytest/Ruff/typage complètent le contrôle, sans remplacer les recettes métier. Source : [uv](https://docs.astral.sh/uv/).

## 5. Choix de la file de travaux

Le couple **Celery/RabbitMQ** est retenu pour les travaux longs. Il introduit un broker à exploiter en plus de PostgreSQL. Dimensionnement, reprise, confirmation de publication, durabilité des messages et politique de redélivrance doivent être configurés et vérifiés. Celery ne garantit pas à lui seul qu'un paiement ou appel fournisseur ne se répète jamais. Source : [introduction Celery](https://docs.celeryq.dev/en/stable/getting-started/introduction.html).

**Alternative documentée, non retenue dans la stack actuelle : Procrastinate sur PostgreSQL**, pour conserver moins de systèmes. Son intégration de transactions et connexions avec SQLAlchemy devrait être vérifiée si un réexamen devient nécessaire ; la proximité avec la base ne signifie pas automatiquement que deux bibliothèques partagent la même transaction. Source : [Procrastinate](https://procrastinate.readthedocs.io/en/stable/).

Les diagrammes représentent Celery/RabbitMQ avec outbox. Le POC vérifie ce transport et ses garanties configurées. Un changement de queue exige une décision ADR explicite et la mise à jour des diagrammes, en conservant persistance, idempotence et statut métier.

Les `BackgroundTasks` de FastAPI peuvent servir à de petites actions après une réponse HTTP. Ils ne doivent pas constituer l'unique mécanisme de génération d'un rapport important qui doit survivre à un redémarrage. La documentation recommande d'envisager des outils dédiés comme Celery pour certains traitements plus lourds. Source : [FastAPI, tâches de fond](https://fastapi.tiangolo.com/tutorial/background-tasks/).

## 6. Flux fiable avec outbox

1. Le candidat valide un texte relu avec un identifiant de soumission stable.
2. FastAPI contrôle identité, permissions, état et quotas.
3. **Une seule transaction PostgreSQL** sauvegarde réponse, réservation d'usage, statut du travail et événement outbox.
4. Le client reçoit un accusé de sauvegarde. Le travail peut encore être en attente.
5. Un dispatcher lit l'outbox et publie au broker avec confirmation. Il marque l'événement livré après confirmation.
6. Une panne entre publication et marquage peut republier l'événement : le worker applique l'idempotence métier et les contraintes DB.
7. Le worker lit le contexte autorisé, exécute l'analyse, valide la sortie et enregistre résultat/statut/usage.
8. En cas d'erreur, le rapport reste différé ou indisponible ; les réponses sont conservées.

Les états du rapport et les règles de données existants restent valables. Un appel IA au résultat réseau incertain peut avoir été facturé ; chaque tentative doit être tracée et plafonnée. L'idempotence du résultat applicatif ne rend pas automatiquement l'effet externe unique.

## 7. Structure de code proposée

```text
frontend/                  React, TypeScript et tests navigateur
backend/
  pyproject.toml
  uv.lock
  app/
    main.py                bootstrap FastAPI
    api/                   routes et contrats publics
    core/                  configuration, identité et contrôles
    modules/
      simulations/
      evaluations/
      organizations/
      cohorts/
      recruitment/
      billing/
      data_rights/
    integrations/          IA, OIDC, stockage et paiement
    database/              modèles, dépôts et transactions
    workers/               Celery, dispatcher et tâches
  migrations/              Alembic
  tests/                   règles, contrats, DB et pannes
docs/                      architecture, corpus et procédures
```

Les contrats TypeScript ne sont plus partagés directement avec le serveur. Le schéma OpenAPI produit par l'API est versionné, comparé en CI et peut générer un client TypeScript. Pydantic contrôle les données reçues ; le frontend conserve ses propres vérifications d'usage.

## 8. Construction neuve et comparaison des technologies

| Élément du prototype ou de la proposition Node | Migration prévue vers le backend Python |
|---|---|
| React, styles et composants du prototype | Frontend neuf selon les maquettes candidat ; anciens composants non repris |
| Routes Express et prompts du prototype | API et adaptateur Python neufs, fondés sur les contrats métier reçus |
| SDK Gemini JavaScript | Remplacé par adaptateur Python/HTTP, avec tests de sortie et de coût |
| Zod côté serveur | Remplacé par Pydantic ; Zod éventuel côté client seulement si utile |
| Prisma de la proposition précédente | Remplacé par SQLAlchemy/Alembic |
| pg-boss de la proposition précédente | Remplacé par Celery/RabbitMQ avec outbox |
| Architecture et modèle métier | Conservés : droits, finalités, grilles, transactions et idempotence |
| Historique local de démonstration | N'est pas converti en évaluation validée |

Le coût de migration est réel, mais l'archive possède un serveur limité sans plateforme comptes/DB déjà construite. Le choix est désormais fixé avant de développer le socle de production. L'ordre de réalisation est : contrat du parcours texte, base et migrations, contrôles d'accès, outbox/worker, intégration IA, puis connexion de React et recette de reprise.

## 9. POC de qualification de la stack retenue

Construire un exercice texte : création de session, réponse persistée, travail durable, résultat IA validé, rapport et reprise. Tester arrêt de l'API/worker, publication répétée, quota concurrent et accès à une autre organisation. Mesurer effort, temps de réponse, coût et lisibilité.

Vérifier le client React sur le contrat Python. Aucun avantage de performance, qualité IA ou rentabilité n'est annoncé avant cette mesure.

**Décision actée : Python/FastAPI, PostgreSQL, SQLAlchemy/Alembic et Celery/RabbitMQ avec outbox.** Le POC doit vérifier les versions, drivers, contrats, reprise, coût et capacité ; le choix du langage et du framework a été confirmé par le porteur. Voir l'ADR-11.
