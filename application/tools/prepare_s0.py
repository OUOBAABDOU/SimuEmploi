"""Build S0 review material without changing application code or human evidence."""

import json
import re
from copy import deepcopy
from pathlib import Path

from adaptive_mock import adapt_reference

ROOT = Path(__file__).resolve().parents[2]
DOSSIER = ROOT / "application/docs/sprints/S0-cloture"
DOSSIER.mkdir(parents=True, exist_ok=True)
(DOSSIER / "maquettes").mkdir(exist_ok=True)


def write_json(path: Path, value: object) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


source = ROOT / "application/backend/src/simuemploi/catalog/examples.json"
records = json.loads(source.read_text(encoding="utf-8"))
corpus = deepcopy([row["scenario"] for row in records if row["visibility"] == "published"])
for scenario in corpus:
    scenario["version"] = 3
    scenario["content_status"] = "example_pending_review"
    scenario["review_status"] = "technical_review_complete_human_review_pending"
    scenario["review_version"] = "S0-0.4"
    scenario["questions_role"] = "initial_question_and_reference_bank_not_fixed_sequence"
    scenario["interview_policy"] = {
        "version": 1,
        "mode": "adaptive",
        "main_axes": 5,
        "max_questions": 7,
        "max_clarifications": 2,
        "first_question_key": scenario["questions"][0]["key"],
        "context_required": ["previous_question", "previous_answer"],
        "question_snapshot_required": True,
    }
    for question in scenario["questions"]:
        question["response_kind"] = (
            "real_example" if "concrete_example" in question["criteria"] else "explanation"
        )

corpus[0]["questions"][3]["criteria"] = ["relevance", "clarity"]
corpus[0]["questions"][3]["response_kind"] = "hypothetical_approach"
corpus[0]["questions"][2]["response_kind"] = "hypothetical_approach"
corpus[1]["questions"][2]["response_kind"] = "hypothetical_approach"
corpus[2]["questions"][3]["criteria"] = ["relevance", "clarity"]
corpus[2]["questions"][3]["response_kind"] = "explanation"
write_json(DOSSIER / "corpus-relecture.json", corpus)

tasks = [
    {
        "id": "T01",
        "instruction": "Expliquez avec vos mots à quoi sert SimuEmploi et sa limite.",
    },
    {
        "id": "T02",
        "instruction": "Choisissez un exercice pour un premier stage ou emploi.",
    },
    {
        "id": "T03",
        "instruction": "Préparez puis saisissez une réponse fictive et trouvez l’aide.",
    },
    {
        "id": "T04",
        "instruction": "Pendant une coupure simulée, expliquez où se trouve votre brouillon.",
    },
    {
        "id": "T05",
        "instruction": "Faites une pause, revenez à l’accueil puis retrouvez la réponse.",
    },
    {
        "id": "T06",
        "instruction": "Expliquez la différence entre réponse conservée et retour indisponible.",
    },
    {
        "id": "T07",
        "instruction": "Lisez un rapport partiel et choisissez un point à retravailler.",
    },
    {"id": "T08", "instruction": "Trouvez la demande de suppression puis annulez-la."},
    {
        "id": "T09",
        "instruction": (
            "Observez le lien de la question suivante avec la question "
            "et votre réponse précédentes."
        ),
    },
    {
        "id": "T10",
        "instruction": (
            "Si la question suivante est indisponible, retrouvez votre réponse "
            "et la possibilité de réessayer."
        ),
    },
]
write_json(DOSSIER / "taches-essai.json", tasks)

# Do not reset observations or approvals when the preparation tool is rerun.
evidence_path = DOSSIER / "preuves-humaines.json"
if not evidence_path.exists():
    roles = {
        key: {
            "name": "",
            "availability_hours_per_sprint": None,
            "scope_acknowledged": False,
        }
        for key in ["D1", "D2", "D3", "D4", "D5"]
    }
    write_json(
        evidence_path,
        {
            "schema_version": "S0-0.4",
            "reference_version": "S0-0.4",
            "responsible_product": "OUOBA Abdou Rasmané",
            "responsible_business_review": "OUOBA Abdou Rasmané",
            "team_coordinator": "OUOBA Abdou Rasmané",
            "nomination_source": "Réponse du porteur dans ce chat, 22 novembre 2026",
            "candidate_sessions_possible": True,
            "nomination_note": (
                "Les noms des cinq développeurs ne sont pas fournis ; D1–D5 restent des places."
            ),
            "developers": roles,
            "business_reviews": [
                {
                    "scenario_id": scenario["id"],
                    "scenario_version": 3,
                    "reviewer": "",
                    "reviewed_at": "",
                    "verdict": "pending",
                    "notes": "",
                }
                for scenario in corpus
            ],
            "participant_sessions": [],
            "findings": [],
            "product_review": {
                "reviewer": "",
                "reviewed_at": "",
                "verdict": "pending",
                "notes": "",
            },
            "decisions_review": {
                "reviewer": "",
                "reviewed_at": "",
                "verdict": "pending",
                "notes": "",
            },
            "backlog_review": {
                "reviewer": "",
                "reviewed_at": "",
                "verdict": "pending",
                "notes": "",
            },
        },
    )

# Earlier mockups are our own design references. Adapt a copy, preserving originals.
fragment = (ROOT / "maquettes/simuemploi-candidat.fragment.html").read_text(encoding="utf-8")
names = [scenario["title"] for scenario in corpus]
old_names = [
    "Premier entretien de stage",
    "Service client",
    "Présentation professionnelle",
]
for old, new in zip(old_names, names, strict=True):
    fragment = fragment.replace(old, new)
