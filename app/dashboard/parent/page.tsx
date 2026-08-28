export default function ParentDashboardPage() {
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
      </div>
    </main>
  );
}
