"""Record the sponsor's 2026-11-22 reply, without inventing availability or approval."""

import json
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "docs/sprints/S0-cloture"
target = root / "preuves-humaines.json"
evidence = json.loads(target.read_text(encoding="utf-8"))
names = {"D1": "Ouoba", "D2": "Abdou", "D3": "Rasmané", "D4": "limata", "D5": "Oumou"}
history = evidence.setdefault("history", [])
if not any(item.get("id") == "2026-11-22-team-and-revision" for item in history):
    for role, name in names.items():
        evidence["developers"][role]["name"] = name
        evidence["developers"][role]["nomination_source"] = (
            "Liste du porteur dans ce chat, 22 novembre 2026 ; affectation dans l’ordre D1 à D5."
        )
    evidence["nomination_note"] = (
        "D1 Ouoba, D2 Abdou, D3 Rasmané, D4 limata, D5 Oumou : noms reçus du porteur. "
        "Disponibilités et compréhension des périmètres non confirmées."
    )
    previous_review = evidence["product_review"].copy()
    evidence["product_review"] = {
        "reviewer": "OUOBA Abdou Rasmané",
        "reviewed_at": "2026-11-22",
        "verdict": "revise",
        "notes": (
            "Avis global reçu dans ce chat : « modifications préciser a apporter ». "
            "Une demande de modifications est enregistrée ; les points concernés "
            "et le résultat attendu restent à préciser. Aucun scénario ou contrat "
            "n’est déclaré approuvé par cet avis."
        ),
    }
    history.append(
        {
            "id": "2026-11-22-team-and-revision",
            "date": "2026-11-22",
            "source": ("Réponses directes du porteur aux questions de relecture et d’affectation"),
            "developer_names_received": [
                "Ouoba",
                "Abdou",
                "Rasmané",
                "limata",
                "Oumou",
            ],
            "assignment_rule": "Ordre de la liste, D1 à D5",
            "product_feedback_received": "modifications préciser a apporter",
            "previous_product_review": previous_review,
        }
    )
    target.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Nominations et demande de modifications enregistrées.")
else:
    print("Réponse déjà enregistrée ; registre préservé.")
