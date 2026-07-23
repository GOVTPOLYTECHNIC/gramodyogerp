'use client';
import React, { useRef } from 'react';
import Modal from '@/components/ui/Modal';
import { FeeRecord } from './feeData';
import { Printer } from 'lucide-react';

interface FeeReceiptModalProps {
  open: boolean;
  onClose: () => void;
  record: FeeRecord;
  allRecords: FeeRecord[];
}

const schoolFullDetails: Record<string, { name: string; address: string; phone: string; affiliation: string }> = {
  'Rajiv Gandhi Polytechnic': {
    name: 'Rajiv Gandhi Polytechnic',
    address: 'Gramodyog Sewa Sansthan Campus Musafirkhana, Amethi, Uttar Pradesh — 227813',
    phone: '05361-222358',
    affiliation: 'Affiliated to Board of Technical Education, UP',
  },
  'Rajiv Gandhi ITI': {
    name: 'Rajiv Gandhi Industrial Training Institute',
    address: 'Gramodyog Sewa Sansthan Campus Musafirkhana, Amethi, Uttar Pradesh — 227813',
    phone: '05361-222358',
    affiliation: 'Affiliated to NCVT / SCVT, Government of India',
  },
  'GSS Diploma College': {
    name: 'Gramodyog Sewa Sansthan Diploma College',
    address: 'Gramodyog Sewa Sansthan Campus Musafirkhana, Amethi, Uttar Pradesh — 227813',
    phone: '05361-222358',
    affiliation: 'Recognised by Rehabilitation Council of India (RCI)',
  },
};

