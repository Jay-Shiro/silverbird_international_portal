"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client used in React components.
 *
 * The base URL is left at the default (same origin), so requests are sent to
 * `/api/auth/*` which the catch-all route handler forwards into `auth`.
 */
export const authClient = createAuthClient();
