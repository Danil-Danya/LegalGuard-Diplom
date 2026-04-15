import type { Router } from 'vue-router';

import { isAuthenticatedSession } from '@/entities/users/api/auth';
import { openAuthRequiredModal } from '@/shared/lib/auth-gate';

export const setupRouterGuards = (router: Router) => {
    router.beforeEach((to, from) => {
        if (!to.meta.requiresAuth || isAuthenticatedSession()) {
            return true;
        }

        openAuthRequiredModal({
            requestedPath: to.fullPath,
            requestedLabel: typeof to.meta.authLabel === 'string' ? to.meta.authLabel : 'этот раздел',
        });

        if (from.name) {
            return false;
        }

        return {
            name: 'site',
        };
    });
};
