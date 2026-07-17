'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import { FeeRecord, RECEIPT_PREFIX, School, mockFeeRecords } from './feeData';
import { Student } from '@/app/student-management/components/studentData';
import { getStudents } from '@/lib/studentStore';

interface RecordPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onRecord: (r: FeeRecord) => void;
  existingCount: number;
  allFeeRecords?: FeeRecord[];
}

interface FormValues {
  studentId: string;
  paymentMode: 'Cash' | 'Online' | 'DD' | 'Cheque';
  paidAmount: string;
  discount: string;
  remarks: string;
}

export default function RecordPaymentModal({
  open, onClose, onRecord, existingCount, allFeeRecords,
}: RecordPaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      studentId: '',
      paymentMode: 'Cash',
      paidAmount: '',
      discount: '0',
      remarks: '',
    },
  });

  // Load students from store every time modal opens
  useEffect(() => {
    if (open) {
      const list = getStudents();
      setStudents(list);
      if (list.length > 0) {
        setSelectedStudent(list[0]);
        reset({
          studentId: list[0].id,
          paymentMode: 'Cash',
          paidAmount: '',
          discount: '0',
          remarks: '',
        });
      } else {
        setSelectedStudent(null);
        reset({ studentId: '', paymentMode: 'Cash', paidAmount: '', discount: '0', remarks: '' });
      }
    }
  }, [open, reset]);

  const studentId = watch('studentId');
  const discountVal = Number(watch('discount') || 0);
  const paidAmountVal = Number(watch('paidAmount') || 0);

  useEffect(() => {
    const s = students.find((st) => st.id === studentId);
    if (s) setSelectedStudent(s);
  }, [studentId, students]);

  // Calculate already paid from fee records for this student
  const feeRecords = allFeeRecords || mockFeeRecords;
  const alreadyPaid = selectedStudent
    ? feeRecords
        .filter((r) => r.studentId === selectedStudent.id)
        .reduce((sum, r) => sum + r.paidAmount, 0)
    : 0;

  const netFee = selectedStudent ? selectedStudent.totalFees - discountVal : 0;
  const balance = netFee - alreadyPaid - paidAmountVal;

  const onSubmit = (data: FormValues) => {
    setLoading(true);
    const s = selectedStudent;
    if (!s) return;
    const prefix = RECEIPT_PREFIX[s.school as School] || 'REC';
    const receiptNo = `${prefix}-2026-${String(existingCount + 1).padStart(4, '0')}`;
    const paid = Number(data.paidAmount);
    const disc = Number(data.discount);
    const net = s.totalFees - disc;
    const bal = net - alreadyPaid - paid;

    let status: FeeRecord['status'] = 'Pending';
    if (alreadyPaid + paid >= net) status = 'Paid';
    else if (alreadyPaid + paid > 0) status = 'Partial';

    const today = new Date();
    const paymentDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    const newRecord: FeeRecord = {
      id: `fee-${Date.now()}`,
      receiptNo,
      studentId: s.id,
      rollNo: s.rollNo,
      studentName: s.name,
      school: s.school as School,
      course: s.course,
      semester: s.semester,
      annualFee: s.totalFees,
      discount: disc,
      paidAmount: paid,
      paymentDate,
      paymentMode: data.paymentMode,
      remarks: data.remarks,
      status,
      academicYear: '2025-26',
    };

    setTimeout(() => {
      setLoading(false);
      onRecord(newRecord);
      reset();
    }, 700);
  };

  return (
    <Modal open={open} onClose={onClose} title="Record Fee Payment" subtitle="Select student and enter payment details" size="xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Student Selection */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Select Student <span className="text-danger">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-1">
            Choosing a student auto-fills institution, course, and fee details
          </p>
          {students.length === 0 ? (
            <div className="input-field text-muted-foreground text-sm bg-secondary/50">
              No students found — please add students in Student Management first
            </div>
          ) : (
            <select
              className="input-field"
              {...register('studentId', { required: true })}
            >
              {students.map((s) => (
                <option key={`pay-student-${s.id}`} value={s.id}>
                  {s.rollNo} — {s.name} ({s.school.includes('Polytechnic') ? 'RGP' : s.school.includes('ITI') ? 'ITI' : 'GSS'})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Student Info Preview */}
        {selectedStudent && (
          <div className="bg-secondary/60 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground">Institution</p>
              <p className="font-semibold text-foreground">{selectedStudent.school}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Course</p>
              <p className="font-semibold text-foreground">{selectedStudent.course}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Semester</p>
              <p className="font-semibold text-foreground">Sem {selectedStudent.semester}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Annual Fee</p>
              <p className="font-semibold text-foreground font-tabular">
                ₹{selectedStudent.totalFees.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Already Paid</p>
              <p className="font-semibold text-emerald-600 font-tabular">
                ₹{alreadyPaid.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Lateral Entry</p>
              <p className="font-semibold text-foreground">{selectedStudent.lateralEntry ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}

        <hr className="border-border" />

        {/* Payment Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Amount Being Paid (₹) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter amount in rupees"
              className={`input-field font-tabular ${errors.paidAmount ? 'border-danger' : ''}`}
              {...register('paidAmount', {
                required: 'Payment amount is required',
                min: { value: 1, message: 'Amount must be greater than 0' },
              })}
            />
            {errors.paidAmount && (
              <p className="text-xs text-danger mt-1">{errors.paidAmount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Discount / Concession (₹)
            </label>
            <p className="text-xs text-muted-foreground mb-1">
              Scholarship, category concession, or merit discount
            </p>
            <input
              type="number"
              placeholder="0"
              className="input-field font-tabular"
              {...register('discount', { min: { value: 0, message: 'Cannot be negative' } })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Payment Mode <span className="text-danger">*</span>
            </label>
            <select className="input-field" {...register('paymentMode', { required: true })}>
              <option value="Cash">Cash</option>
              <option value="Online">Online Transfer / UPI</option>
              <option value="DD">Demand Draft (DD)</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Remarks / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. First instalment, DD No. 123456"
              className="input-field"
              {...register('remarks')}
            />
          </div>
        </div>

        {/* Fee Summary */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">
            Payment Summary
          </p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Annual Fee</span>
              <span className="font-tabular font-semibold">
                ₹{selectedStudent?.totalFees.toLocaleString('en-IN') || '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span className="font-tabular text-success font-semibold">
                −₹{discountVal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-1.5">
              <span className="text-muted-foreground">Net Payable</span>
              <span className="font-tabular font-bold">₹{netFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Already Paid</span>
              <span className="font-tabular font-semibold text-emerald-600">
                ₹{alreadyPaid.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Paying Now</span>
              <span className="font-tabular font-bold text-primary">
                ₹{paidAmountVal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-1.5">
              <span className="font-semibold text-foreground">Balance After Payment</span>
              <span className={`font-tabular font-bold ${balance > 0 ? 'text-danger' : 'text-success'}`}>
                {balance > 0 ? `₹${balance.toLocaleString('en-IN')} due` : '✓ Fully Paid'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            type="submit"
            disabled={loading || students.length === 0}
            className="btn-primary flex items-center gap-2 min-w-[160px] justify-center disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Recording...
              </>
            ) : 'Record & Generate Receipt'}
          </button>
        </div>
      </form>
    </Modal>
  );
}