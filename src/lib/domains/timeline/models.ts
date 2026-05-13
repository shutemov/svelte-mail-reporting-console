import { z } from 'zod';

export const timelineEventTypeSchema = z.enum([
  'report_submitted',
  'investigation_started',
  'alert_resolved_safe',
  'alert_resolved_malicious',
  'alert_closed',
  'note_added',
  'learning_assigned'
]);
export type TimelineEventType = z.infer<typeof timelineEventTypeSchema>;

export const timelineEventSchema = z.object({
  id: z.string(),
  alertId: z.string(),
  actorId: z.string(),
  type: timelineEventTypeSchema,
  message: z.string(),
  createdAt: z.string()
});
export type TimelineEvent = z.infer<typeof timelineEventSchema>;
