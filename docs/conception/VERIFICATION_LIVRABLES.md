# Vérification du dossier de conception

**20 novembre 2026.**

- Sept documents principaux et un index : idée/viabilité, architecture/technologies, catalogue de diagrammes, méthode de validation, douze décisions ADR, backend Python retenu et avis de revue. Le dossier candidat ajoute maquettes, sprints et contrats avec vérification UI dédiée.
- **16 sources Mermaid validées par le parseur Mermaid 11.17.2**, avec un DOM de contrôle jsdom 26.1.0. Résultat : 16 valides, aucune erreur de syntaxe. [Résultat machine](verification-diagrammes.json).
- Deux vues de synthèse produites en **SVG et PNG** à partir de sources Graphviz modifiables : architecture et valeur/usages.
- Les deux PNG ont été inspectés visuellement après adoption de Python : libellés lisibles, pas de texte tronqué ni de chevauchement constaté à leur résolution de sortie (1700 × 1775 pour l'architecture Python et 1700 × 517 pour valeur/usages).
- Les liens locaux et les sources de diagrammes sont contrôlés à la livraison.
- Les données financières et seuils de pilote sont présentés comme hypothèses ; la viabilité commerciale n'est pas annoncée comme démontrée.
- Le porteur a adopté Python/FastAPI, PostgreSQL, SQLAlchemy/Alembic et Celery/RabbitMQ avec outbox. Les ADR-02 à 04 et ADR-11, l'architecture, le cahier révisé et les diagrammes sont alignés ; versions, exploitation et performances restent à qualifier.
- Aucun fournisseur d'identité, de paiement ou d'hébergement n'a été contractualisé dans cette mission.
- Aucun backend Python n'a été installé, migré ou testé. Les contrôles portent sur les documents, la syntaxe des 16 diagrammes et les deux exports de synthèse.
- La revue précise l'identité issuer/subject, la portée de l'idempotence, le routage du broker, les revendications de travaux, les coûts et l'exécution Linux. Ces précisions sont documentées ; leurs essais restent à réaliser.
- Le code applicatif de l'archive n'a pas été modifié pour produire ce dossier.

Le parseur a été utilisé pour vérifier les diagrammes, pas pour tester une application. Les 16 diagrammes Mermaid n'ont pas été individuellement rendus et inspectés ; les deux exports de synthèse ont été contrôlés visuellement et l'architecture exportée représente la stack Python retenue. La cohérence métier a été relue avec le dossier architecture et le backend Python, mais les POC, recettes, entretiens terrain, paiements et expérimentations pédagogiques restent à effectuer.

Le script `outils/generer-conception.mjs` reconstruit le catalogue et les exports. Ses bibliothèques de contrôle sont installées dans `.tooling/conception-render`, séparément des dépendances de SimuEmploi ; les exports utilisent Graphviz/Sharp du runtime local. Cette installation de contrôle ne change pas la stack de production du projet.
