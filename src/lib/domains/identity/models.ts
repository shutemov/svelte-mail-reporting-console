import { z } from 'zod';

export const userRoleSchema = z.enum(['employee', 'admin', 'viewer']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const employeePersonaSchema = z.enum([
  'careful_reporter',
  'frequent_clicker',
  'attachment_opener',
  'credential_risk',
  'finance_target',
  'manager',
  'assistant',
  'hr',
  'support',
  'operations'
]);
export type EmployeePersona = z.infer<typeof employeePersonaSchema>;

export const demoUserSchema = z.object({
  id: z.string(),
  role: userRoleSchema,
  name: z.string(),
  persona: employeePersonaSchema.optional()
});
export type DemoUser = z.infer<typeof demoUserSchema>;

export const demoUserRoleSchema = userRoleSchema;
