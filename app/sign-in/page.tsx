/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
"use client";

import { AuthCarousel } from "@/components/auth-carousel";
import AuthNavbar from "@/components/auth-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { getDashboardRoute, normalizeRole } from "@/lib/dashboard-routes";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const slides = [
  { src: "/hero.png", alt: "School Campus", priority: true },
  { src: "/hero1.png", alt: "Students" },
  { src: "/hero2.png", alt: "Young Students" },
  { src: "/hero3.png", alt: "School Building" },
];

export default function SignIn() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState(false);
  const [conflictEmail, setConflictEmail] = useState<string | null>(null);
  const [prefillEmail, setPrefillEmail] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const selectedRole = String(formData.get("role") ?? "");

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    setIsPending(false);

    if (signInError) {
      setError(signInError.message ?? "Unable to sign in. Please try again.");
      return;
    }

    const { data: sessionData } = await authClient.getSession();
    const sessionUser = (sessionData?.user ?? {}) as {
      id?: string;
      email?: string;
      role?: string | null;
    };

    // Try session role first
    let userRole = normalizeRole(sessionUser.role ?? selectedRole);

    // If role missing in session, cannot proceed — require admin support
    if (!userRole) {
      setError(
        "Your account role could not be resolved. Please contact support.",
      );
      setIsPending(false);
      return;
    }

    router.push(getDashboardRoute(userRole));
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsPending(true);
    const { error: socialError } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
    if (socialError) {
      setIsPending(false);
      setError(socialError.message ?? "Google sign-in failed.");
    }
  };

  // If redirected back from Google sign-up with a role query param, apply it to the user
  // and redirect them to their dashboard.
  useEffect(() => {
    (async () => {
      try {
        const params = new URL(window.location.href).searchParams;
        // If conflict query present, show banner
        if (params.get('conflict') === '1') {
          setConflict(true);
          const e = params.get('email');
          if (e) {
            setConflictEmail(e);
            setPrefillEmail(e);
          }
        }

        // First try to get role/phone from URL (older flow), then fall back to sessionStorage
        let roleParam = params.get("role");
        let phoneParam = params.get("phone");
        if (!roleParam) {
          try {
            const raw = sessionStorage.getItem("socialSignUpMeta");
            if (raw) {
              const parsed = JSON.parse(raw);
              // Ensure meta isn't stale (e.g., older than 10 minutes)
              if (
                parsed &&
                parsed.role &&
                Date.now() - (parsed.ts || 0) < 10 * 60 * 1000
              ) {
                roleParam = parsed.role;
                phoneParam = parsed.phone ?? phoneParam;
              }
            }
          } catch (e) {
            console.error(
              "Failed to read socialSignUpMeta from sessionStorage",
              e,
            );
          }
        }

        if (!roleParam) return;
        const normalized = normalizeRole(roleParam);
        if (!normalized) return;

        // Wait for session - sometimes the session is not immediately available after provider redirect
        let sessionData: any = null;
        let attempts = 0;
        while (attempts < 10) {
          const resp = await authClient.getSession();
          sessionData = resp.data;
          if (sessionData?.user?.email) break;
          attempts += 1;
          await new Promise((r) => setTimeout(r, 500));
        }

        const userEmail = sessionData?.user?.email;
        const userId = sessionData?.user?.id;
        if (!userEmail) {
          // Not signed in — nothing to do here
          return;
        }

        // Clear stored meta now that we have read it
        try {
          sessionStorage.removeItem("socialSignUpMeta");
        } catch (e) {
          /* ignore */
        }

        // Check for existing other accounts with same email (duplicate prevention)
        try {
          const check = await fetch(
            `/api/debug/mongo?action=exists&email=${encodeURIComponent(userEmail)}`,
          );
          const checkJson = await check.json();
          if (check.ok && checkJson?.ok) {
            const others = (checkJson.users || []).filter(
              (u: any) => u.id !== userId,
            );
            if (others.length > 0) {
              // Conflict detected: sign out this session and redirect user to sign-in
              try {
                await authClient.signOut();
              } catch (e) {
                console.error("signOut failed", e);
              }
              router.replace("/sign-in?conflict=1");
              return;
            }
          }
        } catch (e) {
          console.error("duplicate check failed", e);
        }

        // Call server endpoint to set role (uses POST handler in /api/debug/mongo)
        const res = await fetch("/api/debug/mongo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "set-role",
            email: userEmail,
            role: normalized,
            phone: phoneParam ?? undefined,
          }),
        });
        const payload = await res.json();
        if (!res.ok || !payload?.ok) {
          console.error("Failed to set role after Google sign-up", payload);
          return;
        }

        // Redirect to dashboard
        router.replace(getDashboardRoute(normalized));
      } catch (err) {
        console.error("Error applying Google sign-up role:", err);
      }
    })();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 font-sans">
      <AuthNavbar variant="signin" />

      {conflict && (
        <div className="mx-auto mt-4 max-w-xl rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <div className="flex items-start justify-between">
            <div>
              <strong className="block font-medium">An account with this email already exists.</strong>
              <div className="mt-1 text-sm text-red-800">
                Please sign in to your existing account to link your Google account, or visit your profile after signing in to attach social providers.
              </div>
              {conflictEmail && (
                <div className="mt-2 text-xs text-red-700">Email: {conflictEmail}</div>
              )}
            </div>
            <div className="ml-4 flex shrink-0 items-center gap-2">
              <a
                href={"/sign-in"}
                className="rounded bg-white px-3 py-1 text-xs font-medium text-red-700 shadow-sm"
                onClick={(e) => {
                  // Clear the conflict query param and reload without it
                  e.preventDefault();
                  const url = new URL(window.location.href);
                  url.searchParams.delete('conflict');
                  url.searchParams.delete('email');
                  window.location.href = url.toString();
                }}>
                Continue to sign in
              </a>
            </div>
          </div>
        </div>
      )}

      <main
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 sm:px-6 lg:flex-row lg:justify-end lg:px-0 lg:pb-0 lg:pt-0"
        style={{ minHeight: "calc(100vh - 64px)" }}>
        <AuthCarousel slides={slides} />

        <div className="relative z-20 w-full max-w-xl lg:mr-24 lg:pr-8">
          <div className="w-full rounded-custom border border-gray-100 bg-white/85 p-4 shadow-2xl backdrop-blur-sm sm:p-8 lg:p-9">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Login</h2>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} action="#">
              <label
                className="mb-1 flex items-center text-sm font-medium text-gray-700"
                htmlFor="email">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
                Email
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={prefillEmail || undefined}
                  onChange={(e) => setPrefillEmail(e.target.value)}
                  className="block w-full appearance-none rounded-custom border border-gray-300 px-3 py-2.5 shadow-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-brand sm:text-sm"
                />
              </div>

              <div>
                <label
                  className="mb-1 flex items-center text-sm font-medium text-gray-700"
                  htmlFor="password">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  Password
                </label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    className="block w-full appearance-none rounded-custom border border-gray-300 px-3 py-2.5 pr-10 shadow-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-brand sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-brand-600 hover:text-brand-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-custom border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-custom bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
                  {isPending ? "Signing in..." : "Login"}
                </Button>
              </div>

              <p className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/sign-up")}
                  className="font-medium text-brand-600 hover:text-brand-500 hover:underline">
                  Create account
                </button>
              </p>
            </form>

            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white/35 px-2 text-gray-500">Or</span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isPending}
                  className="flex w-full items-center justify-center rounded-custom bg-red-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
                  <svg
                    aria-hidden="true"
                    className="mr-2 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                  </svg>
                  Login with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