exercises = [
    {
        "name": scenario["title"],
        "domain": "Présentation de mon parcours"
        if scenario["domain"] == "presentation"
        else "Premier emploi ou stage",
        "art": "progresser" if scenario["domain"] == "presentation" else "preparer",
        "goal": scenario["summary"],
        "questions": [q["prompt"] for q in scenario["questions"]],
    }
    for scenario in corpus
]
fragment = re.sub(
    r"const exercises = \[.*?\n  \];",
    "const exercises = " + json.dumps(exercises, ensure_ascii=False) + ";",
    fragment,
    count=1,
    flags=re.DOTALL,
)
guidance = {
    scenario["title"]: [q["guidance"] for q in scenario["questions"]] for scenario in corpus
}
new_framework = (
    "function framework(v) { const tips = "
    + json.dumps(guidance, ensure_ascii=False)
    + '; return `<details class="se-help"><summary>Aide pour cette question</summary>'
    + '<div class="se-help-content"><ol>${(tips[v.scenario]?.[v.question-1]||[])'
    + ".map(t=>`<li>${esc(t)}</li>`).join('')}</ol><p>Utilisez vos propres mots. "
    + "Un exemple peut venir de l’école, d’une activité personnelle "
    + "ou informelle.</p></div></details>`; }\n  "
)
fragment = re.sub(
    r"function framework\(v\) \{.*?\n  function exerciseCard",
    new_framework + "function exerciseCard",
    fragment,
    count=1,
    flags=re.DOTALL,
)
fragment = re.sub(r"v.answer.trim\(\).length\s*<\s*\d+", "!v.answer.trim()", fragment)
fragment = fragment.replace(
    "Votre réponse est trop courte pour cet exemple. "
    "Ajoutez un contexte et expliquez votre démarche.",
    "Saisissez une réponse avant de valider.",
)
fragment = fragment.replace(
    "Racontez une expérience avec clarté", "Préparez votre premier stage ou emploi"
)
fragment = fragment.replace(
    "Ouvrir le compte d’exemple Aminata", "Ouvrir le compte fictif de la maquette"
)
fragment = fragment.replace(
    "Vos réponses vous appartiennent.", "Maquette de coaching privé · données fictives."
)
fragment = adapt_reference(fragment)


def shell(body: str, title: str, variants: list[tuple[str, str]]) -> str:
    options = "".join(
        f'<option value="{identifier}">{label}</option>' for identifier, label in variants
    )
    extra = """<script>document.querySelector('#review-variant').addEventListener('change', e => {
      document.querySelectorAll('[data-variant]').forEach(s => {
        s.hidden = !s.querySelector('#'+e.target.value);
      });
      dispatchEvent(new Event('resize'));
    });</script>"""
    return (
        '<!doctype html><html lang="fr"><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        f"<title>{title}</title><style>body{{margin:0;padding:16px;font-family:system-ui;"
        "background:#f4f8f4;color:#183d34;}[hidden]{display:none!important}"
        ".review-banner{padding:14px;background:#fff3dc;border:1px solid #d7b178;"
        "border-radius:10px;margin-bottom:14px;line-height:1.6;font-size:14px}"
        "select,button{min-height:44px;font:inherit;max-width:100%}*{box-sizing:border-box}"
        '</style><body><div class="review-banner"><strong>S0 — MAQUETTE DE RELECTURE.</strong> '
        "Aucun compte, sauvegarde serveur, retour IA, micro ou caméra réels. "
        "Les réponses de démonstration restent en mémoire et sont perdues à l’actualisation. "
        f'<a href="../atelier.html">Retour à l’atelier</a><br><label>Présentation '
        f'<select id="review-variant">{options}</select></label></div>'
        + body
        + extra
        + "</body></html>"
    )


(DOSSIER / "maquettes/candidat.html").write_text(
    shell(
        fragment,
        "S0 — maquette candidat à relire",
        [("se-guided", "Parcours guidé"), ("se-autonomous", "Espace autonome")],
    ),
    encoding="utf-8",
)
media = (ROOT / "maquettes/simuemploi-entretiens-medias.fragment.html").read_text(encoding="utf-8")
media = (
    '<div class="review-banner"><strong>Référence des futurs parcours médias.</strong> '
    "Les cinq tours préécrits illustrent les écrans de capture et de relecture ; "
    "ils ne définissent pas la séquence du produit adaptatif. "
    "La future question sera liée au tour précédent et à la transcription confirmée. "
    '<a href="../07_ENTRETIEN_ADAPTATIF_ET_MULTI_IA.md">Lire le contrat S0-0.4</a>.</div>' + media
)
(DOSSIER / "maquettes/medias.html").write_text(
    shell(
        media,
        "S0 — référence audio/vidéo future",
        [("sm-audio", "Audio"), ("sm-video", "Vidéo")],
    ),
    encoding="utf-8",
)

# Embed review data for direct file:// use with no server or data transmission.
write_json(
    DOSSIER / "donnees-atelier.json",
    {
        "corpus": corpus,
        "tasks": tasks,
        "evidence": json.loads(evidence_path.read_text(encoding="utf-8")),
    },
)
template = DOSSIER / "atelier.template.html"
if template.exists():
    embedded = (DOSSIER / "donnees-atelier.json").read_text(encoding="utf-8")
    (DOSSIER / "atelier.html").write_text(
        template.read_text(encoding="utf-8").replace(
            "__S0_DATA__", embedded.replace("<", "\\u003c")
        ),
        encoding="utf-8",
    )
print("S0 : corpus et maquettes préparés ; preuves humaines préservées.")
