'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import { SCHOOL_COURSES, SCHOOL_FEE, School, Student } from './studentData';

interface EditStudentModalProps {
  open: boolean;
  onClose: () => void;
  student: Student;
  onSave: (updated: Student) => void;
}

export default function EditStudentModal({ open, onClose, student, onSave }: EditStudentModalProps) {
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const schools = Object.keys(SCHOOL_COURSES) as School[];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: student.name,
      school: student.school,
      course: student.course,
      semester: String(student.semester),
      lateralEntry: student.lateralEntry,
      admissionYear: student.admissionYear,
      dob: student.dob,
      gender: student.gender,
      guardianName: student.guardianName,
      phone: student.phone,
      address: student.address,
      category: student.category,
      aadhar: student.aadhar,
    },
  });

  const selectedSchool = watch('school') as School;

  useEffect(() => {
    if (selectedSchool && selectedSchool in SCHOOL_COURSES) {
      const c = SCHOOL_COURSES[selectedSchool as School];
      setCourses(c);
    }
  }, [selectedSchool]);

  useEffect(() => {
    reset({
      name: student.name,
      school: student.school,
      course: student.course,
      semester: String(student.semester),
      lateralEntry: student.lateralEntry,
      admissionYear: student.admissionYear,
      dob: student.dob,
      gender: student.gender,
      guardianName: student.guardianName,
      phone: student.phone,
      address: student.address,
      category: student.category,
      aadhar: student.aadhar,
    });
    setCourses(SCHOOL_COURSES[student.school] || []);
  }, [student, reset]);

  const onSubmit = (data: Record<string, unknown>) => {
    setLoading(true);
    const school = data.school as School;
    const isLateral = Boolean(data.lateralEntry);
    const fees = SCHOOL_FEE[school];
    const annualFee = isLateral ? fees.lateral : fees.regular;

    const updated: Student = {
      ...student,
      name: data.name as string,
      school,
      course: data.course as string,
      semester: Number(data.semester),
      lateralEntry: isLateral,
      admissionYear: data.admissionYear as string,
      dob: data.dob as string,
      gender: data.gender as 'Male' | 'Female' | 'Other',
      guardianName: data.guardianName as string,
      phone: data.phone as string,
      address: data.address as string,
      category: data.category as 'General' | 'OBC' | 'SC' | 'ST',
      aadhar: data.aadhar as string,
      totalFees: annualFee,
    };

    setTimeout(() => {
      setLoading(false);
      onSave(updated);
    }, 600);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Edit: ${student.name}`}
      subtitle={`Roll No: ${student.rollNo}`}
      size="2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">Full Name <span className="text-danger">*</span></label>
              <input type="text" className={`input-field ${errors.name ? 'border-danger' : ''}`}
                {...register('name', { required: 'Name is required' })} />
              {errors.name && <p className="text-xs text-danger mt-1">{String(errors.name.message)}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Date of Birth</label>
              <input type="date" className="input-field" {...register('dob')} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Gender</label>
              <select className="input-field" {...register('gender')}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Guardian Name <span className="text-danger">*</span></label>
              <input type="text" className="input-field" {...register('guardianName', { required: true })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Mobile Number <span className="text-danger">*</span></label>
              <input type="tel" className={`input-field ${errors.phone ? 'border-danger' : ''}`}
                {...register('phone', { required: true, pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid number' } })} />
              {errors.phone && <p className="text-xs text-danger mt-1">{String(errors.phone.message)}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Category</label>
              <select className="input-field" {...register('category')}>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Aadhar Number</label>
              <input type="text" className="input-field" {...register('aadhar')} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">Address</label>
              <textarea rows={2} className="input-field resize-none" {...register('address')} />
            </div>
          </div>
        </div>

        <hr className="border-border" />

        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Academic Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Institution <span className="text-danger">*</span></label>
              <select className="input-field" {...register('school', { required: true })}>
                {schools.map((s) => (
                  <option key={`edit-school-${s}`} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Course <span className="text-danger">*</span></label>
              <select className="input-field" {...register('course', { required: true })}>
                {courses.map((c) => (
                  <option key={`edit-course-${c}`} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Semester</label>
              <select className="input-field" {...register('semester')}>
                {['1','2','3','4','5','6'].map((s) => (
                  <option key={`edit-sem-${s}`} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Admission Year</label>
              <select className="input-field" {...register('admissionYear')}>
                {['2024','2025','2026'].map((y) => (
                  <option key={`edit-year-${y}`} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" id="editLateral" className="w-4 h-4 accent-primary" {...register('lateralEntry')} />
              <label htmlFor="editLateral" className="text-sm font-semibold text-foreground cursor-pointer">Lateral Entry</label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 min-w-[130px] justify-center">
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}