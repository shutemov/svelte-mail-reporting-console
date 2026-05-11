import { describe, expect, it } from 'vitest';
import {
  buildEmployeeProfileDetails,
  buildEmployeeProfileSummaries,
  calculateEmployeeRiskStatus
} from '$lib/domains/employee-profile-aggregation';
import { InMemoryMockRepository } from '$lib/server/mock-repository';

describe('employee profile aggregation', () => {
  it('lists ten employees and keeps only Alice and Bob profile-enabled', () => {
    const repository = new InMemoryMockRepository('empty');
    const state = repository.getCurrentState();
    const summaries = buildEmployeeProfileSummaries(state, '2026-01-11T12:00:00.000Z');

    expect(summaries).toHaveLength(10);
    expect(summaries.filter((summary) => summary.user.profileEnabled)).toHaveLength(2);
    expect(summaries.find((summary) => summary.user.id === 'employee-1')?.user.name).toBe(
      'Alice Employee'
    );
    expect(summaries.find((summary) => summary.user.id === 'employee-2')?.user.name).toBe(
      'Bob Employee'
    );
  });

  it('calculates green, yellow, and red status rules', () => {
    expect(
      calculateEmployeeRiskStatus({
        highRiskReports: 0,
        openAlerts: 0,
        enteredCredentialsCount: 0,
        learningAssigned: 0,
        learningCompletionRate: 0
      })
    ).toBe('green');

    expect(
      calculateEmployeeRiskStatus({
        highRiskReports: 1,
        openAlerts: 0,
        enteredCredentialsCount: 0,
        learningAssigned: 0,
        learningCompletionRate: 0
      })
    ).toBe('yellow');

    expect(
      calculateEmployeeRiskStatus({
        highRiskReports: 1,
        openAlerts: 0,
        enteredCredentialsCount: 1,
        learningAssigned: 0,
        learningCompletionRate: 0
      })
    ).toBe('red');
  });

  it('returns full details only for profile-enabled employees', () => {
    const repository = new InMemoryMockRepository('default');
    const state = repository.getCurrentState();
    const alice = buildEmployeeProfileDetails(state, 'employee-1', '2026-01-11T12:00:00.000Z');

    expect(alice?.user.name).toBe('Alice Employee');
    expect(buildEmployeeProfileDetails(state, 'employee-3', '2026-01-11T12:00:00.000Z')).toBeNull();
  });
});
