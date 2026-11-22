# Vérification du dossier de conception

**20 novembre 2026.**

- Six documents principaux et un index : idée/viabilité, architecture/technologies, catalogue de diagrammes, méthode de validation, onze décisions ADR et option backend Python.
- **16 sources Mermaid validées par le parseur Mermaid 11.17.2**, avec un DOM de contrôle jsdom 26.1.0. Résultat : 16 valides, aucune erreur de syntaxe. [Résultat machine](verification-diagrammes.json).
- Deux vues de synthèse produites en **SVG et PNG** à partir de sources Graphviz modifiables : architecture et valeur/usages.
- Les deux PNG ont été inspectés visuellement : libellés lisibles, pas de texte tronqué ni de chevauchement constaté à leur résolution de sortie (1700 × 1185 et 1700 × 517).
- Les liens locaux et les sources de diagrammes sont contrôlés à la livraison.
- Les données financières et seuils de pilote sont présentés comme hypothèses ; la viabilité commerciale n'est pas annoncée comme démontrée.
- Les choix Node ou Python, ORM, queue, identité et IA sont des propositions à vérifier en POC ; aucun fournisseur d'identité, de paiement ou d'hébergement n'a été contractualisé dans cette mission.
- La variante Python ajoute FastAPI, SQLAlchemy/Alembic et une file durable. Aucun backend Python n'a été installé, migré ou testé ; seules sa conception et la syntaxe de ses deux diagrammes ont été vérifiées.
- Le code applicatif de l'archive n'a pas été modifié pour produire ce dossier.

Le parseur a été utilisé pour vérifier les diagrammes, pas pour tester une application. Les 16 diagrammes Mermaid n'ont pas été individuellement rendus et inspectés ; les deux exports de synthèse ont été contrôlés visuellement et représentent les vues initiales. La cohérence métier a été relue avec le dossier architecture et l'option Python, mais les POC, recettes, entretiens terrain, paiements et expérimentations pédagogiques restent à effectuer.

Le script `outils/generer-conception.mjs` reconstruit le catalogue et les exports. Ses bibliothèques de contrôle sont installées dans `.tooling/conception-render`, séparément des dépendances de SimuEmploi ; les exports utilisent Graphviz/Sharp du runtime local. Cette installation de contrôle ne change pas la stack de production du projet.
