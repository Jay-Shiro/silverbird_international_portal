"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Variant = "signin" | "signup";

export default function AuthNavbar({
  variant = "signin",
}: {
  variant?: Variant;
}) {
  const [open, setOpen] = useState(false);

  const actionLabel = variant === "signin" ? "Create account" : "Log In";
  const actionHref = variant === "signin" ? "/sign-up" : "/sign-in";

  return (
    <header className="relative z-20 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Silverbird International School Logo"
            width={40}
            height={40}
            className="rounded-full bg-white p-0.5"
            // Fallback if public logo doesn't exist: use external URL
            onError={(e) => {
              // no-op: Next/Image will silently keep broken image; consumer can replace logo.png in /public
            }}
          />
          <Link
            href="/"
            className="text-base font-semibold tracking-wide text-slate-900">
            Silverbird International School
          </Link>
        </div>

        <nav className="hidden items-center gap-4 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-slate-700 hover:text-slate-900">
            Home
          </Link>
          <Link
            href="/sign-in"
            className="text-sm font-medium text-slate-700 hover:text-slate-900">
            Login
          </Link>
          <Link
            href="/sign-up"
            className="ml-2 rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600">
            Create account
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link href={actionHref} className="text-sm text-slate-700 mr-2">
            {actionLabel}
          </Link>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((s) => !s)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              {open ? (
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Home
              </Link>
              <Link
                href="/sign-in"
                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Login
              </Link>
              <Link
                href="/sign-up"
                className="block rounded-md px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50">
                Create account
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
