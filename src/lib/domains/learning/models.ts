import { z } from 'zod';
import { alertSchema } from '../alert/models';
import { riskyActionSchema } from '../report/models';

export const learningStatusSchema = z.enum([
  'not_assigned',
  'assigned',
  'in_progress',
  'completed'
]);
export type LearningStatus = z.infer<typeof learningStatusSchema>;

export const learningModuleIdSchema = z.literal('phishing-basics');
export type LearningModuleId = z.infer<typeof learningModuleIdSchema>;

export const learningAssignmentSchema = z.object({
  id: z.string(),
  alertId: z.string(),
  assigneeId: z.string(),
  moduleId: learningModuleIdSchema,
  status: learningStatusSchema,
  assignedAt: z.string(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional()
});
export type LearningAssignment = z.infer<typeof learningAssignmentSchema>;

export const assignLearningSchema = z.object({
  moduleId: learningModuleIdSchema
});
export type AssignLearningInput = z.infer<typeof assignLearningSchema>;

export const completeLearningSchema = z.object({
  assignmentId: z.string().min(1)
});
export type CompleteLearningInput = z.infer<typeof completeLearningSchema>;

export const learningAssignmentViewSchema = z.object({
  assignment: learningAssignmentSchema,
  alert: alertSchema,
  report: z.object({
    id: z.string(),
    subject: z.string(),
    sender: z.string(),
    riskyActions: z.array(riskyActionSchema)
  }),
  module: z.object({
    id: learningModuleIdSchema,
    title: z.string(),
    body: z.string()
  })
});
export type LearningAssignmentView = z.infer<typeof learningAssignmentViewSchema>;
