"""Refresh the local S0 studio from saved sources without changing evidence."""

import json
from pathlib import Path

DOSSIER = Path(__file__).resolve().parents[1] / "docs/sprints/S0-cloture"


def refresh() -> None:
    sources = {
        "corpus": "corpus-relecture.json",
        "tasks": "taches-essai.json",
        "evidence": "preuves-humaines.json",
    }
    data = {
        key: json.loads((DOSSIER / name).read_text(encoding="utf-8"))
        for key, name in sources.items()
    }
    serialized = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    template = (DOSSIER / "atelier.template.html").read_text(encoding="utf-8")
    if template.count("__S0_DATA__") != 1:
        raise ValueError(
            "Le modèle de l’atelier doit contenir un emplacement de données."
        )
    (DOSSIER / "donnees-atelier.json").write_text(serialized, encoding="utf-8")
    (DOSSIER / "atelier.html").write_text(
        template.replace("__S0_DATA__", serialized.replace("<", "\\u003c")),
        encoding="utf-8",
    )


if __name__ == "__main__":
    refresh()
    print("Atelier S0 actualisé ; preuves humaines conservées.")
