"""Migrate S0 evidence and studio to the sponsor's adaptive/multi-provider request."""

import json
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOSSIER = ROOT / "docs/sprints/S0-cloture"
target = DOSSIER / "preuves-humaines.json"
evidence = json.loads(target.read_text(encoding="utf-8"))
event_id = "2026-11-22-adaptive-multi-provider-24h"
if not any(item.get("id") == event_id for item in evidence.get("history", [])):
    previous_reviews = {
        key: deepcopy(evidence[key])
        for key in [
            "business_reviews",
            "product_review",
            "decisions_review",
            "backlog_review",
        ]
    }
    evidence.setdefault("history", []).append(
        {
            "id": event_id,
            "date": "2026-11-22",
            "previous_reference": "S0-0.3",
            "previous_reviews": previous_reviews,
            "requested_changes": [
                "La prochaine question dépend de la question et de la réponse précédentes.",
                "Plusieurs API ou fournisseurs IA peuvent être utilisés dans l’ensemble du projet.",
            ],
            "availability_confirmed": "24 heures par développeur et par sprint de deux semaines",
            "source": (
                "Réponses directes du porteur ; clarification 24 h confirmée dans ce chat par « 1 »"
            ),
        }
    )
    evidence["schema_version"] = evidence["reference_version"] = "S0-0.4"
    for role in evidence["developers"].values():
        role["availability_hours_per_sprint"] = 24
        role.pop("availability_days_per_sprint", None)
        role["availability_source"] = "24 h par développeur par sprint, confirmé dans ce chat"
    for review in evidence["business_reviews"]:
        review.update(scenario_version=3, reviewer="", reviewed_at="", verdict="pending", notes="")
    for key in ["product_review", "decisions_review", "backlog_review"]:
        evidence[key] = {
            "reviewer": "",
            "reviewed_at": "",
            "verdict": "pending",
            "notes": "",
        }
    evidence["nomination_note"] = (
        "Ouoba, Abdou, Rasmané, limata, Oumou affectés D1–D5 ; 24 heures chacun par sprint. "
        "Compréhension des périmètres adaptés à confirmer. S0-0.4 reste à relire."
    )
    target.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

# Repair the first migration's shared-list alias: S0-0.3 used corpus version 2.
# Only the historical scenario version changes; verdicts and notes are preserved.
history_repaired = False
for event in evidence.get("history", []):
    if event.get("id") == event_id and event.get("previous_reference") == "S0-0.3":
        for review in event.get("previous_reviews", {}).get("business_reviews", []):
            if review.get("scenario_version") == 3:
                review["scenario_version"] = 2
                history_repaired = True
if history_repaired:
    target.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

studio = DOSSIER / "atelier.js"
text = studio.read_text(encoding="utf-8")
text = text.replace("S0-0.3", "S0-0.4")
text = text.replace("availability_days_per_sprint", "availability_hours_per_sprint")
text = text.replace('min="0" max="10" step="0.5"', 'min="0" max="80" step="1"')
text = text.replace(
    "Jours disponibles sur un sprint de deux semaines",
    "Heures disponibles par sprint de deux semaines",
)
text = text.replace("ses jours ne se multiplient pas", "ses heures ne se multiplient pas")
text = text.replace(
    "Proposition corrigée version 2.",
    "Banque de référence version 3 pour des entretiens adaptatifs.",
)
text = text.replace("Relire les quinze questions", "Relire la banque et la politique adaptative")
text = text.replace(
    "${s.question_count} questions",
    "${s.question_count} axes · jusqu’à 7 questions adaptées",
)
text = text.replace(
    "Avis métier sur les cinq questions et la grille",
    "Avis métier sur la banque, la grille et la politique adaptative",
)
text = text.replace("s.tasks.length===8", "s.tasks.length===data.tasks.length")
text = text.replace(
    "places développeurs renseignées",
    "places avec disponibilité et périmètre confirmés",
)
studio.write_text(text, encoding="utf-8")
template = DOSSIER / "atelier.template.html"
template.write_text(
    template.read_text(encoding="utf-8").replace("S0-0.3", "S0-0.4"), encoding="utf-8"
)

checker = ROOT / "tools/verifier_s0.py"
text = checker.read_text(encoding="utf-8").replace("S0-0.3", "S0-0.4")
text = text.replace('item["version"] != 2', 'item["version"] != 3')
text = text.replace('r.get("scenario_version") == 2', 'r.get("scenario_version") == 3')
text = text.replace("Avis métier daté sur version 2", "Avis métier daté sur version 3")
text = text.replace(
    'role.get("availability_days_per_sprint")',
    'role.get("availability_hours_per_sprint")',
)
text = text.replace("0 < days <= 10", "0 < days <= 80")
text = text.replace("range(1, 9)", "range(1, 11)").replace(
    "len(entries) == 8", "len(entries) == 10"
)
text = text.replace(
    "trois plans de cinq questions",
    "trois banques de cinq questions et leur politique adaptative",
)
checker.write_text(text, encoding="utf-8")

test = ROOT / "tools/tests/test_s0_reception.py"
text = test.read_text(encoding="utf-8").replace(
    "availability_days_per_sprint=5", "availability_hours_per_sprint=24"
)
text = text.replace("range(1, 9)", "range(1, 11)")
test.write_text(text, encoding="utf-8")
print(
    "S0-0.4 : exigences et disponibilités enregistrées ; "
    "avis antérieurs conservés dans l’historique."
)
