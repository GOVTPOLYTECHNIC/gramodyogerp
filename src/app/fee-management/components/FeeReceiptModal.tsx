'use client';
import React from 'react';
import Modal from '@/components/ui/Modal';
import { FeeRecord } from './feeData';
import { Printer } from 'lucide-react';
import { toast } from 'sonner';

interface FeeReceiptModalProps {
  open: boolean;
  onClose: () => void;
  record: FeeRecord;
}

const schoolFullDetails: Record<string, { name: string; address: string; phone: string; affiliation: string }> = {
  'Rajiv Gandhi Polytechnic': {
    name: 'Rajiv Gandhi Polytechnic',
    address: 'Gramodyog Sewa Sansthan Campus, Varanasi, Uttar Pradesh — 221001',
    phone: '0542-2XXXXXX',
    affiliation: 'Affiliated to Board of Technical Education, UP',
  },
  'Rajiv Gandhi ITI': {
    name: 'Rajiv Gandhi Industrial Training Institute',
    address: 'Gramodyog Sewa Sansthan Campus, Varanasi, Uttar Pradesh — 221001',
    phone: '0542-2XXXXXX',
    affiliation: 'Affiliated to NCVT / SCVT, Government of India',
  },
  'GSS Diploma College': {
    name: 'Gramodyog Sewa Sansthan Diploma College',
    address: 'Gramodyog Sewa Sansthan Campus, Varanasi, Uttar Pradesh — 221001',
    phone: '0542-2XXXXXX',
    affiliation: 'Recognised by Rehabilitation Council of India (RCI)',
  },
};

export default function FeeReceiptModal({ open, onClose, record }: FeeReceiptModalProps) {
  const schoolDetails = schoolFullDetails[record.school] || schoolFullDetails['Rajiv Gandhi Polytechnic'];
  const netFee = record.annualFee - record.discount;
  const balance = netFee - record.paidAmount;

  return (
    <Modal open={open} onClose={onClose} title="Fee Receipt" subtitle={`Receipt No: ${record.receiptNo}`} size="xl">
      <div className="space-y-5">
        {/* Receipt Document */}
        <div className="border-2 border-primary rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-6 py-4 text-center">
            <p className="text-white font-bold text-xl">{schoolDetails.name}</p>
            <p className="text-blue-200 text-sm mt-0.5">Under: Gramodyog Sewa Sansthan, Varanasi</p>
            <p className="text-blue-300 text-xs mt-0.5">{schoolDetails.affiliation}</p>
          </div>

          {/* Sub-header */}
          <div className="bg-accent px-6 py-2 text-center">
            <p className="text-white font-bold text-sm tracking-widest uppercase">
              Fee Receipt — Academic Year {record.academicYear}
            </p>
          </div>

          {/* Receipt Meta */}
          <div className="px-6 py-4 bg-blue-50/30 flex flex-wrap justify-between gap-4 border-b border-border text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Receipt No.</p>
              <p className="font-bold text-foreground font-mono">{record.receiptNo}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date of Payment</p>
              <p className="font-bold text-foreground">{record.paymentDate}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Payment Mode</p>
              <p className="font-bold text-foreground">{record.paymentMode}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Academic Year</p>
              <p className="font-bold text-foreground">{record.academicYear}</p>
            </div>
          </div>

          {/* Student Details */}
          <div className="px-6 py-4 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Student Details</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Student Name</p>
                <p className="font-semibold text-foreground">{record.studentName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Roll Number</p>
                <p className="font-semibold font-mono text-foreground">{record.rollNo}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Course</p>
                <p className="font-semibold text-foreground">{record.course}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Semester</p>
                <p className="font-semibold text-foreground">Semester {record.semester}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Institution</p>
                <p className="font-semibold text-foreground">{record.school}</p>
              </div>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="px-6 py-4 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Fee Breakdown</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-xs font-semibold text-muted-foreground">Description</th>
                  <th className="text-right py-2 text-xs font-semibold text-muted-foreground">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-2 text-foreground">Annual Tuition Fee ({record.academicYear})</td>
                  <td className="py-2 text-right font-tabular font-semibold">
                    ₹{record.annualFee.toLocaleString('en-IN')}
                  </td>
                </tr>
                {record.discount > 0 && (
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-success">Discount / Concession</td>
                    <td className="py-2 text-right font-tabular font-semibold text-success">
                      −₹{record.discount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}
                <tr className="border-b border-border/50 bg-secondary/30">
                  <td className="py-2 font-semibold text-foreground">Net Fee Payable</td>
                  <td className="py-2 text-right font-tabular font-bold text-foreground">
                    ₹{netFee.toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 text-foreground">Amount Paid (This Transaction)</td>
                  <td className="py-2 text-right font-tabular font-bold text-primary">
                    ₹{record.paidAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className={balance > 0 ? 'bg-red-50' : 'bg-green-50'}>
                  <td className={`py-2 font-bold ${balance > 0 ? 'text-danger' : 'text-success'}`}>
                    {balance > 0 ? 'Balance Remaining' : 'Fee Status — FULLY PAID'}
                  </td>
                  <td className={`py-2 text-right font-tabular font-bold ${balance > 0 ? 'text-danger' : 'text-success'}`}>
                    {balance > 0 ? `₹${balance.toLocaleString('en-IN')}` : '✓ NIL'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Remarks */}
          {record.remarks && (
            <div className="px-6 py-3 border-b border-border">
              <p className="text-xs text-muted-foreground">Remarks: <span className="text-foreground font-medium">{record.remarks}</span></p>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 flex flex-wrap justify-between items-end gap-4">
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p>{schoolDetails.address}</p>
              <p>Phone: {schoolDetails.phone}</p>
              <p className="text-danger font-medium mt-2">
                This is a computer-generated receipt. No signature required.
              </p>
            </div>
            <div className="text-right text-xs">
              <div className="border-t border-foreground pt-2 w-40">
                <p className="text-muted-foreground">Authorised Signatory</p>
                <p className="font-semibold text-foreground">Principal / Cashier</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">Close</button>
          <button
            onClick={() => toast.success(`Receipt ${record.receiptNo} sent to printer`)}
            className="btn-primary flex items-center gap-2"
          >
            <Printer size={14} />
            Print Receipt
          </button>
        </div>
      </div>
    </Modal>
  );
}