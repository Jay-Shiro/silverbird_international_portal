/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AuthCarousel } from "@/components/auth-carousel";
import AuthNavbar from "@/components/auth-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const slides = [
  { src: "/hero.png", alt: "School Campus", priority: true },
  { src: "/hero1.png", alt: "Students" },
  { src: "/hero2.png", alt: "Young Students" },
  { src: "/hero3.png", alt: "School Building" },
];

export default function SignUp() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGoogleRoleModal, setShowGoogleRoleModal] = useState(false);
  const [googleRole, setGoogleRole] = useState<string>("student");
  const [googlePhone, setGooglePhone] = useState<string>("");

  const headingText =
    role === "student"
      ? "Student Sign Up"
      : role === "parent"
        ? "Parent Sign Up"
        : role === "teacher"
          ? "Teacher Sign Up"
          : "Sign Up";

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const selectedRole = String(formData.get("role") ?? "").trim();
    const submittedPassword = String(formData.get("password") ?? "");

    // Require name for email/password signups
    if (!name) {
      setError("Full name is required for email sign-ups.");
      setIsPending(false);
      return;
    }

    const payload: Record<string, any> = {
      email,
      password: submittedPassword,
      name,
      ...(phone ? { phone } : {}),
      ...(selectedRole ? { role: selectedRole } : {}),
    };

    // Check for existing account with same email before attempting sign-up
    try {
      const check = await fetch(`/api/debug/mongo?action=exists&email=${encodeURIComponent(email)}`);
      const json = await check.json();
      if (check.ok && json?.ok && json.count > 0) {
        setError("An account with this email already exists. Please sign in instead.");
        setIsPending(false);
        return;
      }
    } catch (e) {
      // non-fatal — continue to try sign-up, but log
      console.error('Email existence check failed', e);
    }

    const { error: signUpError } = await authClient.signUp.email(
      payload as any,
    );

    setIsPending(false);

    if (signUpError) {
      setError(
        signUpError.message ?? "Account creation failed. Please try again.",
      );
      return;
    }

    router.push(`/sign-in?role=${selectedRole}`);
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 font-sans">
      <AuthNavbar variant="signup" />

      <main
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 sm:px-6 lg:flex-row lg:justify-end lg:px-0 lg:pb-0 lg:pt-0"
        style={{ minHeight: "calc(100vh - 64px)" }}>
        <AuthCarousel slides={slides} />

        <div className="relative z-20 w-full max-w-2xl lg:mr-24 lg:max-w-[680px] lg:pr-8">
          <div className="w-full rounded-custom border border-gray-100 bg-white/85 p-4 shadow-2xl backdrop-blur-sm sm:p-8 lg:p-10">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {headingText}
              </h2>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} action="#">
              <div>
                <label
                  className="mb-1 flex items-center text-sm font-medium text-gray-700"
                  htmlFor="role">
                  Role
                </label>
                <div className="mt-1">
                  <select
                    id="role"
                    name="role"
                    value={role}
                    required
                    onChange={(event) => setRole(event.target.value)}
                    className="block w-full appearance-none rounded-custom border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2">
                    <option value="">Select your role</option>
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  className="mb-1 flex items-center text-sm font-medium text-gray-700"
                  htmlFor="name">
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
                  Full Name
                </label>
                <div className="mt-1">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className={`block w-full appearance-none rounded-custom border border-gray-300 px-3 py-2.5 shadow-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-brand sm:text-sm ${showGoogleRoleModal ? 'hidden' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label
                  className="mb-1 flex items-center text-sm font-medium text-gray-700"
                  htmlFor="phone">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.52l.57 2.28a2 2 0 01-.54 1.9L8 9.5a15.5 15.5 0 006.5 6.5l.8-.99a2 2 0 011.9-.54l2.28.57A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C9.82 23 1 14.18 1 6V5a2 2 0 012-2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  Phone Number
                </label>
                <div className="mt-1">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="Enter your phone number"
                    className="block w-full appearance-none rounded-custom border border-gray-300 px-3 py-2.5 shadow-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-brand sm:text-sm"
                  />
                </div>
              </div>

              <div>
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
                      d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 17.5v-11zm2.3 0l6.7 5.3 6.7-5.3"
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
                    required
                    placeholder="Enter your email"
                    className="block w-full appearance-none rounded-custom border border-gray-300 px-3 py-2.5 shadow-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-brand sm:text-sm"
                  />
                </div>
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
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="block w-full appearance-none rounded-custom border border-gray-300 px-3 py-2.5 pr-10 shadow-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-brand sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label
                  className="mb-1 flex items-center text-sm font-medium text-gray-700"
                  htmlFor="confirm-password">
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
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm your password"
                    className={`block w-full appearance-none rounded-custom border px-3 py-2.5 pr-10 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${
                      passwordMismatch
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-brand focus:ring-brand"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>
                {passwordMismatch && (
                  <p className="mt-2 text-sm text-red-600">
                    Passwords do not match.
                  </p>
                )}
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
                  disabled={
                    isPending ||
                    passwordMismatch ||
                    !password ||
                    !confirmPassword ||
                    !role
                  }
                  className="w-full rounded-custom bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  {isPending ? "Creating account..." : "Create Account"}
                </Button>
              </div>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/sign-in")}
                  className="font-medium text-brand-600 hover:text-brand-500 hover:underline">
                  Log In
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
                  onClick={() => setShowGoogleRoleModal(true)}
                  className="flex w-full items-center justify-center rounded-custom bg-red-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                  <svg
                    aria-hidden="true"
                    className="mr-2 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                  </svg>
                  Sign Up with Google
                </button>
              </div>

              {/* Role selection modal for Google sign-up */}
              {showGoogleRoleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                    <h3 className="mb-4 text-lg font-medium">
                      Select your role
                    </h3>
                    <div className="mb-4 flex flex-col gap-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="google-role"
                          value="student"
                          checked={googleRole === "student"}
                          onChange={() => setGoogleRole("student")}
                        />
                        <span>Student</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="google-role"
                          value="parent"
                          checked={googleRole === "parent"}
                          onChange={() => setGoogleRole("parent")}
                        />
                        <span>Parent</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="google-role"
                          value="teacher"
                          checked={googleRole === "teacher"}
                          onChange={() => setGoogleRole("teacher")}
                        />
                        <span>Teacher</span>
                      </label>
                    </div>

                    <div className="mb-4">
                      <label className="mb-1 block text-sm font-medium text-gray-700">Phone (optional)</label>
                      <input
                        type="tel"
                        value={googlePhone}
                        onChange={(e) => setGooglePhone(e.target.value)}
                        placeholder="Enter phone to save with account"
                        className="block w-full rounded-custom border border-gray-300 px-3 py-2.5 sm:text-sm"
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowGoogleRoleModal(false)}
                        className="rounded-md px-4 py-2">
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!googleRole) return;
                          try {
                            // Save the chosen role and optional phone to sessionStorage so it survives the OAuth redirect
                            const meta = { role: googleRole, phone: googlePhone, ts: Date.now() };
                            sessionStorage.setItem('socialSignUpMeta', JSON.stringify(meta));
                          } catch (e) {
                            console.error('sessionStorage not available', e);
                          }
                          // Redirect to Google sign-in; use a relative callback URL
                          await authClient.signIn.social({
                            provider: "google",
                            callbackURL: "/sign-in",
                          } as any);
                        }}
                        className="rounded-md bg-brand px-4 py-2 text-white">
                        Continue with Google
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
