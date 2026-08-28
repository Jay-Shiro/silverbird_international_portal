export default function StudentDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Student portal
        </p>
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          This is the student role dashboard shell. Replace this placeholder with the
          academic overview, assignments, attendance, exam results, and learning
          resources for the student account.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold">Overview</h2>
            <p className="mt-2 text-sm text-slate-600">Performance summary and recent activity.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold">Assignments</h2>
            <p className="mt-2 text-sm text-slate-600">Track due dates and submitted work.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold">Resources</h2>
            <p className="mt-2 text-sm text-slate-600">Materials, timetables, and school notices.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
