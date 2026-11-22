from collections.abc import AsyncIterator
from uuid import uuid4

import pytest
from httpx import ASGITransport, AsyncClient
from pydantic import ValidationError

from simuemploi.app import create_app
from simuemploi.catalog.models import ScenarioDetail

pytestmark = pytest.mark.anyio


@pytest.fixture
def anyio_backend() -> str:
    return "asyncio"


@pytest.fixture
async def client() -> AsyncIterator[AsyncClient]:
    async with AsyncClient(
        transport=ASGITransport(app=create_app("test")), base_url="http://test"
    ) as session:
        yield session


async def test_list_omits_question_content_and_hidden_drafts(client: AsyncClient) -> None:
    body = (await client.get("/api/v1/scenarios")).json()
    assert len(body["items"]) == 3
    assert body["content_status"] == "example_pending_review"
    assert all("questions" not in item for item in body["items"])
    hidden_id = "44444444-4444-4444-8444-444444444444"
    assert (await client.get(f"/api/v1/scenarios/{hidden_id}")).status_code == 404


async def test_pagination_and_filter_do_not_repeat_items(client: AsyncClient) -> None:
    first = (await client.get("/api/v1/scenarios?domain=beginner&limit=1")).json()
    second = (
        await client.get(
            "/api/v1/scenarios",
            params={"domain": "beginner", "limit": 1, "cursor": first["next_cursor"]},
        )
    ).json()
    assert first["items"][0]["id"] != second["items"][0]["id"]
    assert second["next_cursor"] is None


@pytest.mark.parametrize("query", ["limit=0", "limit=21", "domain=unknown", "cursor=invalid"])
async def test_invalid_queries_return_safe_errors(client: AsyncClient, query: str) -> None:
    response = await client.get("/api/v1/scenarios?" + query)
    assert response.status_code == 422
    assert set(response.json()) == {"code", "message", "correlation_id"}
    assert response.json()["correlation_id"] == response.headers["X-Request-ID"]


async def test_unknown_cursor_and_missing_resource(client: AsyncClient) -> None:
    cursor = await client.get("/api/v1/scenarios", params={"cursor": str(uuid4())})
    assert cursor.status_code == 422
    assert cursor.json()["code"] == "invalid_cursor"
    assert (await client.get(f"/api/v1/scenarios/{uuid4()}")).status_code == 404


async def test_versioned_plan_and_rubric_are_coherent(client: AsyncClient) -> None:
    summary = (await client.get("/api/v1/scenarios")).json()["items"][0]
    detail = (await client.get(f"/api/v1/scenarios/{summary['id']}")).json()
    assert detail["version"] == summary["version"]
    assert len(detail["questions"]) == detail["question_count"] == 5
    detail["questions"][0]["criteria"] = ["nonexistent"]
    with pytest.raises(ValidationError):
        ScenarioDetail.model_validate(detail)


def test_development_examples_cannot_start_in_production() -> None:
    with pytest.raises(RuntimeError, match="restricted"):
        create_app("production")
