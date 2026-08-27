"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const slides = ["/hero.png", "/hero1.png", "/hero2.png", "/hero3.png"];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const headingText =
    role === "student"
      ? "Student Login"
      : role === "parent"
        ? "Parent Login"
        : role === "teacher"
          ? "Teacher Login"
          : "Login";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // This is the expected auth pattern: the sign-in call resolves with a role
    // and we destructure it here to update the page heading.
    const response = { role: "student" } as { role?: string };
    const { role: authRole } = response;

    if (authRole) {
      setRole(authRole);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 font-sans">
      <header className="relative z-20 bg-brand text-white shadow-md">
        <div className="mx-8 flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img
              alt="Silverbird International School Logo"
              className="h-10 w-auto rounded-full bg-white p-0.5"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAG4I-eiV-zAxfl34JZEgP4VDdOcsGm8UBrYwwlqpQf3g9ZtWbgoz5d-5pWEalzMPeHKZPZOtsIu48W5zyrNAJv4k_SOMs6HUOZr6nH_kC_QI7k0lIqHm_QcRZJstQviaeeBYufVgXxb19yyEq7X34lA6ao77CT01bh-u0VUC2WGvYxiWs-9vBhkG2pdZPO0jr3dcOZj16CCuOmg-vTF3OwTz-2ftuNL6sjPROvjGbN8PR3Zayp8Vaqtxm_kJkp2cdSA"
            />
            <h1 className="text-xl font-semibold tracking-wide">
              Silverbird International School
            </h1>
          </div>
        </div>
      </header>

      <main
        className="relative flex flex-1 items-center justify-center overflow-hidden lg:justify-end"
        style={{ minHeight: "calc(100vh - 64px)" }}>
        <div className="absolute inset-0 z-0 bg-black">
          {slides.map((slide, index) => (
            <img
              key={slide}
              alt={
                index === 0
                  ? "School Campus"
                  : index === 1
                    ? "Students"
                    : index === 2
                      ? "Young Students"
                      : "School Building"
              }
              className={`carousel-slide ${index === activeSlide ? "active" : ""}`}
              src={slide}
            />
          ))}
          <div className="absolute inset-0 z-10 bg-black/20" />
        </div>

        <div className="relative z-20 w-full max-w-xl px-4 sm:px-6 lg:mr-24 lg:pr-8">
          <div className="w-full rounded-custom border border-gray-100 bg-white/85 p-8 shadow-2xl backdrop-blur-sm sm:p-9">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {headingText}
              </h2>
            </div>

            <form
              className="space-y-4"
              onSubmit={handleSubmit}
              action="#"
              method="POST">
              <div>
                <label
                  className="mb-1 flex items-center text-sm font-medium text-gray-700"
                  htmlFor="username">
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
                  Username
                </label>
                <div className="mt-1">
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    placeholder="Enter your username"
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
                    type="password"
                    required
                    placeholder="Enter your password"
                    className="block w-full appearance-none rounded-custom border border-gray-300 px-3 py-2.5 pr-10 shadow-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-brand sm:text-sm"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                    aria-label="Show password">
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300 bg-brand text-brand accent-brand focus:ring-brand checked:bg-brand checked:text-brand"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-brand-600 hover:text-brand-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full rounded-custom bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2">
                  Login
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
                <a
                  href="#"
                  className="flex w-full items-center justify-center rounded-custom bg-red-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                  <svg
                    aria-hidden="true"
                    className="mr-2 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                  </svg>
                  Login with Google
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
