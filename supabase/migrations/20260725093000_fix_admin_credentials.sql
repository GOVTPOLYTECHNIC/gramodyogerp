-- ============================================================
-- FIX ADMIN CREDENTIALS: Update admin email to admin@rgp.in
-- and password to Rgp@12345 to match login form mapping
-- Login form maps "Admin" username → admin@rgp.in
-- ============================================================

DO $$
DECLARE
    existing_admin_id UUID;
    new_admin_uuid UUID := gen_random_uuid();
BEGIN
    -- Check if admin@rgp.in already exists
    SELECT id INTO existing_admin_id FROM auth.users WHERE email = 'admin@rgp.in' LIMIT 1;

    IF existing_admin_id IS NULL THEN
        -- Create new admin user with correct email and password
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
            new_admin_uuid,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'admin@rgp.in',
            crypt('Rgp@12345', gen_salt('bf', 10)),
            now(), now(), now(),
            jsonb_build_object('full_name', 'System Administrator', 'role', 'admin'),
            jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
            false, false,
            '', null, '', null, '', '', null, '', 0, '', null,
            null, '', '', null
        );

        -- Ensure user_profiles row exists for new admin
        INSERT INTO public.user_profiles (id, email, full_name, role)
        VALUES (new_admin_uuid, 'admin@rgp.in', 'System Administrator', 'admin'::public.user_role)
        ON CONFLICT (id) DO UPDATE
            SET email = EXCLUDED.email,
                full_name = EXCLUDED.full_name,
                role = EXCLUDED.role,
                updated_at = CURRENT_TIMESTAMP;

        RAISE NOTICE 'Admin user created: admin@rgp.in with password Rgp@12345';
    ELSE
        -- Update existing admin@rgp.in password
        UPDATE auth.users
        SET encrypted_password = crypt('Rgp@12345', gen_salt('bf', 10)),
            updated_at = now()
        WHERE id = existing_admin_id;

        -- Ensure user_profiles exists and has admin role
        INSERT INTO public.user_profiles (id, email, full_name, role)
        VALUES (existing_admin_id, 'admin@rgp.in', 'System Administrator', 'admin'::public.user_role)
        ON CONFLICT (id) DO UPDATE
            SET role = 'admin'::public.user_role,
                updated_at = CURRENT_TIMESTAMP;

        RAISE NOTICE 'Admin user updated: admin@rgp.in password set to Rgp@12345';
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Admin credential fix failed: %', SQLERRM;
END $$;
