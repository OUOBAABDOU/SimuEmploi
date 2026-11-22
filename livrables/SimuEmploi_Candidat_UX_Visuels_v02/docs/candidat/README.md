# SimuEmploi — conception du premier produit candidat

**20 novembre 2026.** Construction neuve, cinq développeurs full stack, parcours candidat en premier. Le porteur a confirmé des modules séparés puis une extraction progressive en microservices selon les besoins.

Ce dossier complète la conception générale et remplace son ordre de lancement : établissements et recruteurs deviennent des extensions. Des établissements peuvent participer à la recherche et au pilote sans disposer encore d'un espace métier dans le produit.

1. [Maquettes, parcours et règles des écrans](01_MAQUETTES_ET_PARCOURS.md).
2. [Sprints détaillés et répartition entre cinq développeurs](02_SPRINTS_CINQ_DEVELOPPEURS.md).
3. [Modules, contrats et évolution en microservices](03_MODULES_ET_CONTRATS.md).
4. [Contrôles des maquettes](VERIFICATION_MAQUETTES.md).
5. [Ajustements UX, illustrations et tâches des développeurs](04_AJUSTEMENTS_UX_ET_VISUELS.md).

Les maquettes 0.2 sont des propositions modifiables. Elles représentent douze écrans, deux variantes de présentation et des états normaux/dégradés. Quatre scènes illustrées en apparence claire/sombre accompagnent le parcours. Leurs données et retours sont fictifs : aucun appel IA, paiement, compte réel ou suppression réelle n'est exécuté. Les brouillons de démonstration restent uniquement en mémoire pendant la consultation.

Les captures dans `visuels/` servent de références de relecture. La proposition cliquable est présentée dans le chat et son source est conservé dans le répertoire de visualisation de cette conversation. Les spécifications ci-dessous servent à développer un frontend neuf ; aucun composant applicatif du prototype fourni n'est repris.

La stack reste React/TypeScript, Python/FastAPI/Pydantic, PostgreSQL, SQLAlchemy/Alembic et Celery/RabbitMQ avec outbox. La [revue générale](../conception/07_REVUE_ET_PRECISIONS_AVANT_DEVELOPPEMENT.md) reste applicable aux garanties de production.
