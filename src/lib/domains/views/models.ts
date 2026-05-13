import { z } from 'zod';
import { alertSchema } from '../alert/models';
import { demoUserSchema } from '../identity/models';
import { learningAssignmentSchema } from '../learning/models';
import { reportSchema } from '../report/models';
import { timelineEventSchema } from '../timeline/models';

export const alertDetailsViewSchema = z.object({
  alert: alertSchema,
  report: reportSchema,
  reporter: demoUserSchema,
  timeline: z.array(timelineEventSchema),
  learningAssignment: learningAssignmentSchema.optional()
});
export type AlertDetailsView = z.infer<typeof alertDetailsViewSchema>;
