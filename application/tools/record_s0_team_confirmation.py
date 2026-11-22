"""Record the coordinator's scope/backlog confirmation without receiving S0."""

import json
from copy import deepcopy

from refresh_s0_studio import DOSSIER, refresh


def main() -> None:
    target = DOSSIER / "preuves-humaines.json"
    evidence = json.loads(target.read_text(encoding="utf-8"))
    if evidence.get("reference_version") != "S0-0.4":
        raise ValueError("La confirmation concerne la référence S0-0.4.")
    event_id = "2026-11-22-team-scopes-and-backlog-confirmed"
    if not any(item.get("id") == event_id for item in evidence.get("history", [])):
        evidence.setdefault("history", []).append(
            {
                "id": event_id,
                "date": "2026-11-22",
                "source": "Réponse directe du porteur dans ce chat : tout est bon",
                "question_scope": (
                    "Après échange avec les cinq développeurs : confirmation de leurs "
                    "périmètres et ajustements demandés au backlog S0 estimé."
                ),
                "reply_received": "tout est bon",
                "interpretation": (
                    "Périmètres D1–D5 et backlog confirmés par le coordinateur, "
                    "sans ajustement demandé. Aucun résultat d’essai ni réception finale."
                ),
                "previous_developers": deepcopy(evidence["developers"]),
                "previous_backlog_review": deepcopy(evidence["backlog_review"]),
            }
        )
        for developer in evidence["developers"].values():
            developer.update(
                scope_acknowledged=True,
                scope_confirmed_at="2026-11-22",
                scope_confirmation_by="OUOBA Abdou Rasmané, coordinateur",
                scope_confirmation_source=(
                    "Confirmation rapportée par le coordinateur dans ce chat : tout est bon"
                ),
            )
        evidence["backlog_review"].update(
            reviewer="OUOBA Abdou Rasmané",
            reviewed_at="2026-11-22",
            verdict="approved",
            notes=(
                "Réponse « tout est bon » à la question sur les confirmations des cinq "
                "périmètres et les ajustements du backlog S0 estimé, après échange avec "
                "l’équipe. Aucun ajustement demandé. Estimation de référence : 59 h "
                "réparties D1 8 h, D2 13 h, D3 11 h, D4 15 h, D5 12 h, sous capacité "
                "de 24 h chacun / 120 h brutes par sprint. Ce sont des estimations "
                "acceptées, pas des heures consommées ni une garantie de date. "
                "Les corrections issues des essais seront réestimées si nécessaire."
            ),
        )
        evidence["nomination_note"] = (
            "Ouoba, Abdou, Rasmané, limata, Oumou affectés D1–D5 ; 24 h chacun. "
            "Les trois banques v3, la conception S0-0.4 et le backlog sont approuvés. "
            "Le coordinateur confirme les cinq périmètres le 22/11/2026. "
            "Les essais candidats et la réception finale restent à recevoir."
        )
        target.write_text(
            json.dumps(evidence, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
    refresh()
    print("Périmètres D1–D5 et backlog confirmés ; essais et réception S0 en attente.")


if __name__ == "__main__":
    main()
