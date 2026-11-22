"""Package the reviewed S0 design; never change or manufacture human evidence."""

import argparse
import json
import re
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[2]
DOSSIER = ROOT / "application/docs/sprints/S0-cloture"
TARGET = ROOT / "livrables/SimuEmploi_S0_Cloture_v04_2026-11-22.zip"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--addendum-api", action="store_true")
    parser.add_argument("--agentrouter-review", action="store_true")
    parser.add_argument("--received-reviews", action="store_true")
    parser.add_argument("--team-confirmed", action="store_true")
    parser.add_argument("--revision", default="")
    args = parser.parse_args()
    if args.team_confirmed:
        args.received_reviews = True
    api_review = args.addendum_api or args.agentrouter_review or args.received_reviews
    archive_target = (
        ROOT / "livrables/SimuEmploi_S0_v04_API01_Equipe_Confirmee_2026-11-22.zip"
        if args.team_confirmed
        else ROOT / "livrables/SimuEmploi_S0_v04_API01_Avis_Metier_Conception_2026-11-22.zip"
        if args.received_reviews
        else ROOT / "livrables/SimuEmploi_S0_v04_API01_Atelier_AgentRouter_2026-11-22.zip"
        if args.agentrouter_review
        else ROOT / "livrables/SimuEmploi_S0_Cloture_v04_API01_2026-11-22.zip"
        if args.addendum_api
        else TARGET
    )
    if args.revision:
        if not re.fullmatch(r"[A-Za-z0-9_-]{1,40}", args.revision):
            raise SystemExit("Révision attendue : 1 à 40 lettres, chiffres, tirets ou underscores.")
        archive_target = archive_target.with_name(
            f"{archive_target.stem}_{args.revision}{archive_target.suffix}"
        )
    preparation = json.loads((DOSSIER / "verification-preparation.json").read_text("utf-8"))
    qa = json.loads((DOSSIER / "verification-maquettes.json").read_text("utf-8"))
    for report in [preparation, qa]:
        if report.get("reference_version") != "S0-0.4" or report.get("status") != "passed":
            raise SystemExit("Le dossier technique S0-0.4 doit être vérifié avant archivage.")
    if api_review and qa.get("addendum_version") != "API-0.1":
        raise SystemExit("La recette de l’addendum API-0.1 doit être vérifiée avant archivage.")
    if args.agentrouter_review or args.received_reviews:
        evidence = json.loads((DOSSIER / "preuves-humaines.json").read_text("utf-8"))
        plan = evidence.get("api_qualification_plan", {})
        if plan.get("primary_candidate") != "agentrouter_external" or not plan.get(
            "candidate_priority_confirmed"
        ):
            raise SystemExit("La priorité AgentRouter doit avoir été explicitement reçue.")
        if not any("Étape IA/API" in item.get("name", "") for item in qa.get("checks", [])):
            raise SystemExit("L’étape IA/API de l’atelier doit avoir été vérifiée.")
        if args.received_reviews and (
            len(evidence.get("business_reviews", [])) != 3
            or any(item.get("verdict") != "approved" for item in evidence["business_reviews"])
            or evidence.get("decisions_review", {}).get("verdict") != "approved"
        ):
            raise SystemExit("Les trois avis métier et l’avis conception doivent être reçus.")
        if args.team_confirmed and (
            evidence.get("backlog_review", {}).get("verdict") != "approved"
            or not all(item.get("scope_acknowledged") for item in evidence["developers"].values())
        ):
            raise SystemExit("Le backlog et les cinq périmètres doivent être confirmés.")
    if archive_target.exists():
        raise SystemExit(
            "Archive v04 déjà présente ; choisir une nouvelle version pour une révision."
        )
    instructions = """SIMUEMPLOI — DOSSIER S0-0.4 À RELIRE
22 novembre 2026

Extraire toute l’archive dans un dossier, puis ouvrir atelier.html.
Les maquettes, corpus et formulaires fonctionnent sans compte ni API IA.
Conserver l’export JSON des saisies avant de fermer l’atelier.
Le fichier exporté ne remplace pas automatiquement preuves-humaines.json.

Si un serveur local est préféré et Python déjà disponible :
python -m http.server 5174 --bind 127.0.0.1
depuis le dossier extrait, puis ouvrir http://127.0.0.1:5174/atelier.html.
Les commandes application/backend/frontend du README nécessitent le dépôt complet.

Lire d’abord 07_ENTRETIEN_ADAPTATIF_ET_MULTI_IA.md et 08_IMPACTS_ET_CAPACITE.md.
Le backlog humain S0 restant en heures est dans 04_RESPONSABLES_DECISIONS_BACKLOG.md.
Les noms et 24 heures chacun sont reçus ; avis et essais réels restent à renseigner.
L’archive rassemble une préparation technique vérifiée, pas une réception humaine.
Aucun autre sprint n’est autorisé avant réception S0 selon l’instruction du porteur.

Les copies audio/vidéo montrent les futurs écrans de capture et relecture.
Leurs tours préécrits ne définissent pas la séquence du produit adaptatif.
Aucun microphone, caméra, conservation serveur ou fournisseur IA n’est actif.

L’ancienne archive v03 est conservée dans le projet pour comparaison.
"""
    if api_review:
        instructions += (
            "\nADDENDUM API-0.1\n"
            "Lire 09_FOURNISSEURS_IA_ET_UTILISATION_API.md pour le choix fournisseur/API.\n"
            "ai-routing.proposal.json contient des candidats tous désactivés et non qualifiés.\n"
            "Les exemples Python sont conceptuels, "
            "sans appel réel ni SDK installé par le dossier.\n"
            "La demande fournisseur/API est précisée ; la proposition reste à approuver.\n"
            "L’archive v04 antérieure à cet addendum est conservée dans le projet.\n"
        )
    if args.agentrouter_review or args.received_reviews:
        instructions += (
            "\nATELIER AGENTROUTER ET PREMIÈRE BOUCLE D’ESSAIS\n"
            "AgentRouter est le premier candidat à qualifier pour les entretiens texte.\n"
            "Ouvrir l’étape 2 IA et API, puis lire 10_EVALUATION_AGENTROUTER.md.\n"
            "Les modèles, données, budgets et accès restent à qualifier ; API inactive.\n"
            "Première boucle de trois essais prévue le 22/11/2026.\n"
            "Ouvrir l’étape 4 Essais réels et le protocole 03_PROTOCOLE_ESSAIS.md.\n"
            "Ne remplir la date observée et les résultats qu’après la séance réelle.\n"
            "L’archive conserve la planification, sans créer de participant ou de résultat.\n"
        )
    if args.received_reviews:
        instructions += (
            "\nAVIS MÉTIER ET CONCEPTION REÇUS LE 22/11/2026\n"
            "OUOBA Abdou Rasmané approuve les trois banques v3 et la conception S0.\n"
            "Les avis et leur historique sont dans preuves-humaines.json et dans l’atelier.\n"
            "Les essais, les périmètres et le backlog/capacité restent à confirmer.\n"
            "Cette archive ne reçoit pas S0 et n’active aucune API.\n"
            "Les passages génériques à relire ci-dessus concernent les éléments restants.\n"
        )
    archive_target.parent.mkdir(exist_ok=True)
    if args.team_confirmed:
        instructions += (
            "\nÉQUIPE ET BACKLOG CONFIRMÉS LE 22/11/2026\n"
            "Le coordinateur confirme D1–D5 et le backlog estimé sans ajustement demandé.\n"
            "Les disponibilités restent de 24 h chacun par sprint.\n"
            "Les estimations ne sont pas des heures consommées.\n"
            "Il reste les essais candidats, les corrections et la décision après examen.\n"
            "Les éléments annoncés en attente dans les historiques ci-dessus sont reçus.\n"
        )
    paths = sorted(path for path in DOSSIER.rglob("*") if path.is_file())
    with ZipFile(archive_target, "x", compression=ZIP_DEFLATED) as archive:
        archive.writestr("LIRE_EN_PREMIER.txt", instructions)
        for path in paths:
            archive.write(path, path.relative_to(DOSSIER).as_posix())
    with ZipFile(archive_target) as archive:
        if archive.testzip() is not None:
            raise SystemExit("Erreur d’intégrité de l’archive.")
        archived = json.loads(archive.read("preuves-humaines.json"))
        current = json.loads((DOSSIER / "preuves-humaines.json").read_text("utf-8"))
        if archived != current:
            raise SystemExit("Le registre archivé diffère du registre humain courant.")
        print(f"Archive S0-0.4 créée et vérifiée : {len(archive.namelist())} fichiers.")


if __name__ == "__main__":
    main()
