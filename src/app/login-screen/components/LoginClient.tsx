'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Copy, CheckCircle, GraduationCap, Building2, Users } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';


type Role = 'admin' | 'staff' | 'student';

interface LoginForm {
  identifier: string;
  password: string;
  remember: boolean;
}

const mockCredentials: Record<Role, { label: string; identifier: string; password: string; identifierLabel: string }> = {
  admin: {
    label: 'Admin',
    identifier: 'admin@gramodyog.in',
    password: 'GSS@Admin#2026',
    identifierLabel: 'Email Address',
  },
  staff: {
    label: 'Staff',
    identifier: 'staff.rajiv@gramodyog.in',
    password: 'Staff@RGP#26',
    identifierLabel: 'Email Address',
  },
  student: {
    label: 'Student',
    identifier: 'RGP-2026-041',
    password: 'Student@2026',
    identifierLabel: 'Roll Number / Email',
  },
};

const schools = [
  { id: 'school-rgp', name: 'Rajiv Gandhi Polytechnic', short: 'RGP', icon: Building2, color: 'text-blue-700', bg: 'bg-blue-50' },
  { id: 'school-iti', name: 'Rajiv Gandhi ITI', short: 'ITI', icon: GraduationCap, color: 'text-amber-700', bg: 'bg-amber-50' },
  { id: 'school-gss', name: 'GSS Diploma College', short: 'GSS', icon: Users, color: 'text-green-700', bg: 'bg-green-50' },
];

export default function LoginClient() {
  const [role, setRole] = useState<Role>('admin');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({ defaultValues: { remember: false } });

 const onSubmit = async (data: LoginForm) => {
  try {
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: data.identifier,
        password: data.password,
      }),
    });

    const result = await res.json();

    if (result.success) {
      toast.success("Login Successful");
      window.location.href = "/";
    } else {
      toast.error(result.message || "Invalid credentials");
    }
  } catch (error) {
    console.error(error);
    toast.error("Server Error");
  } finally {
    setLoading(false);
  }
};

  const handleUseCreds = (r: Role) => {
    const c = mockCredentials[r];
    setRole(r);
    setValue('identifier', c.identifier);
    setValue('password', c.password);
    toast.info(`${c.label} credentials filled`);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const creds = mockCredentials[role];

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] bg-primary flex-col justify-between p-10 relative overflow-hidden">
        <div className="blob-primary absolute inset-0 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <AppLogo size={44} />
            <div>
              <span className="font-bold text-xl text-white block leading-tight">
                GramodyogERP
              </span>
              <span className="text-blue-200 text-xs">
                Gramodyog Sewa Sansthan
              </span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white leading-snug mb-3">
            Institutional Management
            <br />
            <span className="text-blue-200">Made Simple</span>
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
            Manage admissions, fee collections, attendance, and student records across all three GSS institutions from one unified platform.
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-3">
            Affiliated Institutions
          </p>
          {schools.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{s.name}</p>
                  <p className="text-blue-200 text-xs">{s.short}</p>
                </div>
              </div>
            );
          })}
          <p className="text-blue-300 text-xs text-center mt-4 pt-3 border-t border-white/10">
            © 2026 Gramodyog Sewa Sansthan. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <AppLogo size={36} />
            <span className="font-bold text-lg text-primary">GramodyogERP</span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Sign In</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Select your role and enter your credentials
            </p>
          </div>

          {/* Role tabs */}
          <div className="flex bg-secondary rounded-xl p-1 mb-6 gap-1">
            {(['admin', 'staff', 'student'] as Role[]).map((r) => (
              <button
                key={`role-tab-${r}`}
                onClick={() => {
                  setRole(r);
                  setValue('identifier', '');
                  setValue('password', '');
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-150 capitalize ${
                  role === r
                    ? 'bg-card text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {r === 'admin' ? '🛡️ Admin' : r === 'staff' ? '👤 Staff' : '🎓 Student'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                {creds.identifierLabel}
              </label>
              <input
                type={role === 'student' ? 'text' : 'email'}
                placeholder={
                  role === 'student' ?'Enter Roll No or Email' :'Enter your email address'
                }
                className={`input-field ${errors.identifier ? 'border-danger focus:ring-danger/30' : ''}`}
                {...register('identifier', {
                  required: `${creds.identifierLabel} is required`,
                })}
              />
              {errors.identifier && (
                <p className="text-xs text-danger mt-1">{errors.identifier.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`input-field pr-10 ${errors.password ? 'border-danger focus:ring-danger/30' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-danger mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border accent-primary"
                  {...register('remember')}
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary font-semibold hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-11 flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Verifying...
                </>
              ) : (
                `Sign In as ${creds.label}`
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 rounded-xl border border-border bg-secondary/50 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Demo Credentials
            </p>
            <div className="space-y-2">
              {(['admin', 'staff', 'student'] as Role[]).map((r) => {
                const c = mockCredentials[r];
                return (
                  <div
                    key={`demo-${r}`}
                    className="flex items-center justify-between bg-card rounded-lg px-3 py-2 border border-border"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="badge badge-info capitalize text-xs">{c.label}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                        {c.identifier}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(c.identifier, `id-${r}`)}
                        className="p-1 rounded hover:bg-secondary transition-colors"
                        title="Copy identifier"
                      >
                        {copiedField === `id-${r}` ? (
                          <CheckCircle size={13} className="text-success" />
                        ) : (
                          <Copy size={13} className="text-muted-foreground" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUseCreds(r)}
                        className="text-xs font-semibold text-primary hover:underline px-2 py-1 rounded hover:bg-primary/5 transition-colors"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
