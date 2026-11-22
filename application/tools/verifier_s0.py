"""Check S0 material and declared human evidence separately; never invent approval."""

import argparse
import ast
import json
import re
from datetime import UTC, date, datetime
from pathlib import Path
from typing import Any

from simuemploi.catalog.models import ScenarioDetail

ROOT = Path(__file__).resolve().parents[2]
DOSSIER = ROOT / "application/docs/sprints/S0-cloture"
VERSION = "S0-0.4"


def dated(value: Any) -> bool:
    try:
        return bool(value) and date.fromisoformat(value) <= datetime.now(UTC).date()
    except (TypeError, ValueError):
        return False


def complete_review(value: dict[str, Any]) -> bool:
    reviewer = value.get("reviewer")
    notes = value.get("notes")
    return (
        value.get("verdict") == "approved"
        and isinstance(reviewer, str)
        and bool(reviewer.strip())
        and dated(value.get("reviewed_at"))
        and isinstance(notes, str)
        and bool(notes.strip())
    )


def nonblank(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def preparation() -> list[str]:
    errors = []
    required = [
        "README.md",
        "01_RELECTURE_METIER.md",
        "02_PARCOURS_ET_CONTRATS.md",
        "03_PROTOCOLE_ESSAIS.md",
        "04_RESPONSABLES_DECISIONS_BACKLOG.md",
        "05_RECEPTION.md",
        "corpus-relecture.json",
        "taches-essai.json",
        "preuves-humaines.json",
        "atelier.html",
        "atelier.js",
        "atelier.css",
        "maquettes/candidat.html",
        "maquettes/medias.html",
        "07_ENTRETIEN_ADAPTATIF_ET_MULTI_IA.md",
        "08_IMPACTS_ET_CAPACITE.md",
        "question-candidate.schema.json",
        "ai-registry.example.json",
        "09_FOURNISSEURS_IA_ET_UTILISATION_API.md",
        "ai-routing.proposal.json",
    ]
    for name in required:
        if not (DOSSIER / name).is_file():
            errors.append(f"Livrable manquant : {name}")
    if errors:
        return errors
    routing = json.loads((DOSSIER / "ai-routing.proposal.json").read_text(encoding="utf-8"))
    if routing.get("execution_enabled") or routing.get("production_configuration_complete"):
        errors.append("La configuration API S0 doit rester explicitement inactive.")
    for provider in routing.get("providers", []):
        if (
            provider.get("enabled")
            or provider.get("qualified_capabilities")
            or provider.get("model_id") is not None
            or provider.get("secret_reference") is not None
        ):
            errors.append("Un candidat API de S0 est annoncé actif ou qualifié sans réalisation.")
    guide = (DOSSIER / "09_FOURNISSEURS_IA_ET_UTILISATION_API.md").read_text("utf-8")
    examples = re.findall(r"```python\n(.*?)\n```", guide, flags=re.DOTALL)
    if not examples:
        errors.append("Exemple Python conceptuel de l’addendum API absent.")
    for example in examples:
        try:
            ast.parse(example)
        except SyntaxError:
            errors.append("Syntaxe Python invalide dans l’addendum API.")
    corpus = json.loads((DOSSIER / "corpus-relecture.json").read_text(encoding="utf-8"))
    if len(corpus) != 3 or sum(len(item["questions"]) for item in corpus) != 15:
        errors.append(
            "Le corpus doit contenir trois banques de cinq questions et leur politique adaptative."
        )
    for item in corpus:
        policy = item.get("interview_policy", {})
        if policy.get("mode") != "adaptive" or policy.get("max_questions") != 7:
            errors.append("Politique adaptative ou limite de tours manquante.")
        if policy.get("context_required") != ["previous_question", "previous_answer"]:
            errors.append("La génération doit utiliser le couple question/réponse précédent.")
        candidate = {
            key: value for key, value in item.items() if key in ScenarioDetail.model_fields
        }
        candidate["questions"] = [
            {key: value for key, value in q.items() if key != "response_kind"}
            for q in item["questions"]
        ]
        ScenarioDetail.model_validate(candidate)
        if (
            item["version"] != 3
            or item["review_status"] != "technical_review_complete_human_review_pending"
        ):
            errors.append("Version ou état de relecture du corpus incohérent.")
        for question in item["questions"]:
            if (
                question["response_kind"] == "hypothetical_approach"
                and "concrete_example" in question["criteria"]
            ):
                errors.append(f"Exemple réel exigé pour démarche hypothétique : {question['key']}")
    qa_file = DOSSIER / "verification-maquettes.json"
    if not qa_file.exists():
        errors.append("Recette des maquettes S0-0.4 non exécutée.")
    else:
        qa = json.loads(qa_file.read_text(encoding="utf-8"))
        if qa.get("reference_version") != VERSION or qa.get("status") != "passed":
            errors.append("La recette des maquettes n’est pas conforme à la référence.")
    return errors


def human_evidence(evidence: dict[str, Any], corpus: list[dict[str, Any]]) -> list[str]:
    missing = []
    if evidence.get("schema_version") != VERSION or evidence.get("reference_version") != VERSION:
        missing.append("Référence des preuves différente de S0-0.4.")
    for role in [
        "responsible_product",
        "responsible_business_review",
        "team_coordinator",
    ]:
        if not str(evidence.get(role, "")).strip():
            missing.append(f"Responsable non nommé : {role}.")
    developers = evidence.get("developers", {})
    for key in ["D1", "D2", "D3", "D4", "D5"]:
        role = developers.get(key, {})
        hours = role.get("availability_hours_per_sprint")
        pending = []
        if not role.get("name"):
            pending.append("nom")
        if type(hours) not in {int, float} or not 0 < hours <= 80:
            pending.append("disponibilité réelle")
        if not role.get("scope_acknowledged"):
            pending.append("compréhension du périmètre")
        if pending:
            missing.append(f"{key} : {', '.join(pending)} à confirmer.")
    reviews = evidence.get("business_reviews", [])
    for scenario in corpus:
        matching = [
            r
            for r in reviews
            if r.get("scenario_id") == scenario["id"] and r.get("scenario_version") == 3
        ]
        if len(matching) != 1 or not complete_review(matching[0]):
            missing.append(f"Avis métier daté sur version 3 à recevoir : {scenario['title']}.")
    sessions = evidence.get("participant_sessions", [])
    tasks = {f"T{i:02}" for i in range(1, 11)}
    valid_codes = []
    failed_tasks = []
    for session in sessions:
        entries = session.get("tasks", [])
        complete = (
            session.get("participation_agreed") is True
            and dated(session.get("observed_at"))
            and nonblank(session.get("facilitator"))
            and nonblank(session.get("device"))
            and session.get("objective") in {"internship", "first_job"}
            and nonblank(session.get("summary"))
            and nonblank(session.get("participant_code"))
            and len(entries) == 10
            and {t.get("id") for t in entries} == tasks
            and all(
                t.get("outcome") in {"success", "assisted", "failed"}
                and bool(str(t.get("observation", "")).strip())
                for t in entries
            )
        )
        if complete:
            valid_codes.append(session["participant_code"].strip())
            failed_tasks.extend(t["id"] for t in entries if t["outcome"] == "failed")
    if len(set(valid_codes)) < 3:
        missing.append(
            f"Essais réels exploitables : {len(set(valid_codes))}/3 minimum proposé, cible cinq."
        )
    if len(valid_codes) != len(set(valid_codes)):
        missing.append(
            "Deux séances complètes utilisent le même code participant ; vérifier les identifiants."
        )
    findings = evidence.get("findings", [])
    if failed_tasks and not findings:
        missing.append(
            "Des tâches ont échoué sans difficulté ni décision de traitement consignées."
        )
    for finding in findings:
        if finding.get("severity") not in {"critical", "major", "minor"} or finding.get(
            "status"
        ) not in {"open", "resolved", "accepted"}:
            missing.append(f"Gravité ou état de difficulté invalide : {finding.get('id', '?')}.")
        if not finding.get("description") or not finding.get("owner"):
            missing.append(
                f"Difficulté sans description ou responsable : {finding.get('id', '?')}."
            )
        if finding.get("severity") == "critical" and finding.get("status") != "resolved":
            missing.append(f"Difficulté critique non résolue : {finding.get('id', '?')}.")
        if finding.get("status") in {"resolved", "accepted"} and not finding.get("retest_notes"):
            missing.append(
                f"Correction/acceptation sans justification ou nouvel essai : "
                f"{finding.get('id', '?')}."
            )
    for key, label in [
        ("decisions_review", "contrats/décisions"),
        ("backlog_review", "backlog/capacité"),
        ("product_review", "référence produit et essais"),
    ]:
        review = evidence.get(key, {})
        if review.get("verdict") == "revise":
            missing.append(
                f"{label} : modifications demandées ; traitement et approbation à confirmer."
            )
        elif not complete_review(review):
            missing.append(f"Avis responsable sur {label} à recevoir.")
    return missing


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--evidence", type=Path, default=DOSSIER / "preuves-humaines.json")
    args = parser.parse_args()
    prep = preparation()
    corpus = json.loads((DOSSIER / "corpus-relecture.json").read_text(encoding="utf-8"))
    evidence = json.loads(args.evidence.read_text(encoding="utf-8"))
    missing = human_evidence(evidence, corpus)
    prepared = not prep
    accepted = prepared and not missing
    now = datetime.now(UTC).isoformat()
    (DOSSIER / "verification-preparation.json").write_text(
        json.dumps(
            {
                "checked_at": now,
                "reference_version": VERSION,
                "addendum_version": "API-0.1",
                "status": "passed" if prepared else "incomplete",
                "issues": prep,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    report = {
        "checked_at": now,
        "reference_version": VERSION,
        "addendum_version": "API-0.1",
        "status": "received"
        if accepted
        else "awaiting_human_evidence"
        if prepared
        else "preparation_incomplete",
        "preparation_complete": prepared,
        "s0_received": accepted,
        "evidence_source": str(args.evidence),
        "missing_human_evidence": missing,
        "scope": (
            "Complétude des déclarations ; authenticité et réalité des séances "
            "à attester par le responsable produit."
        ),
        "other_sprints_allowed_by_this_gate": accepted,
    }
    (DOSSIER / "etat-reception.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(report, ensure_ascii=True, indent=2))
    raise SystemExit(0 if accepted else 2)


if __name__ == "__main__":
    main()
