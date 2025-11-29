import { createAuthClient } from 'better-auth/react';
import { customSessionClient, adminClient } from 'better-auth/client/plugins';
import { auth } from './auth';
export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>(), adminClient()],
});
