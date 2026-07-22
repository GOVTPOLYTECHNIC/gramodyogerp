-- ============================================================
-- GRAMODYOG ERP - Initial Database Schema
-- Tables: user_profiles, students, staff, admissions, fees,
--         attendance, salary_payments, receipts, leave_applications
-- ============================================================

-- ============================================================
-- 1. ENUM TYPES
-- ============================================================

DROP TYPE IF EXISTS public.user_role CASCADE;
CREATE TYPE public.user_role AS ENUM ('admin', 'staff', 'student');

DROP TYPE IF EXISTS public.fee_status CASCADE;
CREATE TYPE public.fee_status AS ENUM ('Paid', 'Partial', 'Pending', 'Overdue');

DROP TYPE IF EXISTS public.payment_mode CASCADE;
CREATE TYPE public.payment_mode AS ENUM ('Cash', 'Online', 'DD', 'Cheque');

DROP TYPE IF EXISTS public.gender_type CASCADE;
CREATE TYPE public.gender_type AS ENUM ('Male', 'Female', 'Other');

DROP TYPE IF EXISTS public.category_type CASCADE;
CREATE TYPE public.category_type AS ENUM ('General', 'OBC', 'SC', 'ST');

DROP TYPE IF EXISTS public.school_type CASCADE;
CREATE TYPE public.school_type AS ENUM (
  'Rajiv Gandhi Polytechnic',
  'Rajiv Gandhi ITI',
  'GSS Diploma College'
);

DROP TYPE IF EXISTS public.staff_role CASCADE;
CREATE TYPE public.staff_role AS ENUM (
  'Principal', 'HOD', 'Lecturer', 'Instructor',
  'Lab Assistant', 'Clerk', 'Peon'
);

DROP TYPE IF EXISTS public.payroll_status CASCADE;
CREATE TYPE public.payroll_status AS ENUM ('Paid', 'Pending', 'On Hold');

DROP TYPE IF EXISTS public.leave_type CASCADE;
CREATE TYPE public.leave_type AS ENUM (
  'Casual Leave', 'Sick Leave', 'Earned Leave',
  'Maternity Leave', 'Unpaid Leave'
);

DROP TYPE IF EXISTS public.leave_status CASCADE;
CREATE TYPE public.leave_status AS ENUM ('Pending', 'Approved', 'Rejected');

DROP TYPE IF EXISTS public.attendance_status CASCADE;
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late');

DROP TYPE IF EXISTS public.admission_status CASCADE;
CREATE TYPE public.admission_status AS ENUM ('Active', 'Inactive', 'Cancelled');

-- ============================================================
-- 2. CORE TABLES
-- ============================================================

-- Admin / User Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  role public.user_role DEFAULT 'admin'::public.user_role,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Students
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_no TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  school public.school_type NOT NULL,
  course TEXT NOT NULL,
  semester INTEGER NOT NULL DEFAULT 1,
  lateral_entry BOOLEAN DEFAULT false,
  admission_year TEXT NOT NULL,
  dob TEXT NOT NULL,
  gender public.gender_type NOT NULL DEFAULT 'Male'::public.gender_type,
  guardian_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  fee_status public.fee_status DEFAULT 'Pending'::public.fee_status,
  total_fees NUMERIC(10,2) DEFAULT 0,
  paid_fees NUMERIC(10,2) DEFAULT 0,
  category public.category_type DEFAULT 'General'::public.category_type,
  aadhar TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Staff
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emp_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  college public.school_type NOT NULL,
  department TEXT NOT NULL,
  role public.staff_role NOT NULL DEFAULT 'Lecturer'::public.staff_role,
  designation TEXT DEFAULT '',
  basic_salary NUMERIC(10,2) DEFAULT 0,
  hra NUMERIC(10,2) DEFAULT 0,
  ta NUMERIC(10,2) DEFAULT 0,
  da NUMERIC(10,2) DEFAULT 0,
  pf NUMERIC(10,2) DEFAULT 0,
  tds NUMERIC(10,2) DEFAULT 0,
  other_deductions NUMERIC(10,2) DEFAULT 0,
  joining_date TEXT DEFAULT '',
  bank_account TEXT DEFAULT '',
  ifsc TEXT DEFAULT '',
  bank_name TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Admissions
CREATE TABLE IF NOT EXISTS public.admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  roll_no TEXT NOT NULL,
  student_name TEXT NOT NULL,
  school public.school_type NOT NULL,
  course TEXT NOT NULL,
  semester INTEGER DEFAULT 1,
  admission_year TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  status public.admission_status DEFAULT 'Active'::public.admission_status,
  remarks TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Fees
