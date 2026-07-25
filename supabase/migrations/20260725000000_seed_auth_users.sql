-- ============================================================
-- SEED AUTH USERS: Admin & Staff login credentials
-- Creates users in auth.users + user_profiles
-- ============================================================

-- Step 1: Ensure handle_new_user trigger function exists
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
    ON CONFLICT (id) DO UPDATE
        SET email = EXCLUDED.email,
            full_name = EXCLUDED.full_name,
            role = EXCLUDED.role,
            updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Step 2: Create trigger on auth.users (drop first for idempotency)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Seed Admin and Staff users into auth.users
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    staff1_uuid UUID := gen_random_uuid();
    staff2_uuid UUID := gen_random_uuid();
    existing_admin_id UUID;
    existing_staff1_id UUID;
    existing_staff2_id UUID;
BEGIN
    -- Check if admin already exists
    SELECT id INTO existing_admin_id FROM auth.users WHERE email = 'admin@gramodyog.in' LIMIT 1;
    SELECT id INTO existing_staff1_id FROM auth.users WHERE email = 'staff@gramodyog.in' LIMIT 1;
    SELECT id INTO existing_staff2_id FROM auth.users WHERE email = 'principal@gramodyog.in' LIMIT 1;

    -- Insert Admin user if not exists
    IF existing_admin_id IS NULL THEN
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password,
            email_confirmed_at, created_at, updated_at,
            raw_user_meta_data, raw_app_meta_data,
            is_sso_user, is_anonymous,
            confirmation_token, confirmation_sent_at,
            recovery_token, recovery_sent_at,
            email_change_token_new, email_change, email_change_sent_at,
            email_change_token_current, email_change_confirm_status,
            reauthentication_token, reauthentication_sent_at,
            phone, phone_change, phone_change_token, phone_change_sent_at
        ) VALUES (
            admin_uuid,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'admin@gramodyog.in',
            crypt('Admin@1234', gen_salt('bf', 10)),
            now(), now(), now(),
            jsonb_build_object('full_name', 'System Administrator', 'role', 'admin'),
            jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
            false, false,
            '', null, '', null, '', '', null, '', 0, '', null,
            null, '', '', null
        );
        RAISE NOTICE 'Admin user created: admin@gramodyog.in';
    ELSE
        -- Update password for existing admin
        UPDATE auth.users
        SET encrypted_password = crypt('Admin@1234', gen_salt('bf', 10)),
            updated_at = now()
        WHERE id = existing_admin_id;
        -- Ensure user_profiles exists
        INSERT INTO public.user_profiles (id, email, full_name, role)
        VALUES (existing_admin_id, 'admin@gramodyog.in', 'System Administrator', 'admin'::public.user_role)
        ON CONFLICT (id) DO UPDATE SET role = 'admin'::public.user_role, updated_at = CURRENT_TIMESTAMP;
        RAISE NOTICE 'Admin user updated: admin@gramodyog.in';
    END IF;

    -- Insert Staff user 1 if not exists
    IF existing_staff1_id IS NULL THEN
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password,
            email_confirmed_at, created_at, updated_at,
            raw_user_meta_data, raw_app_meta_data,
            is_sso_user, is_anonymous,
            confirmation_token, confirmation_sent_at,
            recovery_token, recovery_sent_at,
            email_change_token_new, email_change, email_change_sent_at,
            email_change_token_current, email_change_confirm_status,
            reauthentication_token, reauthentication_sent_at,
            phone, phone_change, phone_change_token, phone_change_sent_at
        ) VALUES (
            staff1_uuid,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'staff@gramodyog.in',
            crypt('Staff@1234', gen_salt('bf', 10)),
            now(), now(), now(),
            jsonb_build_object('full_name', 'Staff Member', 'role', 'staff'),
            jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
            false, false,
            '', null, '', null, '', '', null, '', 0, '', null,
            null, '', '', null
        );
        RAISE NOTICE 'Staff user created: staff@gramodyog.in';
    ELSE
        UPDATE auth.users
        SET encrypted_password = crypt('Staff@1234', gen_salt('bf', 10)),
            updated_at = now()
        WHERE id = existing_staff1_id;
        INSERT INTO public.user_profiles (id, email, full_name, role)
        VALUES (existing_staff1_id, 'staff@gramodyog.in', 'Staff Member', 'staff'::public.user_role)
        ON CONFLICT (id) DO UPDATE SET role = 'staff'::public.user_role, updated_at = CURRENT_TIMESTAMP;
        RAISE NOTICE 'Staff user updated: staff@gramodyog.in';
    END IF;

    -- Insert Staff user 2 (Principal) if not exists
    IF existing_staff2_id IS NULL THEN
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password,
            email_confirmed_at, created_at, updated_at,
            raw_user_meta_data, raw_app_meta_data,
            is_sso_user, is_anonymous,
            confirmation_token, confirmation_sent_at,
            recovery_token, recovery_sent_at,
            email_change_token_new, email_change, email_change_sent_at,
            email_change_token_current, email_change_confirm_status,
            reauthentication_token, reauthentication_sent_at,
            phone, phone_change, phone_change_token, phone_change_sent_at
        ) VALUES (
            staff2_uuid,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'principal@gramodyog.in',
            crypt('Staff@1234', gen_salt('bf', 10)),
            now(), now(), now(),
            jsonb_build_object('full_name', 'Principal RGP', 'role', 'staff'),
            jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
            false, false,
            '', null, '', null, '', '', null, '', 0, '', null,
            null, '', '', null
        );
        RAISE NOTICE 'Principal user created: principal@gramodyog.in';
    ELSE
        UPDATE auth.users
        SET encrypted_password = crypt('Staff@1234', gen_salt('bf', 10)),
            updated_at = now()
        WHERE id = existing_staff2_id;
        INSERT INTO public.user_profiles (id, email, full_name, role)
        VALUES (existing_staff2_id, 'principal@gramodyog.in', 'Principal RGP', 'staff'::public.user_role)
        ON CONFLICT (id) DO UPDATE SET role = 'staff'::public.user_role, updated_at = CURRENT_TIMESTAMP;
        RAISE NOTICE 'Principal user updated: principal@gramodyog.in';
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Seed failed: %', SQLERRM;
END $$;
