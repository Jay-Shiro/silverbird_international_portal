export default function TeacherDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
          Teacher portal
        </p>
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          This is the teacher role dashboard shell. Replace this placeholder
          with the class list, attendance records, performance analytics, and
          lesson planning tools for the teacher account.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold">Classes</h2>
            <p className="mt-2 text-sm text-slate-600">
              Manage upcoming lessons and student groups.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold">Attendance</h2>
            <p className="mt-2 text-sm text-slate-600">
              Review classroom presence and absences.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold">Reports</h2>
            <p className="mt-2 text-sm text-slate-600">
              Share academic progress and school updates.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
