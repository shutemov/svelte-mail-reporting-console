import { z } from 'zod';

export const fieldErrorsSchema = z.record(z.string());
export type FieldErrors<TValues> = Partial<Record<keyof TValues, string>>;

export const mutationResultSchema = z.object({
  success: z.boolean(),
  values: z.record(z.unknown()).optional(),
  fieldErrors: fieldErrorsSchema.optional(),
  formError: z.string().optional(),
  data: z.unknown().optional()
});
export type MutationResultBase = z.infer<typeof mutationResultSchema>;

export type MutationResult<TValues, TData = unknown> = Omit<
  MutationResultBase,
  'values' | 'data'
> & {
  values?: Partial<TValues>;
  data?: TData;
};
