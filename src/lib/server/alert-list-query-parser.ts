import { alertListQuerySchema } from '$lib/domains/schemas';
import type { AlertListQuery } from '$lib/domains/types';

export function parseAlertListQuery(searchParams: URLSearchParams): AlertListQuery {
  const payload = {
    status: searchParams.get('status') ?? undefined,
    severity: searchParams.get('severity') ?? undefined,
    reporterId: searchParams.get('reporterId') ?? undefined,
    riskyAction: searchParams.get('riskyAction') ?? undefined
  };

  const parsed = alertListQuerySchema.safeParse(payload);
  if (!parsed.success) {
    return {};
  }

  return parsed.data;
}