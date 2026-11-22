from uuid import UUID

from simuemploi.catalog.models import CatalogPage, Domain, ScenarioDetail, ScenarioSummary
from simuemploi.catalog.repository import CatalogRepository


class InvalidCursorError(ValueError):
    pass


class CatalogService:
    def __init__(self, repository: CatalogRepository) -> None:
        self.repository = repository

    def list(self, domain: Domain | None, limit: int, cursor: UUID | None) -> CatalogPage:
        items = [
            item for item in self.repository.published() if domain is None or item.domain == domain
        ]
        start = 0
        if cursor is not None:
            positions = [i for i, item in enumerate(items) if item.id == cursor]
            if not positions:
                raise InvalidCursorError(
                    "Le filtre ou la position a changé. Revenez au début de la liste."
                )
            start = positions[0] + 1
        selected = items[start : start + limit]
        summaries = [
            ScenarioSummary.model_validate(
                item.model_dump(include=set(ScenarioSummary.model_fields))
            )
            for item in selected
        ]
        next_cursor = selected[-1].id if selected and start + limit < len(items) else None
        return CatalogPage(items=summaries, next_cursor=next_cursor)

    def get(self, scenario_id: UUID) -> ScenarioDetail | None:
        return self.repository.get_published(scenario_id)
