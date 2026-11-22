"""Record the sponsor's explicit business/design reviews without receiving S0."""

import json
from copy import deepcopy

from refresh_s0_studio import DOSSIER, refresh


def main() -> None:
    target = DOSSIER / "preuves-humaines.json"
    evidence = json.loads(target.read_text(encoding="utf-8"))
    corpus = json.loads((DOSSIER / "corpus-relecture.json").read_text(encoding="utf-8"))
    if evidence.get("reference_version") != "S0-0.4":
        raise ValueError("Les approbations reçues concernent la référence S0-0.4.")
    event_id = "2026-11-22-business-and-design-approved"
    if not any(item.get("id") == event_id for item in evidence.get("history", [])):
        if len(corpus) != 3 or any(item["version"] != 3 for item in corpus):
            raise ValueError("L’approbation concerne les trois banques de version 3.")
        evidence.setdefault("history", []).append(
            {
                "id": event_id,
                "date": "2026-11-22",
                "source": "Deux réponses directes du porteur dans ce chat",
                "business_reply_received": "J’approuve les trois banques après lecture",
                "design_reply_received": ("J’approuve cette référence de conception après lecture"),
                "reference_version": "S0-0.4",
                "addendum_version": "API-0.1",
                "scope": (
                    "Trois banques v3 avec aides, critères et limites adaptatives ; "
                    "référence de conception IA/API et parcours/contrats. "
                    "Offre, modèle, budget et politique de données encore ouverts. "
                    "Aucun avis sur les essais ou réception finale n’est reçu."
                ),
                "previous_business_reviews": deepcopy(evidence["business_reviews"]),
                "previous_decisions_review": deepcopy(evidence["decisions_review"]),
                "previous_product_review": deepcopy(evidence["product_review"]),
            }
        )
        for review in evidence["business_reviews"]:
            scenario = next(item for item in corpus if item["id"] == review["scenario_id"])
            if review["scenario_version"] != 3:
                raise ValueError("Version de banque incompatible avec l’approbation.")
            review.update(
                reviewer="OUOBA Abdou Rasmané",
                reviewed_at="2026-11-22",
                verdict="approved",
                notes=(
                    f"Approbation explicite reçue pour « {scenario['title']} », "
                    "banque version 3 / S0-0.4 : questions, aides, critères et limites "
                    "adaptatives. Réponse : « J’approuve les trois banques après lecture ». "
                    "Ne qualifie pas les sorties futures d’un modèle IA."
                ),
            )
        evidence["decisions_review"].update(
            reviewer="OUOBA Abdou Rasmané",
            reviewed_at="2026-11-22",
            verdict="approved",
            notes=(
                "Approbation explicite de la référence de conception S0-0.4 : "
                "étape IA/API et document Parcours et contrats. Réponse reçue : "
                "« J’approuve cette référence de conception après lecture ». "
                "AgentRouter est le premier candidat à qualifier ; l’offre, le modèle, "
                "le budget et la politique de données restent ouverts jusqu’à qualification. "
                "Les appels sont inactifs ; les essais candidats, le backlog/capacité "
                "et la réception finale ne sont pas approuvés par cet avis."
            ),
        )
        evidence["design_review"] = {
            **deepcopy(evidence["decisions_review"]),
            "reference_version": "S0-0.4",
            "addendum_version": "API-0.1",
            "source": "Réponse directe du porteur dans ce chat le 22 novembre 2026",
        }
        evidence["product_review"].update(
            reviewer="",
            reviewed_at="",
            verdict="pending",
            notes=(
                "Référence de conception et trois banques approuvées le 22/11/2026. "
                "La demande de modifications fournisseurs/API est traitée dans cette "
                "référence approuvée. Cet avis final attend les séances réelles, "
                "les corrections et leur examen ; aucune réception de S0 n’est déclarée."
            ),
        )
        evidence["nomination_note"] = (
            "Ouoba, Abdou, Rasmané, limata, Oumou affectés D1–D5 ; 24 h chacun. "
            "Trois banques v3 et référence de conception S0-0.4 approuvées le 22/11/2026. "
            "Compréhension des périmètres, backlog/capacité, essais et réception finale "
            "restent à confirmer."
        )
        target.write_text(
            json.dumps(evidence, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
    refresh()
    print("Trois avis métier et conception approuvés ; essais et réception S0 en attente.")


if __name__ == "__main__":
    main()
