"""Record the sponsor's S0-0.4 revision request without inferring its details."""

import json
from copy import deepcopy
from pathlib import Path

DOSSIER = Path(__file__).resolve().parents[1] / "docs/sprints/S0-cloture"
target = DOSSIER / "preuves-humaines.json"
evidence = json.loads(target.read_text(encoding="utf-8"))
event_id = "2026-11-22-reference04-revision-request"
if evidence.get("reference_version") != "S0-0.4":
    raise SystemExit("Cette réponse concerne seulement la référence S0-0.4.")
if not any(event.get("id") == event_id for event in evidence.get("history", [])):
    evidence.setdefault("history", []).append(
        {
            "id": event_id,
            "date": "2026-11-22",
            "reference_version": "S0-0.4",
            "source": "Réponse directe du porteur à la question de relecture S0-0.4 dans ce chat",
            "reply_received": "Je demande des modifications, que je précise",
            "previous_product_review": deepcopy(evidence["product_review"]),
            "requested_changes_details": None,
        }
    )
    evidence["product_review"] = {
        "reviewer": "OUOBA Abdou Rasmané",
        "reviewed_at": "2026-11-22",
        "verdict": "revise",
        "notes": (
            "Demande reçue dans ce chat : « Je demande des modifications, que je précise ». "
            "Les éléments concernés et le résultat attendu restent à recevoir. "
            "Aucune modification précise, approbation métier ou validation de contrat "
            "n’est déduite de cet avis."
        ),
    }
    target.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n", "utf-8")

# Refresh only the studio's embedded evidence; leave design and mockups unchanged.
data_path = DOSSIER / "donnees-atelier.json"
data = json.loads(data_path.read_text(encoding="utf-8"))
data["evidence"] = evidence
serialized = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
data_path.write_text(serialized, "utf-8")
template = (DOSSIER / "atelier.template.html").read_text(encoding="utf-8")
(DOSSIER / "atelier.html").write_text(
    template.replace("__S0_DATA__", serialized.replace("<", "\\u003c")), "utf-8"
)
print("S0-0.4 : demande de modifications enregistrée ; détails à recevoir.")
