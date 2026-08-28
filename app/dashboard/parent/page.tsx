"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";

export default function ParentDashboardPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  const startLinkGoogle = async () => {
    setIsLinking(true);
    setStatus(null);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard/parent?link=google",
    });
    if (error) {
      setStatus("Failed to start Google linking: " + (error.message || ""));
      setIsLinking(false);
    }
  };

  useEffect(() => {
    (async () => {
      const params = new URL(window.location.href).searchParams;
      const link = params.get("link");
      if (link !== "google") return;
      setIsLinking(true);
      setStatus("Applying Google link to your account...");

      let attempts = 0;
      let s: any = null;
      while (attempts < 10) {
        const resp = await authClient.getSession();
        s = resp.data?.user ?? null;
        if (s?.email) break;
        attempts += 1;
        await new Promise((r) => setTimeout(r, 500));
      }
      if (!s?.email) {
        setStatus("Could not read session after Google sign-in. Please sign in again.");
        setIsLinking(false);
        return;
      }

      try {
        const res = await fetch("/api/debug/mongo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "link-provider", provider: "google", providerData: { image: s.image } }),
        });
        const payload = await res.json();
        if (res.ok && payload?.ok) {
          setStatus("Google account linked successfully.");
          const url = new URL(window.location.href);
          url.searchParams.delete("link");
          window.history.replaceState({}, document.title, url.toString());
        } else {
          setStatus("Failed to link Google: " + (payload?.error || "unknown"));
        }
      } catch (e: any) {
        setStatus("Error linking Google: " + String(e?.message ?? e));
      }
      setIsLinking(false);
    })();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Parent portal
        </p>
        <h1 className="text-3xl font-bold">Parent Dashboard</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          This is the parent role dashboard shell. Replace this placeholder with
          the child progress overview, finance, school notices, and
          communication tools for the parent account.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold">Child Overview</h2>
            <p className="mt-2 text-sm text-slate-600">
              Academic progress, behavior, and updates.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold">Payments</h2>
            <p className="mt-2 text-sm text-slate-600">
              View fees, invoices, and payment status.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold">Messages</h2>
            <p className="mt-2 text-sm text-slate-600">
              School announcements and teacher communication.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded border p-4">
          <h3 className="mb-2 text-lg font-semibold">Linked accounts</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1">Google</div>
            <div>
              <button onClick={startLinkGoogle} disabled={isLinking} className="rounded bg-blue-600 px-3 py-1 text-sm text-white">
                Link Google
              </button>
            </div>
          </div>
          {status && <div className="mt-3 text-sm">{status}</div>}
        </div>
      </div>
    </main>
  );
}
