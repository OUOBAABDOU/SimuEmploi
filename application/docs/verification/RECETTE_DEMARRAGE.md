# Recette de la première tranche candidat

Exécution : 21 novembre 2026, poste Windows. Nouvelle application dans `application/`, sans reprise du code historique. Premier usage : préparation d’un premier entretien d’emploi ou de stage au Burkina Faso.

## Résultats observés

| Vérification | Résultat |
|---|---|
| Ruff, schémas/services/tests/outils | Conforme ; 9 fichiers formatés |
| mypy strict | Aucun problème dans les 6 fichiers source Python |
| pytest + HTTPX ASGITransport | **9 tests réussis**, sans avertissement après adaptation aux dépendances installées |
| TypeScript strict + Vite build | Compilation réussie ; 30 modules transformés |
| Export OpenAPI / contrôle de dérive | Conforme au contrat exporté |
| Playwright 1.62.1 + Chrome 157.0.8103.40 | **13 contrôles réussis**, aucune erreur JavaScript non traitée |
| Inspection des captures | Découverte ordinateur et préparation mobile inspectées : pas de texte coupé ni de recouvrement observé |

Le résultat navigateur horodaté figure dans `parcours-resultats.json`. Les captures sont dans `captures/`. Le script reproductible est `frontend/tests/parcours.mjs` ; les commandes figurent dans `application/README.md`.

La compilation produit environ **237,86 ko de JavaScript (74,14 ko gzip)** et **11,02 ko de CSS (3,19 ko gzip)**. Ces tailles correspondent au bundle de cette version, pas au volume total d’une navigation mesurée sur téléphone. L’illustration est un SVG inclus dans le code ; aucune image distante ni police externe n’est requise par l’interface.

## Portée des essais

L’API est réelle et locale pour catalogue, fiche et erreur 404. Les tests backend vérifient brouillons invisibles, absence des questions dans les cartes, pagination sans répétition, limites de requête, curseur inconnu, ressource absente, cohérence scénario/version/grille et refus du mode production.

La recette navigateur couvre découverte/catalogue/préparation/aide, les deux filtres, accordéon, lien d’évitement au clavier, actualisation d’une fiche et retour conservant le filtre. Les quatre écrans ont été essayés à **320, 360 et 768 px**, avec une capture ordinateur à **1440 px**. Une panne réseau, un résultat vide et une réponse lente ont été simulés par interception explicite ; le réessai utilise ensuite l’API réelle.

Ce résultat ne mesure pas encore la capacité nationale, la fiabilité de sauvegarde, la qualité IA ou la conformité complète d’accessibilité. Il ne remplace pas une observation avec de vrais candidats, ni une vérification lecteur d’écran ou téléphone physique.

## Dépendances et environnement

Python 3.12.14, Node.js 24.22.3, pnpm 11.25.0. Les versions installées sont conservées dans `backend/requirements-dev.lock.txt` et `frontend/pnpm-lock.yaml`. Seul le script de construction esbuild est autorisé dans la configuration pnpm.

La compilation Vite a nécessité une exécution autorisée hors de l’environnement restreint : esbuild était bloqué en lecture des dossiers parents. Le développement et la recette utilisent la boucle locale (`127.0.0.1`) ; aucun déploiement public n’a eu lieu. Les installations ont été limitées aux dépendances de la nouvelle application et de ses vérifications.

L’environnement Python est un venv propre au backend. Les anciens fichiers d’étude, maquettes, PDF et code d’archive sont conservés. Aucun commit ou envoi vers un dépôt distant n’a été effectué.

## Points ouverts avant réception des sprints

- Questions et grilles : exemples à relire, référent métier et porteur produit à désigner.
- S0 : validation utilisateurs, décisions attribuées et capacité réelle de l’équipe à recevoir.
- S1 : PostgreSQL/SQLAlchemy/Alembic, migrations, CI distante, préproduction et restauration à réaliser/qualifier.
- S2/S3 : fournisseur OIDC, comptes, rétention, quotas et conservation fiable des réponses à réaliser.
- Lots suivants : évaluation IA avec provenance, rapports, audio et vidéo à réaliser et tester.

L’application refuse `APP_ENV=production`. Les exemples restent clairement signalés. La tranche est techniquement exécutable ; S0 et S1 ne sont pas déclarés entièrement reçus.
