'use client';

import { mockStudents, Student } from '@/app/student-management/components/studentData';
import { mockFeeRecords, FeeRecord } from '@/app/fee-management/components/feeData';

const STUDENTS_KEY = 'erp_students';
const FEE_RECORDS_KEY = 'erp_fee_records';

export function getStudents(): Student[] {
  if (typeof window === 'undefined') return mockStudents;
  try {
    const stored = localStorage.getItem(STUDENTS_KEY);
    if (stored) return JSON.parse(stored) as Student[];
  } catch {}
  return mockStudents;
}

export function saveStudents(students: Student[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

export function getFeeRecords(): FeeRecord[] {
  if (typeof window === 'undefined') return mockFeeRecords;
  try {
    const stored = localStorage.getItem(FEE_RECORDS_KEY);
    if (stored) return JSON.parse(stored) as FeeRecord[];
  } catch {}
  return mockFeeRecords;
}

export function saveFeeRecords(records: FeeRecord[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FEE_RECORDS_KEY, JSON.stringify(records));
}

export function deleteStudentAndFees(studentId: string): void {
  const students = getStudents().filter((s) => s.id !== studentId);
  saveStudents(students);
  const fees = getFeeRecords().filter((f) => f.studentId !== studentId);
  saveFeeRecords(fees);
}
