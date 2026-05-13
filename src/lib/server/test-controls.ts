import { buildDashboardSummary } from '$lib/domains/dashboard';
import { failNextSchema } from '$lib/domains';
import type { DashboardSummary } from '$lib/domains';
import type { SeedName } from './mock-state';
import type { InMemoryMockRepository } from './mock-repository';

export type FailureCommand =
  | 'submitReport'
  | 'updateAlertStatus'
  | 'assignLearning'
  | 'completeLearning';

type FailureRecord = {
  status: number;
  message: string;
};

export interface TestControls {
  reset(seed: SeedName): DashboardSummary;
  failNext(input: { command: FailureCommand; status: number; message: string }): void;
  consumeFailure(command: FailureCommand): FailureRecord | null;
}

export class InMemoryTestControls implements TestControls {
  private failures = new Map<FailureCommand, FailureRecord>();

  constructor(private repository: InMemoryMockRepository) {}

  reset(seed: SeedName) {
    this.failures.clear();
    return this.repository.reset(seed);
  }

  failNext(input: { command: FailureCommand; status: number; message: string }): void {
    const parsed = failNextSchema.safeParse(input);
    if (!parsed.success) {
      throw new Error('INVALID_FAIL_NEXT_PAYLOAD');
    }

    this.failures.set(parsed.data.command, {
      status: parsed.data.status,
      message: parsed.data.message
    });
  }

  consumeFailure(command: FailureCommand): FailureRecord | null {
    const existing = this.failures.get(command) ?? null;
    if (existing) {
      this.failures.delete(command);
    }
    return existing;
  }

  getDashboardSummary() {
    return buildDashboardSummary(this.repository.getCurrentState());
  }
}