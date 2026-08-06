-- ============================================================
-- FIX RLS POLICIES - Ensure authenticated users can do full CRUD
-- ============================================================

-- Re-enable RLS on all tables (idempotent)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop and recreate all policies to ensure they are applied correctly

-- students
DROP POLICY IF EXISTS "authenticated_all_students" ON public.students;
CREATE POLICY "authenticated_all_students"
ON public.students FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- staff
DROP POLICY IF EXISTS "authenticated_all_staff" ON public.staff;
CREATE POLICY "authenticated_all_staff"
ON public.staff FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- admissions
DROP POLICY IF EXISTS "authenticated_all_admissions" ON public.admissions;
CREATE POLICY "authenticated_all_admissions"
ON public.admissions FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- fees
DROP POLICY IF EXISTS "authenticated_all_fees" ON public.fees;
CREATE POLICY "authenticated_all_fees"
ON public.fees FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- attendance
DROP POLICY IF EXISTS "authenticated_all_attendance" ON public.attendance;
CREATE POLICY "authenticated_all_attendance"
ON public.attendance FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- salary_payments
DROP POLICY IF EXISTS "authenticated_all_salary_payments" ON public.salary_payments;
CREATE POLICY "authenticated_all_salary_payments"
ON public.salary_payments FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- receipts
DROP POLICY IF EXISTS "authenticated_all_receipts" ON public.receipts;
CREATE POLICY "authenticated_all_receipts"
ON public.receipts FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- leave_applications
DROP POLICY IF EXISTS "authenticated_all_leave_applications" ON public.leave_applications;
CREATE POLICY "authenticated_all_leave_applications"
ON public.leave_applications FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- user_profiles: own profile only
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles FOR ALL TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());
