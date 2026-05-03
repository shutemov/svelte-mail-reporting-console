import type { DemoUser } from '$lib/domains/types';
import type { MockRepository } from './mock-state';

export interface DemoAuth {
  resolveUser(cookieUserId: string | undefined): DemoUser;
  switchUser(userId: string): { cookieName: 'demo_user_id'; value: string };
}

export class RepositoryDemoAuth implements DemoAuth {
  constructor(private repository: MockRepository) {}

  resolveUser(cookieUserId: string | undefined): DemoUser {
    const fallback = this.repository.getUserById('employee-1');
    if (!fallback) {
      throw new Error('FALLBACK_USER_NOT_FOUND');
    }

    if (!cookieUserId) {
      return fallback;
    }

    return this.repository.getUserById(cookieUserId) ?? fallback;
  }

  switchUser(userId: string) {
    const user = this.repository.getUserById(userId);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    return {
      cookieName: 'demo_user_id' as const,
      value: user.id
    };
  }
}