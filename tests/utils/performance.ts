type PerfResult<T> = {
  value: T;
  durationMs: number;
};

export async function measure<T>(name: string, fn: () => Promise<T> | T): Promise<PerfResult<T>> {
  const start = performance.now();
  const value = await fn();
  const durationMs = performance.now() - start;
  return { value, durationMs };
}

export async function measureStep<T>(label: string, fn: () => Promise<T> | T) {
  return measure(label, fn);
}

export function logPerfResult(name: string, result: PerfResult<unknown>) {
  console.info(`[perf] ${name}: ${result.durationMs.toFixed(2)}ms`);
}

export function expectWithinBudget(name: string, durationMs: number, budgetMs: number) {
  if (durationMs > budgetMs) {
    throw new Error(`${name} exceeded budget: ${durationMs.toFixed(2)}ms > ${budgetMs}ms`);
  }
}