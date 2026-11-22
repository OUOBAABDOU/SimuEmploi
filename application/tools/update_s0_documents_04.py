"""Update S0 references; historical v0.3 remains in its delivered archive."""
# ruff: noqa: E501 -- literal document paragraphs keep their intended line layout

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DOSSIER = ROOT / "application/docs/sprints/S0-cloture"
for name in [
    "README.md",
    "01_RELECTURE_METIER.md",
    "03_PROTOCOLE_ESSAIS.md",
    "04_RESPONSABLES_DECISIONS_BACKLOG.md",
    "05_RECEPTION.md",
]:
    path = DOSSIER / name
    path.write_text(path.read_text(encoding="utf-8").replace("S0-0.3", "S0-0.4"), encoding="utf-8")

path = DOSSIER / "README.md"
text = path.read_text(encoding="utf-8")
text = text.replace(
    "Leurs disponibilités et compréhension des périmètres restent à confirmer.",
    "Disponibilité confirmée : 24 heures chacun par sprint de deux semaines. La compréhension des périmètres adaptés reste à confirmer.",
)
text = text.replace(
    "**Dernier avis produit : modifications demandées sur S0-0.4**, le 22 novembre. Les changements précis restent à indiquer ; cette réponse ne vaut pas approbation du corpus ou des contrats. Le registre conserve l’avis reçu et sa provenance.",
    "**Modifications reçues et intégrées à la proposition S0-0.4 :** entretien adaptatif et plusieurs API/IA pour le projet. La nouvelle référence reste à approuver ; l’avis sur S0-0.3 est conservé dans l’historique.",
)
text = text.replace(
    "Trois scénarios / quinze questions ; corrections et critères à relire",
    "Trois banques / quinze questions de référence ; politique adaptative à relire",
)
text = text.replace("protocole d’essais", "protocole d’essais")
text = text.replace(
    "Le corpus version 2 est une proposition corrigée",
    "Le corpus version 3 est une banque et une politique d’entretien adaptatif",
)
text = text.replace(
    "| `preuves-humaines.json` | Registre vierge des validations, avec nomination réellement reçue |",
    "| `preuves-humaines.json` | Nominations, 24 h par personne et avis historisés ; nouvelles validations encore à renseigner |\n"
    "| `07_ENTRETIEN_ADAPTATIF_ET_MULTI_IA.md` | Architecture et contrats de génération / plusieurs fournisseurs |\n"
    "| `08_IMPACTS_ET_CAPACITE.md` | Capacité de 120 h et dépendances des lots à réestimer |\n"
    "| `question-candidate.schema.json`, `ai-registry.example.json` | Schéma de proposition et exemple de registre désactivé |",
)
path.write_text(text, encoding="utf-8")

path = DOSSIER / "01_RELECTURE_METIER.md"
text = path.read_text(encoding="utf-8")
text = text.replace(
    "Chaque scénario comporte cinq questions, trois critères qualitatifs et des conseils simples.",
    "Chaque scénario comporte une banque de cinq questions/axes, trois critères qualitatifs et des conseils simples. La première question est déterminée ; les suivantes dépendent du tour précédent confirmé. Le candidat ne reçoit pas obligatoirement les cinq libellés de référence dans cet ordre.",
)
text += "\n## Évolution adaptative reçue le 22 novembre\n\nLa banque est portée à la version 3 avec une politique adaptative : cinq axes, maximum proposé sept questions dont deux relances. Les corrections de critères de la version 2 sont conservées. Relire aussi les règles de pertinence des relances, leur lien au tour précédent, les questions interdites et les limites dans `07_ENTRETIEN_ADAPTATIF_ET_MULTI_IA.md`. L’approbation de la banque ne qualifie pas à elle seule les questions produites par un fournisseur futur.\n"
path.write_text(text, encoding="utf-8")

