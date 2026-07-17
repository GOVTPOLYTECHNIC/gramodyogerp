'use client';
import React from 'react';
import { Eye, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { FeeRecord } from './feeData';
import Badge from '@/components/ui/Badge';

interface FeeTableProps {
  records: FeeRecord[];
  onViewReceipt: (r: FeeRecord) => void;
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

const feeStatusVariant = (s: string): 'success' | 'warning' | 'danger' | 'muted' => {
  if (s === 'Paid') return 'success';
  if (s === 'Partial') return 'warning';
  if (s === 'Overdue') return 'danger';
  return 'muted';
};

const modeColor: Record<string, string> = {
  Cash: 'badge-success',
  Online: 'badge-info',
  DD: 'badge-warning',
  Cheque: 'badge-muted',
};

export default function FeeTable({
  records, onViewReceipt,
  page, perPage, total, totalPages, onPageChange,
}: FeeTableProps) {
  if (records.length === 0) {
    return (
      <div className="card p-12 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
          <FileText size={24} className="text-muted-foreground" />
        </div>
        <div>
          <p className="font-semibold text-foreground">No fee records found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Adjust your filters or record a new payment to see records here.
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
              <th className="table-th">Receipt No</th>
              <th className="table-th">Roll No</th>
              <th className="table-th">Student Name</th>
              <th className="table-th">Institution</th>
              <th className="table-th">Course</th>
              <th className="table-th">Sem</th>
              <th className="table-th">Annual Fee</th>
              <th className="table-th">Discount</th>
              <th className="table-th">Paid</th>
              <th className="table-th">Balance</th>
              <th className="table-th">Mode</th>
              <th className="table-th">Date</th>
              <th className="table-th">Status</th>
              <th className="table-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => {
              const netFee = r.annualFee - r.discount;
              const balance = netFee - r.paidAmount;
              return (
                <tr
                  key={r.id}
                  className={`table-row group ${r.status === 'Overdue' ? 'bg-red-50/40' : ''}`}
                >
                  <td className="table-td text-muted-foreground text-xs">
                    {(page - 1) * perPage + i + 1}
                  </td>
                  <td className="table-td">
                    <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded text-foreground">
                      {r.receiptNo}
                    </span>
                  </td>
                  <td className="table-td">
                    <span className="font-mono text-xs text-muted-foreground">{r.rollNo}</span>
                  </td>
                  <td className="table-td font-semibold text-foreground">{r.studentName}</td>
                  <td className="table-td">
                    <span className="badge badge-info text-xs">
                      {r.school.includes('Polytechnic') ? 'RGP' : r.school.includes('ITI') ? 'ITI' : 'GSS'}
                    </span>
                  </td>
                  <td className="table-td max-w-[140px]">
                    <span className="truncate block text-xs text-muted-foreground" title={r.course}>
                      {r.course}
                    </span>
                  </td>
                  <td className="table-td text-center">
                    <span className="badge badge-muted">{r.semester}</span>
                  </td>
                  <td className="table-td font-tabular">
                    ₹{r.annualFee.toLocaleString('en-IN')}
                  </td>
                  <td className="table-td font-tabular">
                    {r.discount > 0 ? (
                      <span className="text-success font-semibold">
                        −₹{r.discount.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="table-td font-tabular font-semibold text-foreground">
                    ₹{r.paidAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="table-td font-tabular">
                    <span className={balance > 0 ? 'text-danger font-bold' : 'text-success font-semibold'}>
                      {balance > 0 ? `₹${balance.toLocaleString('en-IN')}` : '✓ Nil'}
                    </span>
                  </td>
                  <td className="table-td">
                    <span className={`badge ${modeColor[r.paymentMode] || 'badge-muted'}`}>
                      {r.paymentMode}
                    </span>
                  </td>
                  <td className="table-td text-xs text-muted-foreground font-tabular">
                    {r.paymentDate}
                  </td>
                  <td className="table-td">
                    <Badge variant={feeStatusVariant(r.status)}>{r.status}</Badge>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        onClick={() => onViewReceipt(r)}
                        title="View / Print fee receipt"
                        className="p-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        disabled={r.paidAmount === 0}
                      >
                        <Eye size={14} />
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
        <p className="text-xs text-muted-foreground">
          Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total} records
        </p>
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
                key={`fee-page-${p}`}
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