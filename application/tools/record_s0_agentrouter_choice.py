"""Record the sponsor's explicit candidate priority and planned test date."""

import json
from copy import deepcopy

from refresh_s0_studio import DOSSIER, refresh


def main() -> None:
    evidence_path = DOSSIER / "preuves-humaines.json"
    routing_path = DOSSIER / "ai-routing.proposal.json"
    evidence = json.loads(evidence_path.read_text(encoding="utf-8"))
    routing = json.loads(routing_path.read_text(encoding="utf-8"))
    if evidence.get("reference_version") != "S0-0.4":
        raise ValueError("Ces réponses concernent la référence S0-0.4.")
    event_id = "2026-11-22-agentrouter-priority-and-test-plan"
    if not any(item.get("id") == event_id for item in evidence.get("history", [])):
        evidence.setdefault("history", []).append(
            {
                "id": event_id,
                "date": "2026-11-22",
                "source": "Deux réponses directes du porteur dans ce chat",
                "api_reply_received": (
                    "AgentRouter comme premier candidat à qualifier (recommandé)"
                ),
                "test_date_reply_received": "22/11/2026",
                "scope": (
                    "Priorité de qualification texte et date prévue de la première boucle "
                    "de trois essais ; aucun résultat ni avis de réception reçu."
                ),
                "previous_routing_proposal": deepcopy(routing["routing_proposal"]),
                "previous_external_router_variant": deepcopy(
                    routing["external_router_variant"]
                ),
            }
        )
        evidence["api_qualification_plan"] = {
            "primary_candidate": "agentrouter_external",
            "candidate_label": "AgentRouter",
            "candidate_priority_confirmed": True,
            "decision_by": "OUOBA Abdou Rasmané",
            "decision_date": "2026-11-22",
            "candidate_capabilities": [
                "next_question",
                "evaluate_answer",
                "build_report",
            ],
            "qualification_status": "not_started",
            "approved_endpoint": None,
            "model_id": None,
            "budget": None,
            "data_policy_approved": False,
            "execution_enabled": False,
        }
        evidence["candidate_test_plan"] = {
            "planned_date": "2026-11-22",
            "target_participants": 3,
            "status": "planned_no_observations_received",
            "planning_source": "Réponse directe du porteur : 22/11/2026",
            "notes": "Les dates observées et résultats seront saisis après les séances réelles.",
        }
        routing["candidate_priority_source"] = (
            "AgentRouter prioritaire pour qualification texte, réponse du porteur du 22/11/2026"
        )
        routing["providers"].append(
            {
                "id": "agentrouter_external",
                "vendor": "AgentRouter",
                "adapter_protocol": "chat_completions_compatibility_to_verify",
                "status": "prioritized_for_qualification",
                "candidate_capabilities": [
                    "next_question",
                    "evaluate_answer",
                    "build_report",
                ],
                "enabled": False,
                "qualified_capabilities": [],
                "approved_endpoint": None,
                "model_id": None,
                "secret_reference": None,
                "data_policy_approved": False,
                "account_access_verified": False,
            }
        )
        for capacity in ["next_question", "evaluate_answer", "build_report"]:
            routing["routing_proposal"][capacity]["primary_candidate"] = (
                "agentrouter_external"
            )
        routing["external_router_variant"].update(
            candidate="AgentRouter",
            prioritized_for_qualification=True,
            selected=False,
            enabled=False,
            require_all_request_parameters=True,
            account_offer_confirmed=False,
            status="candidate_priority_confirmed_service_not_qualified",
        )
        for path, value in [(evidence_path, evidence), (routing_path, routing)]:
            path.write_text(
                json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
            )
    event = next(item for item in evidence["history"] if item.get("id") == event_id)
    if "previous_product_review" not in event:
        event["previous_product_review"] = deepcopy(evidence["product_review"])
        if evidence["product_review"]["verdict"] == "revise":
            evidence["product_review"]["notes"] = (
                "Les modifications fournisseurs/API ont donné lieu à l’addendum API-0.1 "
                "et à l’étude AgentRouter. Le porteur confirme AgentRouter comme premier "
                "candidat à qualifier pour le texte et prévoit trois essais le 22/11/2026. "
                "L’offre, le modèle, le budget et la politique de données restent ouverts. "
                "Aucune approbation globale, relecture métier ou séance réalisée n’est déduite."
            )
        evidence_path.write_text(
            json.dumps(evidence, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
    refresh()
    print(
        "AgentRouter prioritaire ; essais prévus le 22/11/2026 ; aucun appel ni résultat créé."
    )


if __name__ == "__main__":
    main()
