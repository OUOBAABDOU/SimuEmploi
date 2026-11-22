"""Capture the tested dependency environment without local paths or editable installs."""

from importlib.metadata import distributions
from pathlib import Path

target = Path(__file__).resolve().parents[1] / "backend" / "requirements-dev.lock.txt"
excluded = {"pip", "setuptools", "simuemploi-backend"}
packages = sorted(
    f"{distribution.metadata['Name']}=={distribution.version}"
    for distribution in distributions()
    if distribution.metadata["Name"].lower() not in excluded
)
target.write_text(
    "# Tested on Python 3.12.14 / Windows, 2026-11-21.\n"
    "# Development dependencies included. Qualify Linux separately before deployment.\n"
    + "\n".join(packages)
    + "\n",
    encoding="utf-8",
)