CREATE TABLE IF NOT EXISTS public.fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_no TEXT NOT NULL UNIQUE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  roll_no TEXT NOT NULL,
  student_name TEXT NOT NULL,
  school public.school_type NOT NULL,
  course TEXT NOT NULL,
  semester INTEGER DEFAULT 1,
  annual_fee NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  paid_amount NUMERIC(10,2) DEFAULT 0,
  payment_date TEXT DEFAULT '',
  payment_mode public.payment_mode DEFAULT 'Cash'::public.payment_mode,
  remarks TEXT DEFAULT '',
  status public.fee_status DEFAULT 'Pending'::public.fee_status,
  academic_year TEXT NOT NULL DEFAULT '2025-26',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Attendance (Staff)
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
  emp_id TEXT NOT NULL,
  staff_name TEXT NOT NULL,
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  month TEXT NOT NULL,
  year TEXT NOT NULL,
  total_days INTEGER DEFAULT 26,
  present_days INTEGER DEFAULT 0,
  absent_days INTEGER DEFAULT 0,
  late_days INTEGER DEFAULT 0,
  leave_days INTEGER DEFAULT 0,
  status public.attendance_status DEFAULT 'present'::public.attendance_status,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Salary / Payroll Payments
CREATE TABLE IF NOT EXISTS public.salary_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
  staff_name TEXT NOT NULL,
  emp_id TEXT NOT NULL,
  college public.school_type NOT NULL,
  month TEXT NOT NULL,
  year TEXT NOT NULL,
  gross_salary NUMERIC(10,2) DEFAULT 0,
  attendance_deduction NUMERIC(10,2) DEFAULT 0,
  total_deductions NUMERIC(10,2) DEFAULT 0,
  net_salary NUMERIC(10,2) DEFAULT 0,
  status public.payroll_status DEFAULT 'Pending'::public.payroll_status,
  paid_date TEXT DEFAULT '',
  transaction_id TEXT DEFAULT '',
  remarks TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Receipts
CREATE TABLE IF NOT EXISTS public.receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_no TEXT NOT NULL UNIQUE,
  receipt_type TEXT NOT NULL DEFAULT 'fee',
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  roll_no TEXT DEFAULT '',
  student_name TEXT DEFAULT '',
  school public.school_type,
  amount NUMERIC(10,2) DEFAULT 0,
  payment_mode public.payment_mode DEFAULT 'Cash'::public.payment_mode,
  payment_date TEXT DEFAULT '',
  academic_year TEXT DEFAULT '2025-26',
  remarks TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Leave Applications
CREATE TABLE IF NOT EXISTS public.leave_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
  staff_name TEXT NOT NULL,
  emp_id TEXT NOT NULL,
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  role TEXT NOT NULL,
  leave_type public.leave_type NOT NULL,
  from_date TEXT NOT NULL,
  to_date TEXT NOT NULL,
  days INTEGER DEFAULT 1,
  reason TEXT NOT NULL DEFAULT '',
  status public.leave_status DEFAULT 'Pending'::public.leave_status,
  applied_on TEXT NOT NULL,
  approved_by TEXT DEFAULT '',
  approved_on TEXT DEFAULT '',
  remarks TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_students_roll_no ON public.students(roll_no);
CREATE INDEX IF NOT EXISTS idx_students_school ON public.students(school);
CREATE INDEX IF NOT EXISTS idx_students_fee_status ON public.students(fee_status);
CREATE INDEX IF NOT EXISTS idx_staff_emp_id ON public.staff(emp_id);
CREATE INDEX IF NOT EXISTS idx_staff_college ON public.staff(college);
CREATE INDEX IF NOT EXISTS idx_fees_student_id ON public.fees(student_id);
CREATE INDEX IF NOT EXISTS idx_fees_roll_no ON public.fees(roll_no);
CREATE INDEX IF NOT EXISTS idx_fees_status ON public.fees(status);
CREATE INDEX IF NOT EXISTS idx_attendance_staff_id ON public.attendance(staff_id);
CREATE INDEX IF NOT EXISTS idx_attendance_month_year ON public.attendance(month, year);
CREATE INDEX IF NOT EXISTS idx_salary_payments_staff_id ON public.salary_payments(staff_id);
CREATE INDEX IF NOT EXISTS idx_salary_payments_month_year ON public.salary_payments(month, year);
CREATE INDEX IF NOT EXISTS idx_leave_applications_staff_id ON public.leave_applications(staff_id);
CREATE INDEX IF NOT EXISTS idx_leave_applications_status ON public.leave_applications(status);
CREATE INDEX IF NOT EXISTS idx_admissions_student_id ON public.admissions(student_id);
CREATE INDEX IF NOT EXISTS idx_receipts_receipt_no ON public.receipts(receipt_no);

-- ============================================================
-- 4. FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')::public.user_role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- ============================================================
-- 5. ENABLE RLS
-- ============================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_applications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. RLS POLICIES
-- ============================================================

