'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/AppLayout';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FieldErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ChangePasswordClient() {
  const [form, setForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const supabase = createClient();

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};
    if (!form.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!form.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (form.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(form.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(form.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one number';
    }
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (form.currentPassword && form.newPassword && form.currentPassword === form.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof PasswordForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      // Step 1: Verify current password by re-authenticating
      if (!user?.email) {
        toast.error('User session not found. Please log in again.');
        setLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: form.currentPassword,
      });

      if (signInError) {
        setErrors({ currentPassword: 'Current password is incorrect' });
        setLoading(false);
        return;
      }

      // Step 2: Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: form.newPassword,
      });

      if (updateError) {
        toast.error(updateError.message || 'Failed to update password. Please try again.');
        setLoading(false);
        return;
      }

      // Step 3: Refresh session so app keeps working
      await supabase.auth.refreshSession();

      setLoading(false);
      setSuccess(true);
      toast.success('Password changed successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const passwordStrength = (pwd: string): { label: string; color: string; width: string } => {
    if (!pwd) return { label: '', color: 'bg-border', width: 'w-0' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { label: 'Weak', color: 'bg-danger', width: 'w-1/4' };
    if (score <= 2) return { label: 'Fair', color: 'bg-amber-500', width: 'w-2/4' };
    if (score <= 3) return { label: 'Good', color: 'bg-blue-500', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-success', width: 'w-full' };
  };

  const strength = passwordStrength(form.newPassword);

  return (
    <AppLayout title="Change Password">
      <div className="max-w-xl mx-auto py-8 px-4">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium mb-6"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Change Password</h1>
              <p className="text-sm text-muted-foreground">Update your account password</p>
            </div>
          </div>

          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-2">Password Updated!</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Your password has been changed successfully.
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="btn-secondary px-6 h-10 text-sm"
              >
                Change Again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={show.current ? 'text' : 'password'}
                    value={form.currentPassword}
                    onChange={(e) => handleChange('currentPassword', e.target.value)}
                    placeholder="Enter your current password"
                    className={`input-field pr-10 ${errors.currentPassword ? 'border-danger focus:ring-danger/30' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={show.current ? 'Hide password' : 'Show password'}
                  >
                    {show.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-xs text-danger mt-1">{errors.currentPassword}</p>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={show.newPass ? 'text' : 'password'}
                    value={form.newPassword}
                    onChange={(e) => handleChange('newPassword', e.target.value)}
                    placeholder="Enter new password"
                    className={`input-field pr-10 ${errors.newPassword ? 'border-danger focus:ring-danger/30' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => ({ ...s, newPass: !s.newPass }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={show.newPass ? 'Hide password' : 'Show password'}
                  >
                    {show.newPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-danger mt-1">{errors.newPassword}</p>
                )}
                {/* Strength bar */}
                {form.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Password strength</span>
                      <span className={`text-xs font-semibold ${
                        strength.label === 'Weak' ? 'text-danger' :
                        strength.label === 'Fair' ? 'text-amber-500' :
                        strength.label === 'Good' ? 'text-blue-500' : 'text-success'
                      }`}>{strength.label}</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={show.confirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="Re-enter new password"
                    className={`input-field pr-10 ${errors.confirmPassword ? 'border-danger focus:ring-danger/30' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={show.confirm ? 'Hide password' : 'Show password'}
                  >
                    {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-danger mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Password rules hint */}
              <div className="bg-secondary/60 rounded-lg px-4 py-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">Password requirements:</p>
                <ul className="space-y-1">
                  {[
                    { rule: 'At least 8 characters', met: form.newPassword.length >= 8 },
                    { rule: 'At least one uppercase letter', met: /[A-Z]/.test(form.newPassword) },
                    { rule: 'At least one number', met: /[0-9]/.test(form.newPassword) },
                  ].map((r, i) => (
                    <li key={`rule-${i}`} className={`flex items-center gap-1.5 text-xs ${r.met ? 'text-success' : 'text-muted-foreground'}`}>
                      <CheckCircle size={11} className={r.met ? 'text-success' : 'text-border'} />
                      {r.rule}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-11 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
