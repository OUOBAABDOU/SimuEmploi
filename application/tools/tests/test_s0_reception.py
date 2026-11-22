"""Synthetic validation tests; these records never become human S0 evidence."""

import importlib.util
import json
from copy import deepcopy
from datetime import UTC, datetime
from pathlib import Path

import pytest

TOOLS = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("s0_checker", TOOLS / "verifier_s0.py")
assert spec and spec.loader
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)
CORPUS = json.loads((checker.DOSSIER / "corpus-relecture.json").read_text(encoding="utf-8"))


def synthetic_complete_evidence() -> dict:
    evidence = json.loads((checker.DOSSIER / "preuves-humaines.json").read_text(encoding="utf-8"))
    today = datetime.now(UTC).date().isoformat()
    for key, role in evidence["developers"].items():
        role.update(
            name=f"SYNTHETIC-{key}",
            availability_hours_per_sprint=24,
            scope_acknowledged=True,
        )
    for review in evidence["business_reviews"]:
        review.update(
            reviewer="SYNTHETIC",
            reviewed_at=today,
            verdict="approved",
            notes="Test only",
        )
    for key in ["product_review", "decisions_review", "backlog_review"]:
        evidence[key].update(
            reviewer="SYNTHETIC",
            reviewed_at=today,
            verdict="approved",
            notes="Test only",
        )
    evidence["participant_sessions"] = [
        {
            "participant_code": f"SYNTHETIC-{i}",
            "facilitator": "SYNTHETIC",
            "observed_at": today,
            "device": "Synthetic device",
            "objective": "internship",
            "participation_agreed": True,
            "summary": "Synthetic fixture, never a real observation",
            "tasks": [
                {
                    "id": f"T{n:02}",
                    "outcome": "success",
                    "observation": "Synthetic test",
                }
                for n in range(1, 11)
            ],
        }
        for i in range(3)
    ]
    return evidence


def test_named_sponsor_does_not_replace_reviews_or_candidates() -> None:
    current = json.loads((checker.DOSSIER / "preuves-humaines.json").read_text(encoding="utf-8"))
    # The invariant is independent of real reviews subsequently received in the chat.
    for review in current["business_reviews"]:
        review.update(reviewer="", reviewed_at="", verdict="pending", notes="")
    for developer in current["developers"].values():
        developer["scope_acknowledged"] = False
    missing = checker.human_evidence(current, CORPUS)
    assert any("Essais" in item for item in missing)
    assert any("Avis métier" in item for item in missing)
    assert any("D1" in item for item in missing)


def test_business_and_design_approval_do_not_receive_s0_without_trials() -> None:
    evidence = synthetic_complete_evidence()
    evidence["participant_sessions"] = []
    evidence["product_review"].update(verdict="pending", reviewed_at="", reviewer="")
    missing = checker.human_evidence(evidence, CORPUS)
    assert not any("Avis métier" in item or "contrats/décisions" in item for item in missing)
    assert any("Essais" in item for item in missing)
    assert any("référence produit et essais" in item for item in missing)


def test_placeholder_sessions_without_observations_are_not_counted() -> None:
    evidence = synthetic_complete_evidence()
    for session in evidence["participant_sessions"]:
        session["participation_agreed"] = False
        session["tasks"][0]["outcome"] = "not_run"
    assert any("Essais" in item for item in checker.human_evidence(evidence, CORPUS))


def test_repeated_code_does_not_count_as_three_people() -> None:
    evidence = synthetic_complete_evidence()
    evidence["participant_sessions"] = [
        deepcopy(evidence["participant_sessions"][0]) for _ in range(3)
    ]
    assert any("Essais" in item for item in checker.human_evidence(evidence, CORPUS))


def test_spaced_codes_and_blank_metadata_do_not_validate_three_candidates() -> None:
    evidence = synthetic_complete_evidence()
    evidence["participant_sessions"][1]["participant_code"] = " SYNTHETIC-0 "
    evidence["participant_sessions"][2]["facilitator"] = "   "
    missing = checker.human_evidence(evidence, CORPUS)
    assert any("1/3" in item for item in missing)
    assert any("même code" in item for item in missing)


@pytest.mark.parametrize("invalid", [None, "", "   "])
def test_empty_reviewer_cannot_approve(invalid: str | None) -> None:
    evidence = synthetic_complete_evidence()
    evidence["business_reviews"][0]["reviewer"] = invalid
    assert any("Avis métier" in item for item in checker.human_evidence(evidence, CORPUS))


def test_critical_issue_cannot_be_accepted_as_an_unresolved_limit() -> None:
    evidence = synthetic_complete_evidence()
    assert not checker.human_evidence(evidence, CORPUS)
    evidence["findings"] = [
        {
            "id": "SYNTHETIC-F1",
            "severity": "critical",
            "status": "accepted",
            "description": "Synthetic critical issue",
            "owner": "SYNTHETIC",
            "retest_notes": "Synthetic exception",
        }
    ]
    assert any("critique" in item for item in checker.human_evidence(evidence, CORPUS))
    evidence["findings"][0].update(status="resolved", retest_notes="")
    assert checker.human_evidence(evidence, CORPUS)
