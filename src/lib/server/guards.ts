import { fail, redirect } from '@sveltejs/kit';
import type { DemoUser, UserRole } from '$lib/domains/types';

export function requireRole(user: DemoUser, role: UserRole) {
  if (user.role !== role) {
    throw redirect(303, '/');
  }
}

export function assertOwned(user: DemoUser, ownerId: string) {
  if (user.id !== ownerId) {
    throw fail(403, { message: 'Access denied' });
  }
}