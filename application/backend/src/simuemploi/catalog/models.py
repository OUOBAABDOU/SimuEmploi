from enum import StrEnum
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator


class Domain(StrEnum):
    BEGINNER = "beginner"
    PRESENTATION = "presentation"


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)


class Criterion(StrictModel):
    key: str = Field(min_length=1, max_length=50)
    label: str = Field(min_length=1, max_length=100)
    description: str = Field(min_length=1, max_length=500)


class Question(StrictModel):
    key: str = Field(min_length=1, max_length=50)
    prompt: str = Field(min_length=1, max_length=700)
    guidance: list[str] = Field(min_length=1, max_length=4)
    criteria: list[str] = Field(min_length=1, max_length=4)


class ScenarioSummary(StrictModel):
    id: UUID
    slug: str = Field(pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    version: int = Field(ge=1)
    title: str = Field(min_length=1, max_length=150)
    summary: str = Field(min_length=1, max_length=500)
    objective: Literal["internship", "first_job"]
    domain: Domain
    estimated_minutes: int = Field(ge=1, le=60)
    country: Literal["BF"] = "BF"
    locale: Literal["fr"] = "fr"
    modality: Literal["text"] = "text"
    question_count: int = Field(ge=1, le=10)
    content_status: Literal["example_pending_review"] = "example_pending_review"


class ScenarioDetail(ScenarioSummary):
    preparation: list[str] = Field(min_length=1, max_length=5)
    questions: list[Question] = Field(min_length=1, max_length=10)
    rubric: list[Criterion] = Field(min_length=1, max_length=8)

    @model_validator(mode="after")
    def validate_plan(self) -> "ScenarioDetail":
        if self.question_count != len(self.questions):
            raise ValueError("The question count must match the versioned plan")
        question_keys = [question.key for question in self.questions]
        criterion_keys = [criterion.key for criterion in self.rubric]
        if len(set(question_keys)) != len(question_keys):
            raise ValueError("Question keys must be unique within the plan")
        if len(set(criterion_keys)) != len(criterion_keys):
            raise ValueError("Criterion keys must be unique within the rubric")
        for question in self.questions:
            if not set(question.criteria).issubset(criterion_keys):
                raise ValueError("Every question criterion must exist in the versioned rubric")
        return self


class CatalogRecord(StrictModel):
    visibility: Literal["published", "draft"]
    scenario: ScenarioDetail


class CatalogPage(StrictModel):
    items: list[ScenarioSummary]
    next_cursor: UUID | None
    content_status: Literal["example_pending_review"] = "example_pending_review"
