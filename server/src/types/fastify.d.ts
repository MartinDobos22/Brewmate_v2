import type { User } from '@brewmate/shared';
import type { onRequestAsyncHookHandler } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    /** Populated by the auth plugin; null on unauthenticated routes. */
    currentUser: User | null;
  }

  interface FastifyInstance {
    /** onRequest hook that verifies the Firebase ID token and loads the user. */
    authenticate: onRequestAsyncHookHandler;
  }
}
