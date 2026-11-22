export type Domain = 'beginner' | 'presentation';

export interface ScenarioSummary {
  id: string;
  slug: string;
  version: number;
  title: string;
  summary: string;
  objective: 'internship' | 'first_job';
  domain: Domain;
  estimated_minutes: number;
  question_count: number;
  country: 'BF';
  locale: 'fr';
  modality: 'text';
  content_status: 'example_pending_review';
}

export interface ScenarioDetail extends ScenarioSummary {
  preparation: string[];
  questions: { key: string; prompt: string; guidance: string[]; criteria: string[] }[];
  rubric: { key: string; label: string; description: string }[];
}

export interface CatalogPage {
  items: ScenarioSummary[];
  next_cursor: string | null;
  content_status: 'example_pending_review';
}

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function readApi<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(path, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new ApiError(response.status, response.status === 404
      ? 'Cet exercice n’est pas disponible. Choisissez un autre exercice.'
      : 'Le chargement n’a pas abouti. Vous pouvez réessayer.');
  }
  return response.json() as Promise<T>;
}
