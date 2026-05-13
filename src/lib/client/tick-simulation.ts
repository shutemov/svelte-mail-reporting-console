import type { MutationResult, SimulationSummary } from '$lib/domains';

type Fetcher = typeof globalThis.fetch;

export type TickSimulationResult = MutationResult<Record<string, never>, SimulationSummary>;

export async function tickSimulation(
  fetcher: Fetcher = globalThis.fetch
): Promise<TickSimulationResult> {
  const response = await fetcher('/api/admin/simulation/tick', {
    method: 'POST',
    headers: {
      accept: 'application/json'
    }
  });

  return (await response.json()) as TickSimulationResult;
}
