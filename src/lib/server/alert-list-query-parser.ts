import { alertListQuerySchema } from '$lib/domains/schemas';
import type { AlertListQuery } from '$lib/domains/types';

export function parseAlertListQuery(searchParams: URLSearchParams): AlertListQuery {
  const optionalParam = (name: string) => {
    const value = searchParams.get(name)?.trim();
    return value ? value : undefined;
  };

  const payload = {
    status: optionalParam('status'),
    severity: optionalParam('severity'),
    reporterId: optionalParam('reporterId'),
    riskyAction: optionalParam('riskyAction')
  };

  const parsed = alertListQuerySchema.safeParse(payload);
  if (!parsed.success) {
    return {};
  }

  return parsed.data;
}