-- user_profiles: own profile only
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles FOR ALL TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- All other tables: authenticated users can do everything (admin-managed ERP)
DROP POLICY IF EXISTS "authenticated_all_students" ON public.students;
CREATE POLICY "authenticated_all_students"
ON public.students FOR ALL TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_all_staff" ON public.staff;
CREATE POLICY "authenticated_all_staff"
ON public.staff FOR ALL TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_all_admissions" ON public.admissions;
CREATE POLICY "authenticated_all_admissions"
ON public.admissions FOR ALL TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_all_fees" ON public.fees;
CREATE POLICY "authenticated_all_fees"
ON public.fees FOR ALL TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_all_attendance" ON public.attendance;
CREATE POLICY "authenticated_all_attendance"
ON public.attendance FOR ALL TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_all_salary_payments" ON public.salary_payments;
CREATE POLICY "authenticated_all_salary_payments"
ON public.salary_payments FOR ALL TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_all_receipts" ON public.receipts;
CREATE POLICY "authenticated_all_receipts"
ON public.receipts FOR ALL TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_all_leave_applications" ON public.leave_applications;
CREATE POLICY "authenticated_all_leave_applications"
ON public.leave_applications FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- ============================================================
-- 7. TRIGGERS
-- ============================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_staff_updated_at ON public.staff;
CREATE TRIGGER update_staff_updated_at
  BEFORE UPDATE ON public.staff
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_fees_updated_at ON public.fees;
CREATE TRIGGER update_fees_updated_at
  BEFORE UPDATE ON public.fees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_salary_payments_updated_at ON public.salary_payments;
CREATE TRIGGER update_salary_payments_updated_at
  BEFORE UPDATE ON public.salary_payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 8. MOCK DATA
-- ============================================================

DO $$
DECLARE
  -- Student UUIDs
  s1 UUID := gen_random_uuid();
  s2 UUID := gen_random_uuid();
  s3 UUID := gen_random_uuid();
  s4 UUID := gen_random_uuid();
  s5 UUID := gen_random_uuid();
  s6 UUID := gen_random_uuid();
  s7 UUID := gen_random_uuid();
  s8 UUID := gen_random_uuid();
  s9 UUID := gen_random_uuid();
  s10 UUID := gen_random_uuid();
  s11 UUID := gen_random_uuid();
  s12 UUID := gen_random_uuid();
  -- Staff UUIDs
  st1 UUID := gen_random_uuid();
  st2 UUID := gen_random_uuid();
  st3 UUID := gen_random_uuid();
  st4 UUID := gen_random_uuid();
  st5 UUID := gen_random_uuid();
  st6 UUID := gen_random_uuid();
  st7 UUID := gen_random_uuid();
  st8 UUID := gen_random_uuid();
  st9 UUID := gen_random_uuid();
