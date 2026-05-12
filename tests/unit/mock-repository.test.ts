import { describe, expect, it } from 'vitest';
import { InMemoryMockRepository } from '$lib/server/mock-repository';

describe('mock repository', () => {
  it('returns alert timeline with the newest event first', () => {
    const repository = new InMemoryMockRepository('default');

    const details = repository.getAlertDetails('alert-1');

    expect(details?.timeline.map((event) => event.type)).toEqual([
      'investigation_started',
      'report_submitted'
    ]);
  });
});
