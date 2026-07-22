'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, GraduationCap, Building2, Users, Shield, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

import { studentService } from '@/lib/supabase/services';



type Role = 'admin' | 'staff' | 'student';

interface LoginForm {
  identifier: string;
  password: string;
  remember: boolean;
}

const adminCredentials = {
  label: 'Admin',
  identifier: 'admin@gramodyog.in',
  password: 'GSS@Admin#2026',
  identifierLabel: 'Email Address',
};

const staffCredentials = {
  label: 'Staff',
  identifier: 'staff.rajiv@gramodyog.in',
  password: 'Staff@RGP#26',
  identifierLabel: 'Email Address',
};

const schools = [
  { id: 'school-rgp', name: 'Rajiv Gandhi Polytechnic', short: 'RGP', icon: Building2 },
  { id: 'school-iti', name: 'Rajiv Gandhi ITI', short: 'ITI', icon: GraduationCap },
  { id: 'school-gss', name: 'GSS Diploma College', short: 'GSS', icon: Users },
];

const roleCards = [
  {
    role: 'admin' as Role,
    label: 'Admin Login',
    description: 'Full system access — manage all institutions',
    icon: Shield,
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200 hover:border-purple-400',
    emoji: '🛡️',
  },
  {
    role: 'staff' as Role,
    label: 'Staff Login',
    description: 'Faculty & staff portal — attendance, payroll, leaves',
    icon: Users,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200 hover:border-blue-400',
    emoji: '👤',
  },
  {
    role: 'student' as Role,
    label: 'Student Login',
    description: 'Student portal — fees, ID card, gate pass',
    icon: GraduationCap,
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200 hover:border-green-400',
    emoji: '🎓',
  },
];

// Generate a unique password for each student based on their roll number and DOB
function getStudentPassword(rollNo: string, dob: string): string {
  // Password format: first part of rollNo + @ + DOB digits (DDMMYYYY)
  const dobDigits = dob.replace(/\//g, '');
  const rollPart = rollNo.replace(/-/g, '').slice(0, 6).toUpperCase();
  return `${rollPart}@${dobDigits}`;
}

export default function LoginClient() {
  const [role, setRole] = useState<Role | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginForm>({ defaultValues: { remember: false } });

  const onSubmit = (data: LoginForm) => {
    if (!role) return;
    setLoading(true);

    if (role === 'admin') {
      setTimeout(() => {
        setLoading(false);
        if (
          data.identifier === adminCredentials.identifier &&
          data.password === adminCredentials.password
        ) {
          toast.success('Welcome back! Logged in as Admin');
          if (typeof window !== 'undefined') {
            localStorage.setItem('gramodyog_role', 'admin');
            localStorage.removeItem('gramodyog_student_id');
          }
          window.location.href = '/';
        } else {
          toast.error('Invalid credentials. Please check your email and password.');
        }
      }, 1200);
      return;
    }

    if (role === 'staff') {
      setTimeout(() => {
        setLoading(false);
        if (
          data.identifier === staffCredentials.identifier &&
          data.password === staffCredentials.password
        ) {
          toast.success('Welcome back! Logged in as Staff');
          if (typeof window !== 'undefined') {
            localStorage.setItem('gramodyog_role', 'staff');
            localStorage.removeItem('gramodyog_student_id');
          }
          window.location.href = '/staff-attendance';
        } else {
          toast.error('Invalid credentials. Please check your email and password.');
        }
      }, 1200);
      return;
    }

    if (role === 'student') {
      // Fetch from Supabase
      studentService.getByRollNo(data.identifier.trim()).then((matchedStudent) => {
        setLoading(false);
        if (!matchedStudent) {
          toast.error('Roll number not found. Please check and try again.');
          return;
        }
        const expectedPassword = getStudentPassword(matchedStudent.rollNo, matchedStudent.dob);
        if (data.password !== expectedPassword) {
          toast.error('Invalid password. Please check and try again.');
          return;
        }
        toast.success(`Welcome, ${matchedStudent.name}!`);
        if (typeof window !== 'undefined') {
          localStorage.setItem('gramodyog_role', 'student');
          localStorage.setItem('gramodyog_student_id', matchedStudent.id);
          localStorage.setItem('gramodyog_student_roll', matchedStudent.rollNo);
        }
        window.location.href = '/fee-management';
      }).catch(() => {
        setLoading(false);
        toast.error('Login failed. Please try again.');
      });
      return;
    }

    setLoading(false);
  };

  const handleSelectRole = (r: Role) => {
    setRole(r);
    reset({ identifier: '', password: '', remember: false });
  };

  const handleBack = () => {
    setRole(null);
    reset();
  };

  const identifierLabel =
    role === 'student' ? 'Roll Number' : role === 'staff' ? 'Email Address' : 'Email Address';

  const roleLabel =
    role === 'admin' ? 'Admin' : role === 'staff' ? 'Staff' : 'Student';

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
            const SchoolIcon = s.icon;
            return (
              <div
                key={s.id}
                className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <SchoolIcon size={16} className="text-white" />
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

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <AppLogo size={36} />
            <span className="font-bold text-lg text-primary">GramodyogERP</span>
          </div>

          {/* STEP 1: Role selection */}
          {!role && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Select your login type to continue
                </p>
              </div>

              <div className="space-y-3">
                {roleCards.map((rc) => {
                  const RoleIcon = rc.icon;
                  return (
                    <button
                      key={`role-card-${rc.role}`}
                      onClick={() => handleSelectRole(rc.role)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 bg-card transition-all duration-150 text-left ${rc.border}`}
                    >
                      <div className={`w-12 h-12 rounded-xl ${rc.bg} flex items-center justify-center flex-shrink-0`}>
                        <RoleIcon size={22} className={rc.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground text-sm">{rc.emoji} {rc.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{rc.description}</p>
                      </div>
                      <svg className="w-5 h-5 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Login form */}
          {role && (
            <div>
              <div className="mb-6">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                  <ArrowLeft size={15} />
                  Back to login options
                </button>
                <div className="flex items-center gap-3 mb-2">
                  {(() => {
                    const rc = roleCards.find((r) => r.role === role)!;
                    const RoleIcon = rc.icon;
                    return (
                      <div className={`w-10 h-10 rounded-xl ${rc.bg} flex items-center justify-center`}>
                        <RoleIcon size={18} className={rc.color} />
                      </div>
                    );
                  })()}
                  <div>
                    <h1 className="text-xl font-bold text-foreground">{roleLabel} Sign In</h1>
                    <p className="text-xs text-muted-foreground">Enter your credentials to continue</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    {identifierLabel}
                  </label>
                  <input
                    type={role === 'student' ? 'text' : 'email'}
                    placeholder={
                      role === 'student' ? 'Enter your Roll Number (e.g. RGP-2026-001)' : 'Enter your email address'
                    }
                    className={`input-field ${errors.identifier ? 'border-danger focus:ring-danger/30' : ''}`}
                    {...register('identifier', {
                      required: `${identifierLabel} is required`,
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
                  {role === 'student' && (
                    <p className="text-xs text-muted-foreground mb-1.5">
                      Your password is your Roll No (without dashes) + @ + Date of Birth (DDMMYYYY). Contact admin if you need help.
                    </p>
                  )}
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className={`input-field pr-10 ${errors.password ? 'border-danger focus:ring-danger/30' : ''}`}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
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
                    `Sign In as ${roleLabel}`
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}