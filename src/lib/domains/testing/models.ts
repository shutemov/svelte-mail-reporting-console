import { z } from 'zod';

export const failNextSchema = z.object({
  command: z.enum(['submitReport', 'updateAlertStatus', 'assignLearning', 'completeLearning']),
  status: z.number().int().min(400).max(599),
  message: z.string().min(1)
});
export type FailNextInput = z.infer<typeof failNextSchema>;
