// Role-based access control utility
// Roles: 'admin' | 'staff' | 'student'

export type UserRole = 'admin' | 'staff' | 'student';

const ROLE_KEY = 'gramodyog_role';
const STUDENT_ID_KEY = 'gramodyog_student_id';
const STUDENT_ROLL_KEY = 'gramodyog_student_roll';
const USER_EMAIL_KEY = 'gramodyog_user_email';

// Use sessionStorage so data clears when browser/tab is closed
function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
}

export function saveRole(role: UserRole): void {
  const s = getStorage();
  if (s) s.setItem(ROLE_KEY, role);
}

export function saveUserEmail(email: string): void {
  const s = getStorage();
  if (s) s.setItem(USER_EMAIL_KEY, email);
}

export function getUserEmail(): string | null {
  const s = getStorage();
  return s ? s.getItem(USER_EMAIL_KEY) : null;
}

export function getRole(): UserRole | null {
  const s = getStorage();
  if (!s) return null;
  const r = s.getItem(ROLE_KEY);
  if (r === 'admin' || r === 'staff' || r === 'student') return r;
  return null;
}

export function clearRole(): void {
  const s = getStorage();
  if (!s) return;
  s.removeItem(ROLE_KEY);
  s.removeItem(STUDENT_ID_KEY);
  s.removeItem(STUDENT_ROLL_KEY);
  s.removeItem(USER_EMAIL_KEY);
}

export function saveStudentSession(id: string, roll: string): void {
  const s = getStorage();
  if (s) {
    s.setItem(STUDENT_ID_KEY, id);
    s.setItem(STUDENT_ROLL_KEY, roll);
  }
}

export function getStudentId(): string | null {
  const s = getStorage();
  return s ? s.getItem(STUDENT_ID_KEY) : null;
}

export function getStudentRoll(): string | null {
  const s = getStorage();
  return s ? s.getItem(STUDENT_ROLL_KEY) : null;
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
    '/daily-income-expense',
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
