import type { DemoUser, TimelineEvent, TimelineEventType } from '$lib/domains/types';

export function createTimelineEvent(input: {
  alertId: string;
  actor: DemoUser;
  type: TimelineEventType;
  message: string;
  now: string;
}): TimelineEvent {
  return {
    id: '',
    alertId: input.alertId,
    actorId: input.actor.id,
    type: input.type,
    message: input.message,
    createdAt: input.now
  };
}