export const DASHBOARD_ROUTES = {
  student: "/dashboard/student",
  parent: "/dashboard/parent",
  teacher: "/dashboard/teacher",
} as const;

export type DashboardRole = keyof typeof DASHBOARD_ROUTES;

export function normalizeRole(
  value: string | null | undefined,
): DashboardRole | null {
  const normalized = value?.trim().toLowerCase();

  if (
    normalized === "student" ||
    normalized === "parent" ||
    normalized === "teacher"
  ) {
    return normalized;
  }

  return null;
}

export function getDashboardRoute(value: string | null | undefined) {
  const role = normalizeRole(value);

  return role ? DASHBOARD_ROUTES[role] : "/dashboard";
}