BEGIN

  -- ---- STUDENTS ----
  INSERT INTO public.students (id, roll_no, name, school, course, semester, lateral_entry, admission_year, dob, gender, guardian_name, phone, address, fee_status, total_fees, paid_fees, category, aadhar) VALUES
    (s1, 'RGP-2026-001', 'Priya Sharma', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Civil Engineering', 2, false, '2025', '12/03/2005', 'Female'::public.gender_type, 'Ramesh Sharma', '9876543210', 'Village Rampur, Dist. Varanasi, UP', 'Paid'::public.fee_status, 20000, 20000, 'General'::public.category_type, '2345 6789 0123'),
    (s2, 'RGP-2026-002', 'Aakash Patel', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Mechanical Engineering', 4, false, '2024', '07/08/2004', 'Male'::public.gender_type, 'Suresh Patel', '9823456780', 'Mohalla Shivpuri, Mirzapur, UP', 'Partial'::public.fee_status, 20000, 10000, 'OBC'::public.category_type, '3456 7890 1234'),
    (s3, 'RGP-2026-003', 'Neha Gupta', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Electrical Engineering', 1, false, '2026', '22/11/2007', 'Female'::public.gender_type, 'Dinesh Gupta', '9765432109', 'Nagar Panchayat, Bhadohi, UP', 'Pending'::public.fee_status, 20000, 0, 'General'::public.category_type, '4567 8901 2345'),
    (s4, 'RGP-2026-004', 'Vikram Singh Yadav', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Civil Engineering', 3, true, '2025', '15/06/2003', 'Male'::public.gender_type, 'Hariom Yadav', '9654321098', 'Village Chakia, Chandauli, UP', 'Paid'::public.fee_status, 25000, 25000, 'OBC'::public.category_type, '5678 9012 3456'),
    (s5, 'ITI-2026-001', 'Ramu Kevat', 'Rajiv Gandhi ITI'::public.school_type, 'Fitter', 2, false, '2025', '03/01/2006', 'Male'::public.gender_type, 'Shivlal Kevat', '9543210987', 'Gram Sabha Kevat Tola, Ghazipur, UP', 'Paid'::public.fee_status, 15000, 15000, 'SC'::public.category_type, '6789 0123 4567'),
    (s6, 'ITI-2026-002', 'Anita Maurya', 'Rajiv Gandhi ITI'::public.school_type, 'Electrician', 1, false, '2026', '18/09/2007', 'Female'::public.gender_type, 'Jagdish Maurya', '9432109876', 'Mohalla Umarpur, Azamgarh, UP', 'Overdue'::public.fee_status, 15000, 0, 'OBC'::public.category_type, '7890 1234 5678'),
    (s7, 'ITI-2026-003', 'Santosh Kumar', 'Rajiv Gandhi ITI'::public.school_type, 'Welder', 3, false, '2025', '27/04/2005', 'Male'::public.gender_type, 'Lalmani Kumar', '9321098765', 'Village Sarai, Jaunpur, UP', 'Partial'::public.fee_status, 15000, 8000, 'ST'::public.category_type, '8901 2345 6789'),
    (s8, 'ITI-2026-004', 'Pooja Bind', 'Rajiv Gandhi ITI'::public.school_type, 'Fitter', 4, false, '2024', '09/12/2004', 'Female'::public.gender_type, 'Ramkhelawan Bind', '9210987654', 'Nai Basti, Allahabad, UP', 'Paid'::public.fee_status, 15000, 15000, 'OBC'::public.category_type, '9012 3456 7890'),
    (s9, 'GSS-2026-001', 'Sunita Devi', 'GSS Diploma College'::public.school_type, 'Diploma in Special Education (HI)', 2, false, '2025', '14/07/1998', 'Female'::public.gender_type, 'Rajendra Prasad', '9109876543', 'Gram Devpura, Sonbhadra, UP', 'Paid'::public.fee_status, 40000, 40000, 'SC'::public.category_type, '0123 4567 8901'),
    (s10, 'GSS-2026-002', 'Manoj Tiwari', 'GSS Diploma College'::public.school_type, 'Diploma in Special Education (MR)', 1, false, '2026', '30/05/1999', 'Male'::public.gender_type, 'Kailash Tiwari', '9098765432', 'Colony Tiwari Niwas, Gorakhpur, UP', 'Pending'::public.fee_status, 40000, 0, 'General'::public.category_type, '1234 5678 9012'),
    (s11, 'RGP-2026-005', 'Deepak Rajbhar', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Mechanical Engineering', 5, false, '2023', '11/02/2003', 'Male'::public.gender_type, 'Ramadhar Rajbhar', '8987654321', 'Village Durgapur, Ballia, UP', 'Overdue'::public.fee_status, 20000, 5000, 'OBC'::public.category_type, '2345 6780 1234'),
    (s12, 'ITI-2026-005', 'Kavita Chauhan', 'Rajiv Gandhi ITI'::public.school_type, 'Electrician', 2, false, '2025', '25/10/2005', 'Female'::public.gender_type, 'Shambhu Chauhan', '8876543210', 'Mohalla Chauhan Tola, Deoria, UP', 'Paid'::public.fee_status, 15000, 15000, 'General'::public.category_type, '3456 7801 2345')
  ON CONFLICT (roll_no) DO NOTHING;

  -- ---- STAFF ----
  INSERT INTO public.staff (id, emp_id, name, college, department, role, designation, basic_salary, hra, ta, da, pf, tds, other_deductions, joining_date, bank_account, ifsc, bank_name) VALUES
    (st1, 'RGP-EMP-001', 'Dr. Ramesh Chandra Mishra', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Civil Engineering', 'Principal'::public.staff_role, 'Principal', 55000, 13750, 3000, 5500, 6600, 4200, 500, '01/04/2015', '1234567890', 'SBIN0001234', 'State Bank of India'),
    (st2, 'RGP-EMP-002', 'Suresh Kumar Verma', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Mechanical Engineering', 'HOD'::public.staff_role, 'HOD', 42000, 10500, 2500, 4200, 5040, 2800, 300, '15/07/2018', '2345678901', 'SBIN0001234', 'State Bank of India'),
    (st3, 'RGP-EMP-003', 'Priti Singh', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Electrical Engineering', 'Lecturer'::public.staff_role, 'Lecturer', 32000, 8000, 2000, 3200, 3840, 1500, 200, '01/08/2020', '3456789012', 'SBIN0001234', 'State Bank of India'),
    (st4, 'ITI-EMP-001', 'Mohan Lal Yadav', 'Rajiv Gandhi ITI'::public.school_type, 'Fitter Trade', 'Instructor'::public.staff_role, 'Instructor', 28000, 7000, 1800, 2800, 3360, 800, 200, '10/06/2019', '4567890123', 'PUNB0001234', 'Punjab National Bank'),
    (st5, 'ITI-EMP-002', 'Geeta Devi Chauhan', 'Rajiv Gandhi ITI'::public.school_type, 'Electrician Trade', 'Instructor'::public.staff_role, 'Instructor', 28000, 7000, 1800, 2800, 3360, 800, 200, '01/01/2021', '5678901234', 'PUNB0001234', 'Punjab National Bank'),
    (st6, 'ITI-EMP-003', 'Rajesh Bind', 'Rajiv Gandhi ITI'::public.school_type, 'Workshop', 'Lab Assistant'::public.staff_role, 'Lab Assistant', 18000, 4500, 1200, 1800, 2160, 0, 100, '05/03/2022', '6789012345', 'PUNB0001234', 'Punjab National Bank'),
    (st7, 'GSS-EMP-001', 'Dr. Anupama Srivastava', 'GSS Diploma College'::public.school_type, 'Special Education', 'Principal'::public.staff_role, 'Principal', 50000, 12500, 3000, 5000, 6000, 3800, 500, '01/07/2012', '7890123456', 'HDFC0001234', 'HDFC Bank'),
    (st8, 'GSS-EMP-002', 'Kavita Pandey', 'GSS Diploma College'::public.school_type, 'Special Education (HI)', 'Lecturer'::public.staff_role, 'Lecturer', 30000, 7500, 2000, 3000, 3600, 1200, 200, '15/09/2019', '8901234567', 'HDFC0001234', 'HDFC Bank'),
    (st9, 'RGP-EMP-004', 'Dinesh Prasad Gupta', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Administration', 'Clerk'::public.staff_role, 'Clerk', 20000, 5000, 1500, 2000, 2400, 0, 100, '20/11/2017', '9012345678', 'SBIN0001234', 'State Bank of India')
  ON CONFLICT (emp_id) DO NOTHING;

  -- ---- ADMISSIONS ----
  INSERT INTO public.admissions (student_id, roll_no, student_name, school, course, semester, admission_year, academic_year, status) VALUES
    (s1, 'RGP-2026-001', 'Priya Sharma', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Civil Engineering', 2, '2025', '2025-26', 'Active'::public.admission_status),
    (s2, 'RGP-2026-002', 'Aakash Patel', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Mechanical Engineering', 4, '2024', '2025-26', 'Active'::public.admission_status),
    (s3, 'RGP-2026-003', 'Neha Gupta', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Electrical Engineering', 1, '2026', '2025-26', 'Active'::public.admission_status),
    (s4, 'RGP-2026-004', 'Vikram Singh Yadav', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Civil Engineering', 3, '2025', '2025-26', 'Active'::public.admission_status),
    (s5, 'ITI-2026-001', 'Ramu Kevat', 'Rajiv Gandhi ITI'::public.school_type, 'Fitter', 2, '2025', '2025-26', 'Active'::public.admission_status),
    (s6, 'ITI-2026-002', 'Anita Maurya', 'Rajiv Gandhi ITI'::public.school_type, 'Electrician', 1, '2026', '2025-26', 'Active'::public.admission_status),
    (s7, 'ITI-2026-003', 'Santosh Kumar', 'Rajiv Gandhi ITI'::public.school_type, 'Welder', 3, '2025', '2025-26', 'Active'::public.admission_status),
    (s8, 'ITI-2026-004', 'Pooja Bind', 'Rajiv Gandhi ITI'::public.school_type, 'Fitter', 4, '2024', '2025-26', 'Active'::public.admission_status),
    (s9, 'GSS-2026-001', 'Sunita Devi', 'GSS Diploma College'::public.school_type, 'Diploma in Special Education (HI)', 2, '2025', '2025-26', 'Active'::public.admission_status),
    (s10, 'GSS-2026-002', 'Manoj Tiwari', 'GSS Diploma College'::public.school_type, 'Diploma in Special Education (MR)', 1, '2026', '2025-26', 'Active'::public.admission_status),
    (s11, 'RGP-2026-005', 'Deepak Rajbhar', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Mechanical Engineering', 5, '2023', '2025-26', 'Active'::public.admission_status),
    (s12, 'ITI-2026-005', 'Kavita Chauhan', 'Rajiv Gandhi ITI'::public.school_type, 'Electrician', 2, '2025', '2025-26', 'Active'::public.admission_status)
  ON CONFLICT DO NOTHING;

  -- ---- FEES ----
  INSERT INTO public.fees (receipt_no, student_id, roll_no, student_name, school, course, semester, annual_fee, discount, paid_amount, payment_date, payment_mode, remarks, status, academic_year) VALUES
    ('RGP-REC-2026-0217', s1, 'RGP-2026-001', 'Priya Sharma', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Civil Engineering', 2, 20000, 0, 20000, '17/07/2026', 'Online'::public.payment_mode, 'Full payment', 'Paid'::public.fee_status, '2025-26'),
    ('RGP-REC-2026-0216', s2, 'RGP-2026-002', 'Aakash Patel', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Mechanical Engineering', 4, 20000, 0, 10000, '15/07/2026', 'Cash'::public.payment_mode, 'First instalment', 'Partial'::public.fee_status, '2025-26'),
    ('RGP-REC-2026-0215', s3, 'RGP-2026-003', 'Neha Gupta', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Electrical Engineering', 1, 20000, 0, 0, '', 'Cash'::public.payment_mode, '', 'Pending'::public.fee_status, '2025-26'),
    ('RGP-REC-2026-0214', s4, 'RGP-2026-004', 'Vikram Singh Yadav', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Civil Engineering', 3, 25000, 2000, 25000, '10/07/2026', 'DD'::public.payment_mode, 'Lateral entry, Rs.2000 merit discount', 'Paid'::public.fee_status, '2025-26'),
    ('ITI-REC-2026-0079', s5, 'ITI-2026-001', 'Ramu Kevat', 'Rajiv Gandhi ITI'::public.school_type, 'Fitter', 2, 15000, 1500, 15000, '12/07/2026', 'Online'::public.payment_mode, 'SC category scholarship discount', 'Paid'::public.fee_status, '2025-26'),
    ('ITI-REC-2026-0078', s6, 'ITI-2026-002', 'Anita Maurya', 'Rajiv Gandhi ITI'::public.school_type, 'Electrician', 1, 15000, 0, 0, '', 'Cash'::public.payment_mode, 'Overdue since April 2026', 'Overdue'::public.fee_status, '2025-26'),
    ('ITI-REC-2026-0077', s7, 'ITI-2026-003', 'Santosh Kumar', 'Rajiv Gandhi ITI'::public.school_type, 'Welder', 3, 15000, 500, 8000, '05/07/2026', 'Cash'::public.payment_mode, 'Partial - balance due', 'Partial'::public.fee_status, '2025-26'),
    ('ITI-REC-2026-0076', s8, 'ITI-2026-004', 'Pooja Bind', 'Rajiv Gandhi ITI'::public.school_type, 'Fitter', 4, 15000, 0, 15000, '01/07/2026', 'Cheque'::public.payment_mode, 'Full payment by cheque', 'Paid'::public.fee_status, '2025-26'),
    ('GSS-REC-2026-0040', s9, 'GSS-2026-001', 'Sunita Devi', 'GSS Diploma College'::public.school_type, 'Diploma in Special Education (HI)', 2, 40000, 5000, 40000, '08/07/2026', 'Online'::public.payment_mode, 'Full fee, Rs.5000 govt. scholarship adjusted', 'Paid'::public.fee_status, '2025-26'),
    ('GSS-REC-2026-0039', s10, 'GSS-2026-002', 'Manoj Tiwari', 'GSS Diploma College'::public.school_type, 'Diploma in Special Education (MR)', 1, 40000, 0, 0, '', 'Cash'::public.payment_mode, '', 'Pending'::public.fee_status, '2025-26'),
    ('RGP-REC-2026-0213', s11, 'RGP-2026-005', 'Deepak Rajbhar', 'Rajiv Gandhi Polytechnic'::public.school_type, 'Mechanical Engineering', 5, 20000, 0, 5000, '20/04/2026', 'Cash'::public.payment_mode, 'Overdue - last payment April 2026', 'Overdue'::public.fee_status, '2025-26'),
    ('ITI-REC-2026-0075', s12, 'ITI-2026-005', 'Kavita Chauhan', 'Rajiv Gandhi ITI'::public.school_type, 'Electrician', 2, 15000, 0, 15000, '14/07/2026', 'Online'::public.payment_mode, 'Full payment online', 'Paid'::public.fee_status, '2025-26')
  ON CONFLICT (receipt_no) DO NOTHING;

  -- ---- ATTENDANCE ----
  INSERT INTO public.attendance (staff_id, emp_id, staff_name, attendance_date, month, year, total_days, present_days, absent_days, late_days, leave_days, status) VALUES
    (st1, 'RGP-EMP-001', 'Dr. Ramesh Chandra Mishra', CURRENT_DATE, 'July', '2026', 26, 26, 0, 0, 0, 'present'::public.attendance_status),
    (st2, 'RGP-EMP-002', 'Suresh Kumar Verma', CURRENT_DATE, 'July', '2026', 26, 24, 1, 1, 0, 'present'::public.attendance_status),
    (st3, 'RGP-EMP-003', 'Priti Singh', CURRENT_DATE, 'July', '2026', 26, 22, 2, 2, 0, 'late'::public.attendance_status),
    (st4, 'ITI-EMP-001', 'Mohan Lal Yadav', CURRENT_DATE, 'July', '2026', 26, 25, 1, 0, 0, 'present'::public.attendance_status),
    (st5, 'ITI-EMP-002', 'Geeta Devi Chauhan', CURRENT_DATE, 'July', '2026', 26, 26, 0, 0, 0, 'present'::public.attendance_status),
    (st6, 'ITI-EMP-003', 'Rajesh Bind', CURRENT_DATE, 'July', '2026', 26, 20, 4, 2, 0, 'absent'::public.attendance_status),
    (st7, 'GSS-EMP-001', 'Dr. Anupama Srivastava', CURRENT_DATE, 'July', '2026', 26, 26, 0, 0, 0, 'present'::public.attendance_status),
    (st8, 'GSS-EMP-002', 'Kavita Pandey', CURRENT_DATE, 'July', '2026', 26, 23, 1, 2, 0, 'present'::public.attendance_status),
    (st9, 'RGP-EMP-004', 'Dinesh Prasad Gupta', CURRENT_DATE, 'July', '2026', 26, 24, 2, 0, 0, 'present'::public.attendance_status)
  ON CONFLICT DO NOTHING;

  -- ---- SALARY PAYMENTS ----
  INSERT INTO public.salary_payments (staff_id, staff_name, emp_id, college, month, year, gross_salary, attendance_deduction, total_deductions, net_salary, status, paid_date, transaction_id) VALUES
    (st1, 'Dr. Ramesh Chandra Mishra', 'RGP-EMP-001', 'Rajiv Gandhi Polytechnic'::public.school_type, 'June', '2026', 77250, 0, 11300, 65950, 'Paid'::public.payroll_status, '30/06/2026', 'TXN20260630001'),
    (st2, 'Suresh Kumar Verma', 'RGP-EMP-002', 'Rajiv Gandhi Polytechnic'::public.school_type, 'June', '2026', 59200, 4736, 12876, 46324, 'Paid'::public.payroll_status, '30/06/2026', 'TXN20260630002'),
    (st3, 'Priti Singh', 'RGP-EMP-003', 'Rajiv Gandhi Polytechnic'::public.school_type, 'June', '2026', 45200, 0, 5540, 39660, 'Paid'::public.payroll_status, '30/06/2026', 'TXN20260630003'),
    (st4, 'Mohan Lal Yadav', 'ITI-EMP-001', 'Rajiv Gandhi ITI'::public.school_type, 'June', '2026', 39600, 1584, 5944, 33656, 'Paid'::public.payroll_status, '30/06/2026', 'TXN20260630004'),
    (st5, 'Geeta Devi Chauhan', 'ITI-EMP-002', 'Rajiv Gandhi ITI'::public.school_type, 'June', '2026', 39600, 0, 4360, 35240, 'Paid'::public.payroll_status, '30/06/2026', 'TXN20260630005'),
    (st6, 'Rajesh Bind', 'ITI-EMP-003', 'Rajiv Gandhi ITI'::public.school_type, 'June', '2026', 25500, 3060, 5320, 20180, 'Paid'::public.payroll_status, '30/06/2026', 'TXN20260630006'),
    (st7, 'Dr. Anupama Srivastava', 'GSS-EMP-001', 'GSS Diploma College'::public.school_type, 'June', '2026', 70500, 0, 10300, 60200, 'Paid'::public.payroll_status, '30/06/2026', 'TXN20260630007'),
    (st8, 'Kavita Pandey', 'GSS-EMP-002', 'GSS Diploma College'::public.school_type, 'June', '2026', 42500, 1700, 6700, 35800, 'Paid'::public.payroll_status, '30/06/2026', 'TXN20260630008'),
    (st9, 'Dinesh Prasad Gupta', 'RGP-EMP-004', 'Rajiv Gandhi Polytechnic'::public.school_type, 'June', '2026', 28500, 0, 2500, 26000, 'Paid'::public.payroll_status, '30/06/2026', 'TXN20260630009'),
    -- July 2026 Pending
    (st1, 'Dr. Ramesh Chandra Mishra', 'RGP-EMP-001', 'Rajiv Gandhi Polytechnic'::public.school_type, 'July', '2026', 77250, 0, 11300, 65950, 'Pending'::public.payroll_status, '', ''),
    (st2, 'Suresh Kumar Verma', 'RGP-EMP-002', 'Rajiv Gandhi Polytechnic'::public.school_type, 'July', '2026', 59200, 2277, 10417, 48783, 'Pending'::public.payroll_status, '', ''),
    (st3, 'Priti Singh', 'RGP-EMP-003', 'Rajiv Gandhi Polytechnic'::public.school_type, 'July', '2026', 45200, 3477, 9017, 36183, 'Pending'::public.payroll_status, '', ''),
    (st4, 'Mohan Lal Yadav', 'ITI-EMP-001', 'Rajiv Gandhi ITI'::public.school_type, 'July', '2026', 39600, 1523, 5883, 33717, 'Pending'::public.payroll_status, '', ''),
    (st5, 'Geeta Devi Chauhan', 'ITI-EMP-002', 'Rajiv Gandhi ITI'::public.school_type, 'July', '2026', 39600, 0, 4360, 35240, 'Pending'::public.payroll_status, '', ''),
    (st6, 'Rajesh Bind', 'ITI-EMP-003', 'Rajiv Gandhi ITI'::public.school_type, 'July', '2026', 25500, 3923, 6183, 19317, 'On Hold'::public.payroll_status, '', ''),
    (st7, 'Dr. Anupama Srivastava', 'GSS-EMP-001', 'GSS Diploma College'::public.school_type, 'July', '2026', 70500, 0, 10300, 60200, 'Pending'::public.payroll_status, '', ''),
    (st8, 'Kavita Pandey', 'GSS-EMP-002', 'GSS Diploma College'::public.school_type, 'July', '2026', 42500, 3269, 8269, 34231, 'Pending'::public.payroll_status, '', ''),
    (st9, 'Dinesh Prasad Gupta', 'RGP-EMP-004', 'Rajiv Gandhi Polytechnic'::public.school_type, 'July', '2026', 28500, 2192, 4692, 23808, 'Pending'::public.payroll_status, '', '')
  ON CONFLICT DO NOTHING;

  -- ---- LEAVE APPLICATIONS ----
  INSERT INTO public.leave_applications (staff_id, staff_name, emp_id, college, department, role, leave_type, from_date, to_date, days, reason, status, applied_on, approved_by, approved_on, remarks) VALUES
    (st3, 'Priti Singh', 'RGP-EMP-003', 'Rajiv Gandhi Polytechnic', 'Electrical Engineering', 'Lecturer', 'Sick Leave'::public.leave_type, '14/07/2026', '16/07/2026', 3, 'Fever and viral infection, doctor advised rest for 3 days.', 'Pending'::public.leave_status, '13/07/2026', '', '', ''),
    (st4, 'Mohan Lal Yadav', 'ITI-EMP-001', 'Rajiv Gandhi ITI', 'Fitter Trade', 'Instructor', 'Casual Leave'::public.leave_type, '18/07/2026', '19/07/2026', 2, 'Family function - daughter school admission ceremony.', 'Approved'::public.leave_status, '10/07/2026', 'Dr. Ramesh Chandra Mishra', '11/07/2026', 'Approved. Ensure class arrangements are made.'),
    (st8, 'Kavita Pandey', 'GSS-EMP-002', 'GSS Diploma College', 'Special Education (HI)', 'Lecturer', 'Earned Leave'::public.leave_type, '21/07/2026', '25/07/2026', 5, 'Annual family vacation - planned trip to Uttarakhand.', 'Pending'::public.leave_status, '08/07/2026', '', '', ''),
    (st6, 'Rajesh Bind', 'ITI-EMP-003', 'Rajiv Gandhi ITI', 'Workshop', 'Lab Assistant', 'Casual Leave'::public.leave_type, '05/07/2026', '05/07/2026', 1, 'Personal work - bank related documentation.', 'Rejected'::public.leave_status, '04/07/2026', 'Dr. Ramesh Chandra Mishra', '04/07/2026', 'Rejected - critical lab session scheduled. Please reschedule.'),
    (st2, 'Suresh Kumar Verma', 'RGP-EMP-002', 'Rajiv Gandhi Polytechnic', 'Mechanical Engineering', 'HOD', 'Sick Leave'::public.leave_type, '01/07/2026', '03/07/2026', 3, 'Hospitalization for minor surgery. Medical certificate attached.', 'Approved'::public.leave_status, '30/06/2026', 'Dr. Ramesh Chandra Mishra', '30/06/2026', 'Approved. Get well soon.'),
    (st9, 'Dinesh Prasad Gupta', 'RGP-EMP-004', 'Rajiv Gandhi Polytechnic', 'Administration', 'Clerk', 'Casual Leave'::public.leave_type, '22/07/2026', '22/07/2026', 1, 'Attending son school sports day event.', 'Pending'::public.leave_status, '17/07/2026', '', '', ''),
    (st5, 'Geeta Devi Chauhan', 'ITI-EMP-002', 'Rajiv Gandhi ITI', 'Electrician Trade', 'Instructor', 'Maternity Leave'::public.leave_type, '01/08/2026', '31/10/2026', 91, 'Maternity leave as per government norms.', 'Approved'::public.leave_status, '15/07/2026', 'Dr. Ramesh Chandra Mishra', '16/07/2026', 'Approved as per Maternity Benefit Act.')
  ON CONFLICT DO NOTHING;

  -- ---- RECEIPTS (from fee records) ----
  INSERT INTO public.receipts (receipt_no, receipt_type, student_id, roll_no, student_name, school, amount, payment_mode, payment_date, academic_year, remarks) VALUES
    ('RGP-REC-2026-0217', 'fee', s1, 'RGP-2026-001', 'Priya Sharma', 'Rajiv Gandhi Polytechnic'::public.school_type, 20000, 'Online'::public.payment_mode, '17/07/2026', '2025-26', 'Full payment'),
    ('RGP-REC-2026-0216', 'fee', s2, 'RGP-2026-002', 'Aakash Patel', 'Rajiv Gandhi Polytechnic'::public.school_type, 10000, 'Cash'::public.payment_mode, '15/07/2026', '2025-26', 'First instalment'),
    ('RGP-REC-2026-0214', 'fee', s4, 'RGP-2026-004', 'Vikram Singh Yadav', 'Rajiv Gandhi Polytechnic'::public.school_type, 25000, 'DD'::public.payment_mode, '10/07/2026', '2025-26', 'Lateral entry'),
    ('ITI-REC-2026-0079', 'fee', s5, 'ITI-2026-001', 'Ramu Kevat', 'Rajiv Gandhi ITI'::public.school_type, 15000, 'Online'::public.payment_mode, '12/07/2026', '2025-26', 'SC scholarship'),
    ('ITI-REC-2026-0077', 'fee', s7, 'ITI-2026-003', 'Santosh Kumar', 'Rajiv Gandhi ITI'::public.school_type, 8000, 'Cash'::public.payment_mode, '05/07/2026', '2025-26', 'Partial payment'),
    ('ITI-REC-2026-0076', 'fee', s8, 'ITI-2026-004', 'Pooja Bind', 'Rajiv Gandhi ITI'::public.school_type, 15000, 'Cheque'::public.payment_mode, '01/07/2026', '2025-26', 'Full payment'),
    ('GSS-REC-2026-0040', 'fee', s9, 'GSS-2026-001', 'Sunita Devi', 'GSS Diploma College'::public.school_type, 40000, 'Online'::public.payment_mode, '08/07/2026', '2025-26', 'Full fee'),
    ('RGP-REC-2026-0213', 'fee', s11, 'RGP-2026-005', 'Deepak Rajbhar', 'Rajiv Gandhi Polytechnic'::public.school_type, 5000, 'Cash'::public.payment_mode, '20/04/2026', '2025-26', 'Partial overdue'),
    ('ITI-REC-2026-0075', 'fee', s12, 'ITI-2026-005', 'Kavita Chauhan', 'Rajiv Gandhi ITI'::public.school_type, 15000, 'Online'::public.payment_mode, '14/07/2026', '2025-26', 'Full payment online')
  ON CONFLICT (receipt_no) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;
