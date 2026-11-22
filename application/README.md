# SimuEmploi — nouveau développement candidat

Le développement commence dans ce dossier, écrit à neuf. Public initial confirmé le 21 novembre 2026 : candidats à un premier emploi ou stage au Burkina Faso. Le 22 novembre, **OUOBA Abdou Rasmané** est nommé pour validation produit, relecture métier et coordination.

**Priorité actuelle : clôturer S0 avant de poursuivre les autres sprints.** Le [dossier S0-0.4](docs/sprints/S0-cloture/README.md) contient les maquettes adaptées, les contrats, le protocole d’essais et l’atelier de saisie des avis. La tranche S1 déjà réalisée reste conservée.

Cette première tranche de S1 permet de parcourir découverte, catalogue, préparation et aide. Les trois exercices viennent de l’API FastAPI ; ils sont identifiés comme exemples à relire. Aucune réponse privée n’est recueillie. S0 reste en cours : la démonstration technique ne remplace pas sa validation produit.

## Ouvrir la version locale

Lorsque les deux serveurs sont lancés :

- Interface : <http://127.0.0.1:5173/>
- Documentation API : <http://127.0.0.1:8000/docs>
- Santé du processus : <http://127.0.0.1:8000/health/live>

Sous Windows, dans deux terminaux ouverts dans `application/`, après installation :

```powershell
# Terminal 1
.\run-dev.ps1 -Service api
```

```powershell
# Terminal 2
.\run-dev.ps1 -Service web
```

Le script utilise les outils du PATH ; pour pnpm il accepte aussi le runtime Codex déjà présent sur ce poste. Les serveurs restent attachés aux terminaux : Ctrl+C les arrête. Les ports sont limités à la boucle locale et le frontend refuse un port différent si 5173 est occupé.

## Installation sur un poste neuf

Versions effectivement essayées : Python **3.12.14**, Node.js **24.22.3**, pnpm **11.25.0**. Backend : FastAPI **0.165.0**, Pydantic **2.14.4**, Uvicorn **0.54.0**. Frontend : React **19.3.1**, TypeScript **5.8.3**, Vite **6.4.6**. Le verrouillage Python correspond à Windows ; qualifier les images Linux avant déploiement. Les versions PostgreSQL/SQLAlchemy/Alembic/Celery/RabbitMQ restent à essayer et verrouiller.

Depuis `application/backend` :

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.lock.txt
.\.venv\Scripts\python.exe -m pip install -e . --no-deps
```

Depuis `application/frontend`, avec Node.js et pnpm installés :

```powershell
pnpm install --frozen-lockfile
```

`pnpm-workspace.yaml` autorise uniquement le script de construction d’esbuild. Le store local est placé dans `.tooling/pnpm-store` à la racine du projet et exclu de Git. Les dépendances frontend sont verrouillées dans `pnpm-lock.yaml`. Le package Playwright sert à la recette navigateur ; aucun service distant n’est nécessaire aux exercices locaux.

Sur Linux/macOS, utiliser `python3.12 -m venv .venv`, puis `.venv/bin/python` pour les mêmes commandes Python. Démarrer l’API avec `.venv/bin/python -m uvicorn simuemploi.app:create_app --factory --host 127.0.0.1 --port 8000`, puis `pnpm run dev` dans le frontend. Ces commandes sont proposées ; l’exécution de cette tranche a été vérifiée sur Windows.

## Vérifications reproductibles

Depuis `backend/` :

```powershell
.\.venv\Scripts\python.exe -m ruff check src tests ../tools
.\.venv\Scripts\python.exe -m ruff format --check src tests ../tools
.\.venv\Scripts\python.exe -m mypy
.\.venv\Scripts\python.exe -m pytest -q
.\.venv\Scripts\python.exe ../tools/export_openapi.py --check
```

Depuis `frontend/` :

```powershell
pnpm run build
# API et frontend doivent être démarrés pour la recette navigateur.
$env:SIMUEMPLOI_CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe'
pnpm run test:browser
```

Sur un poste sans Chrome installé, `pnpm exec playwright install chromium` installe le navigateur de test ; ne pas définir `SIMUEMPLOI_CHROME` dans ce cas. Le téléchargement est une étape séparée. Le scénario de test utilise une API réelle ; panne, catalogue vide et lenteur sont explicitement simulés par interception réseau.

`SIMUEMPLOI_URL` permet de changer l’URL de recette. Les captures et le JSON de résultat sont placés dans `docs/verification/`. La recette couvre le parcours et quelques comportements clavier ; elle ne certifie pas une conformité complète d’accessibilité.

## Organisation du code et du travail

| Dossier | Rôle |
|---|---|
| `backend/src/simuemploi/catalog` | Schémas, service, port de dépôt et exemples locaux |
| `frontend/src` | Interface, styles et client API |
| `contracts/openapi.json` | Contrat exporté des seules routes implémentées |
| `contracts/CONTRATS_A_PREPARER.md` | Propositions AUTH/ME/SESSION/évaluation/données et droits |
| `docs/architecture/ADR-001-demarrage.md` | Frontières de modules, décisions et compromis |
| `docs/sprints/S0-demarrage.md` | Statuts et reprise D1–D5 |
| `docs/verification/RECETTE_DEMARRAGE.md` | Résultats et limites techniques |
| `tools/` | Export OpenAPI et capture de l’environnement Python |

Le [plan des sprints pour cinq développeurs](../docs/candidat/02_SPRINTS_CINQ_DEVELOPPEURS.md) et les [dossiers de sprint livrés](../output/pdf/SimuEmploi_Sprints_PDF_v01) restent les références de travail. Ce journal suit la réalisation réelle sans déclarer tous les lots terminés.

## Prochaine tranche

Préparer PostgreSQL/Alembic, remplacer le dépôt d’exemples par un catalogue versionné persistant et qualifier migrations/CI/restauration. En parallèle, faire relire le premier corpus et attribuer les responsables. Les comptes OIDC, les réponses sauvegardées, l’IA, l’audio et la vidéo suivent ensuite leurs critères. Aucun entraînement simulé ou score statique de maquette n’est présenté comme une fonctionnalité opérationnelle.

L’application refuse actuellement tout `APP_ENV` autre que `local` ou `test`. Aucun déploiement de production n’a été réalisé. Les contrôles de charge nationale, de disponibilité, de coûts et de traitement des données devront être exécutés avant ouverture du pilote puis montée en charge.

**Évolution du 22 novembre :** question suivante fondée sur la précédente question et sa réponse, plusieurs fournisseurs IA selon les capacités, équipe à 24 h chacun par sprint. La référence S0-0.4 et ses contrats doivent être reçus avant toute poursuite.
