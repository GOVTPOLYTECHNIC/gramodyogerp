'use client';
import React from 'react';
import { Edit2, Trash2, FileText, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { Student } from './studentData';
import { FeeRecord } from '@/app/fee-management/components/feeData';
import Badge from '@/components/ui/Badge';

interface StudentTableProps {
  students: Student[];
  feeRecords?: FeeRecord[];
  onEdit: (s: Student) => void;
  onDelete: (s: Student) => void;
  onGatePass: (s: Student) => void;
  onIDCard: (s: Student) => void;
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onPerPageChange: (p: number) => void;
}

const feeStatusVariant = (s: string): 'success' | 'warning' | 'danger' | 'muted' => {
  if (s === 'Paid') return 'success';
  if (s === 'Partial') return 'warning';
  if (s === 'Overdue') return 'danger';
  return 'muted';
};

const schoolShort = (school: string) => {
  if (school.includes('Polytechnic')) return 'RGP';
  if (school.includes('ITI')) return 'ITI';
  return 'GSS';
};

export default function StudentTable({
  students, feeRecords = [], onEdit, onDelete, onGatePass, onIDCard,
  page, perPage, total, totalPages, onPageChange, onPerPageChange,
}: StudentTableProps) {
  if (students.length === 0) {
    return (
      <div className="card p-12 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
          <FileText size={24} className="text-muted-foreground" />
        </div>
        <div>
          <p className="font-semibold text-foreground">No students found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filter criteria to find students.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              <th className="table-th">#</th>
              <th className="table-th">Roll No</th>
              <th className="table-th">Name</th>
              <th className="table-th">Institution</th>
              <th className="table-th">Course</th>
              <th className="table-th">Sem</th>
              <th className="table-th">Lateral</th>
              <th className="table-th">Guardian</th>
              <th className="table-th">Phone</th>
              <th className="table-th">Category</th>
              <th className="table-th">Fee Status</th>
              <th className="table-th">Balance</th>
              <th className="table-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => {
              // Calculate actual paid amount from fee records (sum of all payments for this student)
              const actualPaid = feeRecords
                .filter((r) => r.studentId === s.id)
                .reduce((sum, r) => sum + r.paidAmount, 0);
              // Use actual paid if fee records exist, otherwise fall back to student.paidFees
              const effectivePaid = feeRecords.some((r) => r.studentId === s.id)
                ? actualPaid
                : s.paidFees;
              const balance = s.totalFees - effectivePaid;
              return (
                <tr key={s.id} className="table-row group">
                  <td className="table-td text-muted-foreground text-xs">
                    {(page - 1) * perPage + i + 1}
                  </td>
                  <td className="table-td">
                    <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded text-foreground">
                      {s.rollNo}
                    </span>
                  </td>
                  <td className="table-td">
                    <div>
                      <p className="font-semibold text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.dob}</p>
                    </div>
                  </td>
                  <td className="table-td">
                    <span className="badge badge-info">{schoolShort(s.school)}</span>
                  </td>
                  <td className="table-td max-w-[160px]">
                    <span className="truncate block text-xs text-muted-foreground" title={s.course}>
                      {s.course}
                    </span>
                  </td>
                  <td className="table-td text-center">
                    <span className="badge badge-muted">{s.semester}</span>
                  </td>
                  <td className="table-td text-center">
                    {s.lateralEntry ? (
                      <span className="badge badge-warning">LE</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="table-td">
                    <span className="text-xs">{s.guardianName}</span>
                  </td>
                  <td className="table-td font-tabular text-xs">{s.phone}</td>
                  <td className="table-td">
                    <span className="badge badge-muted">{s.category}</span>
                  </td>
                  <td className="table-td">
                    <Badge variant={feeStatusVariant(s.feeStatus)}>
                      {s.feeStatus}
                    </Badge>
                  </td>
                  <td className="table-td font-tabular">
                    <span className={balance > 0 ? 'text-danger font-semibold' : 'text-success font-semibold'}>
                      {balance > 0 ? `₹${balance.toLocaleString('en-IN')}` : '✓ Nil'}
                    </span>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        onClick={() => onEdit(s)}
                        title="Edit student record"
                        className="p-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onGatePass(s)}
                        title="Generate gate pass"
                        className="p-1.5 rounded-lg hover:bg-amber-50 hover:text-amber-700 transition-colors"
                      >
                        <FileText size={14} />
                      </button>
                      <button
                        onClick={() => onIDCard(s)}
                        title="View ID card"
                        className="p-1.5 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors"
                      >
                        <CreditCard size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(s)}
                        title="Delete student — this cannot be undone"
                        className="p-1.5 rounded-lg hover:bg-red-50 hover:text-danger transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border bg-secondary/20">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Show</span>
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="input-field h-7 text-xs w-16 py-1"
          >
            {[10, 20, 50].map((n) => (
              <option key={`pp-${n}`} value={n}>{n}</option>
            ))}
          </select>
          <span>of {total} students</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-40 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const p = i + 1;
            return (
              <button
                key={`page-${p}`}
                onClick={() => onPageChange(p)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                  page === p
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary text-muted-foreground'
                }`}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-40 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}