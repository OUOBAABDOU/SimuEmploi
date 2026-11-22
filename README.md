# SimuEmploi — réétude Burkina Faso / AES

Ce dossier réunit le code de l'archive fournie et la réétude de son cahier des charges. Les choix de marché retenus sont ceux précisés par le porteur : **Burkina Faso d'abord, puis Mali et Niger**, pour le coaching individuel, l'accompagnement par les établissements et l'aide à l'évaluation des candidats.

**Orientation actuelle : construction neuve, candidats en premier et cinq développeurs full stack.** Modules métier séparés, puis extraction progressive en microservices selon les besoins. Le [dossier candidat](docs/candidat/README.md) contient les maquettes proposées, les contrats et la répartition détaillée des sprints. Les espaces établissement/recruteur sont des extensions. L'archive originale et son audit restent des références historiques.

**Développement commencé le 21 novembre 2026 :** la [nouvelle application candidat](application/README.md) contient un frontend React/TypeScript et une API Python/FastAPI écrits à neuf, avec découverte, catalogue d’exemples et préparation d’entretien. Le [suivi S0](application/docs/sprints/S0-demarrage.md) précise la première tranche de S1 et les validations restantes. Premier usage confirmé : premier emploi ou stage au Burkina Faso ; OUOBA Abdou Rasmané porte produit, relecture métier et coordination.

**Consigne du 22 novembre : terminer S0 avant de poursuivre les autres sprints.** Le [dossier de clôture S0-0.4 / API-0.1](application/docs/sprints/S0-cloture/README.md) rassemble la référence corrigée et les preuves à recueillir. AgentRouter est le premier candidat à qualifier pour le texte ; une première boucle de trois essais candidats est prévue le 22 novembre 2026. Les appels IA restent inactifs et aucun résultat réel de séance n’a encore été reçu.

**Relectures reçues le 22 novembre :** OUOBA Abdou Rasmané approuve les trois banques de questions version 3 et la référence de conception S0. Les estimations et périmètres de l’équipe, les essais candidats et la réception finale restent à confirmer.

**Confirmation reçue ensuite :** les cinq périmètres et le backlog estimé sont acceptés sans ajustement demandé par le coordinateur. Le travail restant de clôture porte sur les essais candidats, leurs éventuelles corrections et la réception finale.

- [Dossier d'idée et de conception](docs/conception/README.md) : viabilité, problème, technologies, architecture Python retenue, 16 diagrammes et méthode de validation.
- [Backend Python retenu](docs/conception/06_OPTION_BACKEND_PYTHON.md) : FastAPI/Pydantic, PostgreSQL, SQLAlchemy/Alembic, Celery/RabbitMQ avec outbox et migration à réaliser.
- [Avis sur l'architecture](docs/conception/07_REVUE_ET_PRECISIONS_AVANT_DEVELOPPEMENT.md) : base acceptable pour commencer le socle, précisions et essais requis par lot avant pilote et ouverture nationale.
- [Étude de recadrage et audit](docs/ETUDE_SIMUEMPLOI_BURKINA_AES.md) : diagnostic vérifié, décisions produit, architecture, cadre local, modèle économique et déploiement.
- [Cahier des charges révisé](docs/CAHIER_DES_CHARGES_REVISE.md) : périmètre, règles d'accès, exigences mesurables et critères de réception.
- [Vérifications techniques](docs/VERIFICATIONS_TECHNIQUES.md) : méthode, résultats et limites de l'audit.
- [Cahier des charges initial](references/CAHIER_DES_CHARGES_INITIAL.txt) : copie du texte fourni, conservé comme référence.
- `projet-source/` : fichiers extraits de l'archive. Le code applicatif n'a pas été corrigé dans cette mission de réétude.
- `outils/diagnostic-source.cjs` : diagnostic reproductible de quelques calculs du prototype.

Le porteur a adopté la stack Python du dossier joint le **20 novembre 2026** ; l'ADR-11 consigne cette décision. La conception est alignée, tandis que la migration applicative et les POC restent à réaliser. Les fonctionnalités et tarifs du texte initial demeurent des éléments à examiner. L'étude distingue les faits constatés, les décisions du porteur et les hypothèses à tester sur le terrain.
