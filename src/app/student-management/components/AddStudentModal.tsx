'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import { SCHOOL_COURSES, SCHOOL_FEE, School, Student } from './studentData';

interface AddStudentModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (s: Student) => void;
  existingCount: number;
}

interface FormValues {
  name: string;
  school: School | '';
  course: string;
  semester: string;
  lateralEntry: boolean;
  admissionYear: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  guardianName: string;
  phone: string;
  address: string;
  category: 'General' | 'OBC' | 'SC' | 'ST';
  aadhar: string;
}

const schools = Object.keys(SCHOOL_COURSES) as School[];

export default function AddStudentModal({ open, onClose, onAdd, existingCount }: AddStudentModalProps) {
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      gender: 'Male',
      category: 'General',
      admissionYear: '2026',
      lateralEntry: false,
    },
  });

  const selectedSchool = watch('school');
  const isLateral = watch('lateralEntry');

  useEffect(() => {
    if (selectedSchool && selectedSchool in SCHOOL_COURSES) {
      const c = SCHOOL_COURSES[selectedSchool as School];
      setCourses(c);
      setValue('course', c[0]);
    } else {
      setCourses([]);
      setValue('course', '');
    }
  }, [selectedSchool, setValue]);

  const onSubmit = (data: FormValues) => {
    if (!data.school) return;
    setLoading(true);
    const school = data.school as School;
    const fees = SCHOOL_FEE[school];
    const annualFee = data.lateralEntry ? fees.lateral : fees.regular;
    const schoolPrefix = school.includes('Polytechnic') ? 'RGP' : school.includes('ITI') ? 'ITI' : 'GSS';
    const rollNo = `${schoolPrefix}-2026-${String(existingCount + 1).padStart(3, '0')}`;

    const newStudent: Student = {
      id: `std-${Date.now()}`,
      rollNo,
      name: data.name,
      school,
      course: data.course,
      semester: Number(data.semester),
      lateralEntry: data.lateralEntry,
      admissionYear: data.admissionYear,
      dob: data.dob,
      gender: data.gender,
      guardianName: data.guardianName,
      phone: data.phone,
      address: data.address,
      feeStatus: 'Pending',
      totalFees: annualFee,
      paidFees: 0,
      category: data.category,
      aadhar: data.aadhar,
    };

    setTimeout(() => {
      setLoading(false);
      onAdd(newStudent);
      reset();
    }, 700);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Admit New Student"
      subtitle="Fill all required fields to register a new student"
      size="2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Info */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter student's full name"
                className={`input-field ${errors.name ? 'border-danger' : ''}`}
                {...register('name', { required: 'Full name is required' })}
              />
              {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Date of Birth <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className={`input-field ${errors.dob ? 'border-danger' : ''}`}
                {...register('dob', { required: 'Date of birth is required' })}
              />
              {errors.dob && <p className="text-xs text-danger mt-1">{errors.dob.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Gender <span className="text-danger">*</span></label>
              <select className="input-field" {...register('gender', { required: true })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Guardian Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="Father / Mother / Guardian"
                className={`input-field ${errors.guardianName ? 'border-danger' : ''}`}
                {...register('guardianName', { required: 'Guardian name is required' })}
              />
              {errors.guardianName && <p className="text-xs text-danger mt-1">{errors.guardianName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Mobile Number <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                className={`input-field ${errors.phone ? 'border-danger' : ''}`}
                {...register('phone', {
                  required: 'Mobile number is required',
                  pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit mobile number' },
                })}
              />
              {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Aadhar Number</label>
              <input
                type="text"
                placeholder="XXXX XXXX XXXX"
                className="input-field"
                {...register('aadhar')}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Category <span className="text-danger">*</span></label>
              <select className="input-field" {...register('category', { required: true })}>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Address <span className="text-danger">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Village / Mohalla, District, State"
                className={`input-field resize-none ${errors.address ? 'border-danger' : ''}`}
                {...register('address', { required: 'Address is required' })}
              />
              {errors.address && <p className="text-xs text-danger mt-1">{errors.address.message}</p>}
            </div>
          </div>
        </div>

        <hr className="border-border" />

        {/* Academic Info */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Academic Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Institution <span className="text-danger">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-1">
                Selecting institution auto-populates available courses
              </p>
              <select
                className={`input-field ${errors.school ? 'border-danger' : ''}`}
                {...register('school', { required: 'Institution is required' })}
              >
                <option value="">— Select Institution —</option>
                {schools.map((s) => (
                  <option key={`add-school-${s}`} value={s}>{s}</option>
                ))}
              </select>
              {errors.school && <p className="text-xs text-danger mt-1">{errors.school.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Course <span className="text-danger">*</span>
              </label>
              <select
                className={`input-field ${errors.course ? 'border-danger' : ''}`}
                disabled={courses.length === 0}
                {...register('course', { required: 'Course is required' })}
              >
                {courses.length === 0 ? (
                  <option value="">Select institution first</option>
                ) : (
                  courses.map((c) => (
                    <option key={`add-course-${c}`} value={c}>{c}</option>
                  ))
                )}
              </select>
              {errors.course && <p className="text-xs text-danger mt-1">{errors.course.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Semester <span className="text-danger">*</span>
              </label>
              <select className="input-field" {...register('semester', { required: true })}>
                {['1','2','3','4','5','6'].map((s) => (
                  <option key={`add-sem-${s}`} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Admission Year <span className="text-danger">*</span></label>
              <select className="input-field" {...register('admissionYear', { required: true })}>
                {['2024','2025','2026'].map((y) => (
                  <option key={`add-year-${y}`} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="lateralEntry"
                className="w-4 h-4 accent-primary"
                {...register('lateralEntry')}
              />
              <label htmlFor="lateralEntry" className="text-sm font-semibold text-foreground cursor-pointer">
                Lateral Entry Admission
              </label>
            </div>

            {selectedSchool && (
              <div className="sm:col-span-2 bg-secondary/60 rounded-lg p-3 text-xs">
                <p className="font-semibold text-foreground mb-1">Annual Fee Preview</p>
                {selectedSchool in SCHOOL_FEE ? (
                  <p className="text-muted-foreground">
                    {isLateral
                      ? `Lateral Entry: ₹${SCHOOL_FEE[selectedSchool as School].lateral.toLocaleString('en-IN')} / year`
                      : `Regular: ₹${SCHOOL_FEE[selectedSchool as School].regular.toLocaleString('en-IN')} / year`}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2 min-w-[140px] justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Admitting...
              </>
            ) : (
              'Admit Student'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}