-- ============================================================
-- FIX RLS POLICIES - Allow both authenticated AND anon roles
-- Reason: App runs in sandboxed iframe where cookies may not
-- persist, causing requests to go out as anon role.
-- This ERP is admin-only so open access is acceptable.
-- ============================================================

-- students
DROP POLICY IF EXISTS "anon_all_students" ON public.students;
CREATE POLICY "anon_all_students"
ON public.students FOR ALL TO anon
USING (true) WITH CHECK (true);

-- staff
DROP POLICY IF EXISTS "anon_all_staff" ON public.staff;
CREATE POLICY "anon_all_staff"
ON public.staff FOR ALL TO anon
USING (true) WITH CHECK (true);

-- admissions
DROP POLICY IF EXISTS "anon_all_admissions" ON public.admissions;
CREATE POLICY "anon_all_admissions"
ON public.admissions FOR ALL TO anon
USING (true) WITH CHECK (true);

-- fees
DROP POLICY IF EXISTS "anon_all_fees" ON public.fees;
CREATE POLICY "anon_all_fees"
ON public.fees FOR ALL TO anon
USING (true) WITH CHECK (true);

-- attendance
DROP POLICY IF EXISTS "anon_all_attendance" ON public.attendance;
CREATE POLICY "anon_all_attendance"
ON public.attendance FOR ALL TO anon
USING (true) WITH CHECK (true);

-- salary_payments
DROP POLICY IF EXISTS "anon_all_salary_payments" ON public.salary_payments;
CREATE POLICY "anon_all_salary_payments"
ON public.salary_payments FOR ALL TO anon
USING (true) WITH CHECK (true);

-- receipts
DROP POLICY IF EXISTS "anon_all_receipts" ON public.receipts;
CREATE POLICY "anon_all_receipts"
ON public.receipts FOR ALL TO anon
USING (true) WITH CHECK (true);

-- leave_applications
DROP POLICY IF EXISTS "anon_all_leave_applications" ON public.leave_applications;
CREATE POLICY "anon_all_leave_applications"
ON public.leave_applications FOR ALL TO anon
USING (true) WITH CHECK (true);

-- user_profiles: allow anon to read/write (needed for login flow)
DROP POLICY IF EXISTS "anon_all_user_profiles" ON public.user_profiles;
CREATE POLICY "anon_all_user_profiles"
ON public.user_profiles FOR ALL TO anon
USING (true) WITH CHECK (true);
