import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    // Server Schema
  },
  client: {
    // Client Schema
    // NextAuth Environment Variable
    /* NextAuth Secret Key */
    NEXTAUTH_SECRET: z.string().min(1),
    /* NextAuth URL */
    NEXTAUTH_URL: z.string().url(),
  },

  runtimeEnv: {
    // Mapping Environment Variable
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
});