path = DOSSIER / "03_PROTOCOLE_ESSAIS.md"
text = path.read_text(encoding="utf-8")
text = text.replace("30–40 minutes", "35–45 minutes").replace("huit tâches", "dix tâches")
text = text.replace(
    "| T08 | Trouvez la demande de suppression puis annulez-la | Confirmation trouvée et annulable ; simulation de demande comprise |",
    "| T08 | Trouvez la demande de suppression puis annulez-la | Confirmation trouvée et annulable ; simulation de demande comprise |\n"
    "| T09 | Après une réponse fictive, lisez la relance et expliquez son lien au tour précédent | Question ET réponse précédentes utilisées ; nouvelle réponse distincte donne une relance distincte |\n"
    "| T10 | La question suivante manque : où se trouve la réponse et quelle suite est possible ? | Attente de génération distincte du feedback ; réponse conservée et réessai trouvé |",
)
text += "\n## Animation des situations adaptatives\n\nPour T09, choisir le premier stage puis confirmer une réponse fictive. Lire la question suivante ; la maquette utilise une règle locale, aucune IA. Comparer un nouvel essai avec une autre réponse, sans réutiliser un brouillon réel. Pour T10, choisir « Question suivante en préparation » ou « Question suivante indisponible » avant de demander la suivante. Remettre la situation normale puis redemander : la réponse confirmée reste la même. Un résultat automatique n’est pas une observation candidate. Le registre S0-0.4 comprend dix tâches par séance ; ne pas importer un ancien export de huit tâches comme une séance complète.\n"
path.write_text(text, encoding="utf-8")

path = DOSSIER / "04_RESPONSABLES_DECISIONS_BACKLOG.md"
text = path.read_text(encoding="utf-8")
text = text.replace(
    "Aucune disponibilité n’est encore fournie ; la capacité réelle reste à confirmer.",
    "Disponibilité confirmée : 24 heures par personne et par sprint, soit 120 heures brutes. Les estimations et la compréhension des nouveaux périmètres restent à confirmer.",
)
text = text.replace("jours disponibles sur un sprint", "heures disponibles sur un sprint")
text = text.replace("ses jours disponibles", "ses heures disponibles")
text += "\n## Révision adaptative et multi-IA\n\nLes tâches de génération, questions figées par tour, attente/panne et registre par capacités sont détaillées dans `07_ENTRETIEN_ADAPTATIF_ET_MULTI_IA.md`. Les estimations historiques ci-dessus en jours sont à remplacer par une estimation en heures sous capacité de 120 h ; ne pas les additionner comme un sprint à temps complet. D2 porte les opérations/questions et D3 les ports/validations ; D5 contrôle données et routage. `08_IMPACTS_ET_CAPACITE.md` prime sur les hypothèses de capacité des anciens sprints.\n"
path.write_text(text, encoding="utf-8")

path = DOSSIER / "05_RECEPTION.md"
text = path.read_text(encoding="utf-8")
text = text.replace(
    "trois avis portant chacun sur cinq questions",
    "trois avis portant chacun sur la banque et la politique adaptative",
)
text = text.replace(
    "disponibilités et compréhension à confirmer",
    "24 h chacun confirmées ; compréhension des périmètres à confirmer",
)
text = text.replace(
    "Modifications demandées par OUOBA Abdou Rasmané ; détails à préciser, réception non accordée",
    "Adaptatif/multi-IA demandés et intégrés à la proposition ; S0-0.4 à approuver après relecture et essais",
)
path.write_text(text, encoding="utf-8")

