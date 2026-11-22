import os
from collections.abc import Awaitable, Callable
from typing import Annotated, Literal
from uuid import UUID, uuid4

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from starlette.responses import Response

from simuemploi.catalog.models import CatalogPage, Domain, ScenarioDetail
from simuemploi.catalog.repository import ExampleCatalogRepository
from simuemploi.catalog.service import CatalogService, InvalidCursorError


class ErrorResponse(BaseModel):
    code: str
    message: str
    correlation_id: str


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
    version: str = "0.1.0"


def create_app(environment: str | None = None) -> FastAPI:
    environment = environment or os.getenv("APP_ENV", "local")
    if environment not in {"local", "test"}:
        raise RuntimeError("The example catalog is restricted to local and test environments")

    app = FastAPI(
        title="SimuEmploi API candidat",
        version="0.1.0",
        description=(
            "Première tranche locale : catalogue d'exemples à relire. "
            "Aucun compte ou entraînement privé."
        ),
    )
    catalog = CatalogService(ExampleCatalogRepository())

    @app.middleware("http")
    async def request_context(
        request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        request.state.correlation_id = str(uuid4())
        response = await call_next(request)
        response.headers["X-Request-ID"] = request.state.correlation_id
        response.headers["X-Content-Type-Options"] = "nosniff"
        return response

    def error(request: Request, code: str, message: str, status: int) -> JSONResponse:
        body = ErrorResponse(
            code=code, message=message, correlation_id=request.state.correlation_id
        )
        return JSONResponse(status_code=status, content=body.model_dump())

    @app.exception_handler(RequestValidationError)
    async def validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
        return error(
            request, "invalid_request", "Vérifiez les filtres et les paramètres de la demande.", 422
        )

    @app.exception_handler(HTTPException)
    async def http_error(request: Request, exc: HTTPException) -> JSONResponse:
        return error(
            request, "scenario_not_found", "Cet exercice n’est pas disponible.", exc.status_code
        )

    @app.exception_handler(InvalidCursorError)
    async def cursor_error(request: Request, exc: InvalidCursorError) -> JSONResponse:
        return error(request, "invalid_cursor", str(exc), 422)

    @app.get("/health/live", response_model=HealthResponse, tags=["operations"])
    def health() -> HealthResponse:
        return HealthResponse()

    @app.get(
        "/api/v1/scenarios",
        response_model=CatalogPage,
        operation_id="CAT_01_list_scenarios",
        tags=["catalog"],
        responses={422: {"model": ErrorResponse}},
    )
    def list_scenarios(
        domain: Domain | None = None,
        limit: Annotated[int, Query(ge=1, le=20)] = 10,
        cursor: UUID | None = None,
    ) -> CatalogPage:
        return catalog.list(domain, limit, cursor)

    @app.get(
        "/api/v1/scenarios/{scenario_id}",
        response_model=ScenarioDetail,
        operation_id="CAT_02_read_scenario",
        tags=["catalog"],
        responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}},
    )
    def read_scenario(scenario_id: UUID) -> ScenarioDetail:
        item = catalog.get(scenario_id)
        if item is None:
            raise HTTPException(status_code=404)
        return item

    return app
