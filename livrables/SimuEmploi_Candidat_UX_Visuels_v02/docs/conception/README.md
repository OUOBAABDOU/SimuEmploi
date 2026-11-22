# SimuEmploi — dossier d'idée et de conception

**20 novembre 2026 — Burkina Faso, puis Mali et Niger.**

Ce dossier complète l'audit existant en revenant à l'idée : quel problème traiter, pour qui, avec quelle valeur, comment vérifier la viabilité et quelle architecture développer. Il décrit une **cible proposée**, sans annoncer une validation commerciale ou une architecture déjà mise en œuvre.

## Ordre de lecture

1. [Viabilité, problème et proposition de valeur](01_VIABILITE_ET_PROBLEME.md).
2. [Architecture et technologies recommandées](02_ARCHITECTURE_ET_TECHNOLOGIES.md).
3. [Diagrammes de conception](03_DIAGRAMMES.md) — contexte, fonctions, composants, données, séquences, états et déploiement.
4. [Méthode de réétude et plan de validation](04_PLAN_ETUDE_ET_VALIDATION.md).
5. [Décisions d'architecture et alternatives](05_DECISIONS_ARCHITECTURE.md).
6. [Backend Python retenu : FastAPI, stack et migration](06_OPTION_BACKEND_PYTHON.md).
7. [Avis de revue et précisions avant développement](07_REVUE_ET_PRECISIONS_AVANT_DEVELOPPEMENT.md).

Les fichiers `.mmd` dans `diagrammes/` sont les sources Mermaid modifiables. Deux vues de synthèse sont aussi disponibles en SVG/PNG dans `visuels/`. Les représentations synthétiques ne remplacent pas les règles détaillées du modèle de données.

**Stack adoptée par le porteur : React/TypeScript, FastAPI/Pydantic, PostgreSQL, SQLAlchemy/Alembic et Celery/RabbitMQ avec outbox.** Le catalogue comprend 16 diagrammes alignés sur cette architecture. L'ADR-11 consigne la décision ; l'implémentation et sa qualification restent à réaliser. Les comparaisons avec Node et Django expliquent les alternatives examinées.

## Position de départ

La faisabilité technique de l'entraînement est favorable. Le besoin local est plausible et doit être étudié auprès des utilisateurs ; la volonté de payer, la qualité réelle des retours et les débouchés commerciaux restent à démontrer. L'usage recruteur nécessite une validation et une gouvernance supplémentaires.

Le porteur a précisé une construction neuve, candidats en premier et cinq développeurs full stack. Le [dossier candidat](../candidat/README.md) détaille les maquettes, sprints et contrats. Les partenaires peuvent aider à la recherche et au pilote sans espace institutionnel initial. Les trois usages restent dans la cible ; établissements et recruteurs sont des extensions avec données et permissions distinctes.

## Liens avec le travail précédent

- [Audit et étude Burkina/AES](../ETUDE_SIMUEMPLOI_BURKINA_AES.md).
- [Cahier des charges révisé](../CAHIER_DES_CHARGES_REVISE.md).
- [Vérifications du prototype](../VERIFICATIONS_TECHNIQUES.md).

Les sources officielles et documentations sont liées à proximité des affirmations qu'elles étayent. Les objectifs de pilote, budgets d'exemple et seuils de décision sont explicitement présentés comme hypothèses.
