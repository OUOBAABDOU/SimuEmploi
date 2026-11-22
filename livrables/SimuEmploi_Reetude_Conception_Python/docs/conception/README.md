# SimuEmploi — dossier d'idée et de conception

**20 novembre 2026 — Burkina Faso, puis Mali et Niger.**

Ce dossier complète l'audit existant en revenant à l'idée : quel problème traiter, pour qui, avec quelle valeur, comment vérifier la viabilité et quelle architecture développer. Il décrit une **cible proposée**, sans annoncer une validation commerciale ou une architecture déjà mise en œuvre.

## Ordre de lecture

1. [Viabilité, problème et proposition de valeur](01_VIABILITE_ET_PROBLEME.md).
2. [Architecture et technologies recommandées](02_ARCHITECTURE_ET_TECHNOLOGIES.md).
3. [Diagrammes de conception](03_DIAGRAMMES.md) — contexte, fonctions, composants, données, séquences, états et déploiement.
4. [Méthode de réétude et plan de validation](04_PLAN_ETUDE_ET_VALIDATION.md).
5. [Décisions d'architecture et alternatives](05_DECISIONS_ARCHITECTURE.md).
6. [Option backend Python : FastAPI, Django et migration](06_OPTION_BACKEND_PYTHON.md).

Les fichiers `.mmd` dans `diagrammes/` sont les sources Mermaid modifiables. Deux vues de synthèse sont aussi disponibles en SVG/PNG dans `visuels/`. Les représentations synthétiques ne remplacent pas les règles détaillées du modèle de données.

Le catalogue comprend les 14 vues initiales et deux vues de variante Python. La proposition Node est conservée comme référence comparative ; l'option Python n'est pas une migration déjà réalisée ni une décision finale de framework.

## Position de départ

La faisabilité technique de l'entraînement est favorable. Le besoin local est plausible et doit être étudié auprès des utilisateurs ; la volonté de payer, la qualité réelle des retours et les débouchés commerciaux restent à démontrer. L'usage recruteur nécessite une validation et une gouvernance supplémentaires.

Le démarrage recommandé est un pilote de préparation individuelle distribué avec des établissements et acteurs d'insertion. Les trois usages restent dans le produit cible, avec des données et permissions distinctes. L'aide au recrutement est d'abord testée en parallèle des pratiques existantes, avant d'influencer une sélection réelle.

## Liens avec le travail précédent

- [Audit et étude Burkina/AES](../ETUDE_SIMUEMPLOI_BURKINA_AES.md).
- [Cahier des charges révisé](../CAHIER_DES_CHARGES_REVISE.md).
- [Vérifications du prototype](../VERIFICATIONS_TECHNIQUES.md).

Les sources officielles et documentations sont liées à proximité des affirmations qu'elles étayent. Les objectifs de pilote, budgets d'exemple et seuils de décision sont explicitement présentés comme hypothèses.
