import type { LayoutServerLoad } from './$types';
import { repository } from '$lib/server/modules';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  return {
    user: locals.user,
    users: repository.getCurrentState().users,
    currentPath: `${url.pathname}${url.search}`
  };
};
