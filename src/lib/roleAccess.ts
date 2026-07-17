// Role-based access control utility
// Roles: 'admin' | 'staff' | 'student'

export type UserRole = 'admin' | 'staff' | 'student';

const ROLE_KEY = 'gramodyog_role';

export function saveRole(role: UserRole): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ROLE_KEY, role);
  }
}

export function getRole(): UserRole | null {
  if (typeof window === 'undefined') return null;
  const r = localStorage.getItem(ROLE_KEY);
  if (r === 'admin' || r === 'staff' || r === 'student') return r;
  return null;
}

export function clearRole(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ROLE_KEY);
  }
}

// Routes accessible by each role
export const roleRoutes: Record<UserRole, string[]> = {
  admin: [
    '/',
    '/student-management',
    '/fee-management',
    '/staff-attendance',
    '/id-cards',
    '/gate-pass',
    '/college-dashboards',
    '/financial-reconciliation',
    '/enrollment-trends',
    '/defaulter-list',
    '/reports',
    '/staff-payroll',
    '/staff-salary',
    '/leave-management',
    '/settings',
    '/change-password',
  ],
  staff: [
    '/staff-attendance',
    '/staff-payroll',
    '/staff-salary',
    '/leave-management',
    '/change-password',
  ],
  student: [
    '/fee-management',
    '/id-cards',
    '/gate-pass',
    '/change-password',
  ],
};

export function canAccess(role: UserRole | null, path: string): boolean {
  if (!role) return false;
  const allowed = roleRoutes[role];
  return allowed.some((r) => path === r || path.startsWith(r + '/'));
}

export function getDefaultRoute(role: UserRole): string {
  switch (role) {
    case 'admin': return '/';
    case 'staff': return '/staff-attendance';
    case 'student': return '/fee-management';
  }
}
