-- Daily Income & Expense Module
-- Migration: 20260803092305_daily_income_expense.sql

CREATE TABLE IF NOT EXISTS public.daily_income_expense (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_date DATE NOT NULL,
    entry_type TEXT NOT NULL CHECK (entry_type IN ('income', 'expense')),
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    payment_mode TEXT NOT NULL DEFAULT 'cash',
    reference_no TEXT,
    remarks TEXT,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_daily_ie_entry_date ON public.daily_income_expense(entry_date);
CREATE INDEX IF NOT EXISTS idx_daily_ie_entry_type ON public.daily_income_expense(entry_type);
CREATE INDEX IF NOT EXISTS idx_daily_ie_created_by ON public.daily_income_expense(created_by);

ALTER TABLE public.daily_income_expense ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_manage_daily_ie" ON public.daily_income_expense;
CREATE POLICY "authenticated_manage_daily_ie"
ON public.daily_income_expense
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Sample data
DO $$
DECLARE
    existing_user_id UUID;
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'user_profiles'
    ) THEN
        SELECT id INTO existing_user_id FROM public.user_profiles LIMIT 1;
    END IF;

    INSERT INTO public.daily_income_expense (id, entry_date, entry_type, category, description, amount, payment_mode, reference_no, remarks, created_by) VALUES
        (gen_random_uuid(), CURRENT_DATE, 'income', 'Fee Collection', 'Student fee collection - July batch', 15000.00, 'cash', 'RCP-001', 'Regular fee', existing_user_id),
        (gen_random_uuid(), CURRENT_DATE, 'income', 'Donation', 'Alumni donation received', 5000.00, 'bank_transfer', 'TXN-2026-001', NULL, existing_user_id),
        (gen_random_uuid(), CURRENT_DATE, 'expense', 'Electricity', 'Monthly electricity bill', 3200.00, 'bank_transfer', 'BILL-07-2026', 'July bill', existing_user_id),
        (gen_random_uuid(), CURRENT_DATE, 'expense', 'Stationery', 'Office stationery purchase', 850.00, 'cash', NULL, NULL, existing_user_id),
        (gen_random_uuid(), CURRENT_DATE - INTERVAL '1 day', 'income', 'Fee Collection', 'Late fee collection', 2500.00, 'upi', 'UPI-20260802', NULL, existing_user_id),
        (gen_random_uuid(), CURRENT_DATE - INTERVAL '1 day', 'expense', 'Maintenance', 'Plumbing repair work', 1200.00, 'cash', NULL, 'Urgent repair', existing_user_id),
        (gen_random_uuid(), CURRENT_DATE - INTERVAL '2 days', 'income', 'Exam Fee', 'Examination fee collection', 8000.00, 'cash', 'EXAM-2026-07', NULL, existing_user_id),
        (gen_random_uuid(), CURRENT_DATE - INTERVAL '2 days', 'expense', 'Salary', 'Part-time staff wages', 6000.00, 'bank_transfer', 'SAL-07-2026', NULL, existing_user_id)
    ON CONFLICT (id) DO NOTHING;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Sample data insertion failed: %', SQLERRM;
END $$;
