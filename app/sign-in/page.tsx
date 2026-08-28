/* eslint-disable prefer-const */
"use client";

import { AuthCarousel } from "@/components/auth-carousel";
import AuthNavbar from "@/components/auth-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { getDashboardRoute, normalizeRole } from "@/lib/dashboard-routes";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 font-sans">
      <AuthNavbar variant="signin" />

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
                <a
                  href="/sign-up"
                  className="font-medium text-brand-600 hover:text-brand-500 hover:underline">
                  Create account
                </a>
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