(DOSSIER / "02_PARCOURS_ET_CONTRATS.md").write_text(
    """# S0-0.4 — Référence des parcours et contrats

22 novembre 2026. Cette référence adapte le premier produit à l’exigence d’entretien contextuel et de plusieurs API/IA. Les anciens contrats de S0-0.3 sont conservés dans l’archive livrée. Les routes privées ci-dessous sont des spécifications ; l’OpenAPI réellement implémenté reste celui du catalogue local.

## Référence principale

`07_ENTRETIEN_ADAPTATIF_ET_MULTI_IA.md` décrit la politique, les snapshots, les contrats de prochaine question, validations, pannes, routage et provenance. En cas d’écart avec une proposition antérieure de plan fixe, S0-0.4 prime.

## Douze écrans et critères

| Écran | Action / contenu à recevoir | Contrôle essentiel |
|---|---|---|
| C01 Découverte | Utilité et limite, première préparation accessible | Aucun média obligatoire ni garantie d’embauche |
| C02 Connexion | OIDC, retour interne autorisé, refus et expiration | Identité serveur, aucun jeton fournisseur exposé |
| C03 Objectif | Stage/emploi, préférences facultatives | Confirmation serveur et révision ; pas de préférence inventée |
| C04 Accueil | Reprendre prioritairement / préparer | État propriétaire, aucun score fictif |
| C05 Catalogue | Objectif, mode adaptatif, axes et limite proposée | Banque distincte d’une liste de questions déjà générées |
| C06 Préparation | Première question, cinq axes, jusqu’à sept tours proposés | Politique/grille figées ; démarrage idempotent |
| C07 Réponse | Question effectivement posée, aide adaptée, valider et pause | Brouillon ≠ conservé ; attente de prochaine question distincte de l’IA de retour |
| C08 Retour | Preuve/commentaire/limites ; demander la prochaine question | Évaluation et génération indépendantes ; aucune note de secours |
| C09 Fin | Fin confirmée, raison et couverture | Pas de fin silencieuse par le fournisseur ; rapport partiel annoncé |
| C10 Historique | Reprendre ou relire les tours réels | Une lecture ne regénère jamais une question |
| C11 Rapport | Axes couverts, tours et références, conseils | Évaluations de la bonne question et versions ; pas de classement |
| C12 Compte | Préférences, demandes de données et déconnexion | Confirmation, annulation, statut réel et nettoyage sous bonne identité |

Maquette guidée/autonome : référence à comparer. Minimum de conception 320 px, actions de 44 px, labels visibles, aide par question, focus et annonces textuelles. Les images décoratives n’empêchent pas questions et actions. Les appareils réels, lecteur d’écran et clavier virtuel restent à tester.

## Identité, droits et erreurs

OIDC : `GET /auth/login`, `GET /auth/callback`, `POST /auth/logout`. État/nonce/issuer/audience/signature/expiration et flux PKCE approprié ; secrets serveur. Utilisateur lié par `(issuer, subject)`, sans fusion automatique par email. Cookies Secure/HttpOnly et CSRF qualifiés avec le fournisseur avant S2.

`GET /api/v1/me`, `PUT /api/v1/me/preferences` : propriétaire, références autorisées, révision attendue, confirmation durable. Objectif stage/emploi et expérience facultative ; aucun propriétaire choisi par le client.

Catalogue visible public ; compte/session/question/réponse/retour/rapport/demande réservés au propriétaire. Ressource privée inexistante ou d’un autre compte : 404 cohérent, sans contenu d’un tiers. Administration sans accès ordinaire au coaching privé ; interventions exceptionnelles bornées et journalisées.

Erreur : code/message/correlation_id et éventuellement erreurs de champ sans recopier la saisie. 401 accès absent ; 409 révision/état/clé ; 422 format ; 429 quota ; 503 non accepté durablement. Une panne après conservation devient un état de travail, jamais une réponse effacée.

## Invariants conservés

- Texte non blanc, limite proposée 4 000 caractères Unicode ; aucune compétence déduite de la longueur.
- Une réponse finale est immuable dans ce premier lot ; relire n’écrit pas. Correction pédagogique dans un nouvel essai.
- Idempotence par principal/opération/ressource/empreinte ; même requête relecture, clé incompatible conflit. Échéances compatibles avec reprises et contraintes métier.
- Évaluation liée à la question réellement posée, réponse/révision, critères autorisés et preuve exacte. Aucun score global ou diagnostic d’apparence/personnalité.
- Rapport sur tours réellement acceptés et évaluations référencées ; publication stable, couverture partielle visible.
- Export/suppression couvrent aussi question contextualisée, contexte, synthèse et travaux. Politique de sauvegardes/sous-traitance à recevoir avant pilote ; pas de durée légale inventée.

La pause et la reprise sont des mutations explicites ; les lectures ne déclenchent ni transition ni appel IA. La fin conserve raison et couverture ; l’IA ne peut pas effacer ou réécrire l’historique.

## Recette des contrats à préparer pour la réalisation

Deux comptes A/B, soumissions concurrentes, coupure après commit, job doublé, réponse invalide, mauvaise ancre, question répétée, question prête relue après changement de fournisseur, timeout incertain, budget global, fournisseur non autorisé et suppression pendant génération. Ces garanties seront testées sur le code métier ; les maquettes simulent seulement les transitions.
""",
    encoding="utf-8",
)

for relative in [
    "application/docs/sprints/S0-demarrage.md",
    "application/README.md",
    "docs/candidat/README.md",
]:
    path = ROOT / relative
    text = path.read_text(encoding="utf-8").replace("S0-0.3", "S0-0.4")
    text = text.replace(
        "Disponibilités et compréhension des périmètres à confirmer.",
        "24 heures par personne par sprint confirmées ; compréhension des nouveaux périmètres à confirmer.",
    )
    text = text.replace(
        "changements précis à indiquer",
        "exigences précisées : adaptatif et plusieurs API/IA",
    )
    note = "\n**Évolution du 22 novembre :** question suivante fondée sur la précédente question et sa réponse, plusieurs fournisseurs IA selon les capacités, équipe à 24 h chacun par sprint. La référence S0-0.4 et ses contrats doivent être reçus avant toute poursuite.\n"
    if "**Évolution du 22 novembre :**" not in text:
        text += note
    path.write_text(text, encoding="utf-8")
print("Documents S0-0.4 alignés sur les exigences adaptatives et les 120 h brutes.")
