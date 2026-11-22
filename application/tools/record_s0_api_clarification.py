"""Record the API clarification and refresh the local review studio."""

import json
from copy import deepcopy
from pathlib import Path

DOSSIER = Path(__file__).resolve().parents[1] / "docs/sprints/S0-cloture"
target = DOSSIER / "preuves-humaines.json"
evidence = json.loads(target.read_text(encoding="utf-8"))
event_id = "2026-11-22-reference04-api-clarification"
if evidence.get("reference_version") != "S0-0.4":
    raise SystemExit("Cette clarification concerne la référence S0-0.4.")
if not any(event.get("id") == event_id for event in evidence.get("history", [])):
    evidence.setdefault("history", []).append(
        {
            "id": event_id,
            "date": "2026-11-22",
            "reference_version": "S0-0.4",
            "source": "Réponse directe du porteur dans ce chat à la demande de précisions",
            "reply_received": "c'est par rapport au fournisseur d'IA et comment utilise les API",
            "previous_product_review": deepcopy(evidence["product_review"]),
            "requested_changes_details": "Préciser les fournisseurs IA et l’utilisation des API",
            "supplier_choice_received": None,
            "budget_received": None,
        }
    )
    evidence["product_review"]["notes"] = (
        "Modifications demandées sur S0-0.4 ; le porteur précise qu’elles concernent "
        "les fournisseurs IA et l’utilisation des API. L’addendum API-0.1 présente "
        "une proposition à relire. Aucun fournisseur, modèle ou budget n’est reçu "
        "comme choix approuvé ; aucune relecture métier ni réception n’est inventée."
    )
    evidence["review_addendum"] = "API-0.1"
    target.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n", "utf-8")

data_path = DOSSIER / "donnees-atelier.json"
data = json.loads(data_path.read_text(encoding="utf-8"))
data["evidence"] = evidence
serialized = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
data_path.write_text(serialized, "utf-8")
template = (DOSSIER / "atelier.template.html").read_text(encoding="utf-8")
(DOSSIER / "atelier.html").write_text(
    template.replace("__S0_DATA__", serialized.replace("<", "\\u003c")), "utf-8"
)
print("S0-0.4 / API-0.1 : précision fournisseur/API enregistrée, choix encore proposé.")
