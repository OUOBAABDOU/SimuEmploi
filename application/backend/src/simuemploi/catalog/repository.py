import json
from importlib.resources import files
from typing import Protocol
from uuid import UUID

from simuemploi.catalog.models import CatalogRecord, ScenarioDetail


class CatalogRepository(Protocol):
    def published(self) -> tuple[ScenarioDetail, ...]: ...

    def get_published(self, scenario_id: UUID) -> ScenarioDetail | None: ...


class ExampleCatalogRepository:
    """Development-only fixtures; PostgreSQL publication is a later S1/S2 tranche."""

    def __init__(self) -> None:
        content = files("simuemploi.catalog").joinpath("examples.json").read_text(encoding="utf-8")
        self._records = tuple(CatalogRecord.model_validate(row) for row in json.loads(content))
        ids = [row.scenario.id for row in self._records]
        if len(set(ids)) != len(ids):
            raise ValueError("Catalog scenario IDs must be unique")

    def published(self) -> tuple[ScenarioDetail, ...]:
        return tuple(row.scenario for row in self._records if row.visibility == "published")

    def get_published(self, scenario_id: UUID) -> ScenarioDetail | None:
        return next((item for item in self.published() if item.id == scenario_id), None)