export default function FeeReceiptModal({ open, onClose, record, allRecords }: FeeReceiptModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const schoolDetails = schoolFullDetails[record.school] || schoolFullDetails['Rajiv Gandhi Polytechnic'];
  const netFee = record.annualFee - record.discount;

  // Cumulative total paid by this student for same course/semester/year
  const totalPaid = allRecords
    .filter(
      (r) =>
        r.rollNo === record.rollNo &&
        r.course === record.course &&
        r.semester === record.semester &&
        r.academicYear === record.academicYear
    )
    .reduce((sum, r) => sum + r.paidAmount, 0);

  const balance = netFee - totalPaid;

  // Agar fees fully paid hai to next semester dikhao, warna current semester
  const displaySemester = balance <= 0 ? record.semester + 1 : record.semester;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=820,height=700');
    if (!printWindow) return;

    const discountRow = record.discount > 0
      ? `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;color:#16a34a;">Discount / Concession</td>
          <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:700;color:#16a34a;">−₹${record.discount.toLocaleString('en-IN')}</td>
        </tr>`
      : '';

    const remarksSection = record.remarks
      ? `<div style="padding:10px 24px;border-bottom:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
          Remarks: <span style="color:#111827;font-weight:500;">${record.remarks}</span>
        </div>`
      : '';

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Fee Receipt — ${record.receiptNo}</title>
  <meta charset="UTF-8"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#111827;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    @page{size:A4;margin:15mm 12mm;}
    @media print{body{margin:0;}.no-print{display:none!important;}}
  </style>
</head>
<body>
<div style="border:2px solid #2563eb;border-radius:10px;overflow:hidden;max-width:680px;margin:20px auto;">

  <!-- Header -->
  <div style="background:#2563eb;padding:18px 24px;text-align:center;">
    <p style="color:#ffffff;font-weight:700;font-size:19px;margin-bottom:3px;">${schoolDetails.name}</p>
    <p style="color:#bfdbfe;font-size:12px;margin-bottom:2px;">Under: Gramodyog Sewa Sansthan</p>
    <p style="color:#93c5fd;font-size:11px;">${schoolDetails.affiliation}</p>
  </div>

  <!-- Sub-header -->
  <div style="background:#7c3aed;padding:9px 24px;text-align:center;">
    <p style="color:#ffffff;font-weight:700;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
      Fee Receipt — Academic Year ${record.academicYear}
    </p>
  </div>

  <!-- Receipt Meta -->
  <div style="padding:14px 24px;background:#eff6ff;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;border-bottom:1px solid #e5e7eb;">
    <div>
      <p style="font-size:10px;color:#6b7280;margin-bottom:2px;">Receipt No.</p>
      <p style="font-weight:700;font-size:13px;font-family:monospace;">${record.receiptNo}</p>
    </div>
    <div>
      <p style="font-size:10px;color:#6b7280;margin-bottom:2px;">Date of Payment</p>
      <p style="font-weight:700;font-size:13px;">${record.paymentDate}</p>
    </div>
    <div>
      <p style="font-size:10px;color:#6b7280;margin-bottom:2px;">Payment Mode</p>
      <p style="font-weight:700;font-size:13px;">${record.paymentMode}</p>
    </div>
    <div>
      <p style="font-size:10px;color:#6b7280;margin-bottom:2px;">Academic Year</p>
      <p style="font-weight:700;font-size:13px;">${record.academicYear}</p>
    </div>
  </div>

  <!-- Student Details -->
  <div style="padding:14px 24px;border-bottom:1px solid #e5e7eb;">
    <p style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;">Student Details</p>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
      <div>
        <p style="font-size:10px;color:#6b7280;margin-bottom:2px;">Student Name</p>
        <p style="font-weight:600;font-size:13px;">${record.studentName}</p>
      </div>
      <div>
        <p style="font-size:10px;color:#6b7280;margin-bottom:2px;">Roll Number</p>
        <p style="font-weight:600;font-size:13px;font-family:monospace;">${record.rollNo}</p>
      </div>
      <div>
        <p style="font-size:10px;color:#6b7280;margin-bottom:2px;">Course</p>
        <p style="font-weight:600;font-size:13px;">${record.course}</p>
      </div>
      <div>
        <p style="font-size:10px;color:#6b7280;margin-bottom:2px;">Semester</p>
        <p style="font-weight:600;font-size:13px;">Semester ${displaySemester}</p>
      </div>
      <div>
        <p style="font-size:10px;color:#6b7280;margin-bottom:2px;">Institution</p>
        <p style="font-weight:600;font-size:13px;">${record.school}</p>
      </div>
    </div>
  </div>

  <!-- Fee Breakdown -->
  <div style="padding:14px 24px;border-bottom:1px solid #e5e7eb;">
    <p style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;">Fee Breakdown</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead>
        <tr style="border-bottom:2px solid #e5e7eb;">
          <th style="text-align:left;padding:8px 0;font-size:11px;color:#6b7280;font-weight:600;">Description</th>
          <th style="text-align:right;padding:8px 0;font-size:11px;color:#6b7280;font-weight:600;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">Annual Tuition Fee (${record.academicYear})</td>
          <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:600;">₹${record.annualFee.toLocaleString('en-IN')}</td>
        </tr>
        ${discountRow}
        <tr style="background:#f0f9ff;">
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-weight:600;">Net Fee Payable</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:700;">₹${netFee.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">Amount Paid (This Installment)</td>
          <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:700;color:#2563eb;">₹${record.paidAmount.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-weight:600;color:#059669;">Total Paid So Far (All Installments)</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:700;color:#059669;">₹${totalPaid.toLocaleString('en-IN')}</td>
        </tr>
        <tr style="background:${balance > 0 ? '#fef2f2' : '#f0fdf4'};">
          <td style="padding:10px 0;font-weight:700;color:${balance > 0 ? '#dc2626' : '#16a34a'};">
            ${balance > 0 ? 'Balance Remaining' : 'Fee Status — FULLY PAID'}
          </td>
          <td style="padding:10px 0;text-align:right;font-weight:700;color:${balance > 0 ? '#dc2626' : '#16a34a'};">
            ${balance > 0 ? `₹${balance.toLocaleString('en-IN')}` : '✓ NIL'}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  ${remarksSection}

  <!-- Footer -->
  <div style="padding:14px 24px;display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:12px;">
    <div style="font-size:11px;color:#6b7280;line-height:1.6;">
      <p>${schoolDetails.address}</p>
      <p>Phone: ${schoolDetails.phone}</p>
      <p style="color:#dc2626;font-weight:600;margin-top:6px;">This is a computer-generated receipt. No signature required.</p>
    </div>
    <div style="text-align:right;font-size:11px;">
      <div style="border-top:1px solid #111827;padding-top:5px;width:150px;">
        <p style="color:#6b7280;">Authorised Signatory</p>
        <p style="font-weight:600;color:#111827;">Principal / Cashier</p>
      </div>
    </div>
  </div>

</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script>
</body>
</html>`);
    printWindow.document.close();
  };

  return (
    <Modal open={open} onClose={onClose} title="Fee Receipt" subtitle={`Receipt No: ${record.receiptNo}`} size="xl">
      <div className="space-y-5">
        {/* Receipt Document */}
        <div ref={printRef} className="border-2 border-primary rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-6 py-4 text-center">
            <p className="text-white font-bold text-xl">{schoolDetails.name}</p>
            <p className="text-blue-200 text-sm mt-0.5">Under: Gramodyog Sewa Sansthan</p>
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
                <p className="font-semibold text-foreground">Semester {displaySemester}</p>
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
                  <td className="py-2 text-foreground">Amount Paid (This Installment)</td>
                  <td className="py-2 text-right font-tabular font-bold text-primary">
                    ₹{record.paidAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="border-b border-border/50 bg-green-50/50">
                  <td className="py-2 font-semibold text-success">Total Paid So Far (All Installments)</td>
                  <td className="py-2 text-right font-tabular font-bold text-success">
                    ₹{totalPaid.toLocaleString('en-IN')}
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
            onClick={handlePrint}
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