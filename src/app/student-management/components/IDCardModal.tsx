'use client';
import React from 'react';
import Modal from '@/components/ui/Modal';
import { Student } from './studentData';
import { Printer, QrCode } from 'lucide-react';

interface IDCardModalProps {
  open: boolean;
  onClose: () => void;
  student: Student;
}

const schoolShortFull: Record<string, { short: string; tagline: string }> = {
  'Rajiv Gandhi Polytechnic': { short: 'RGP', tagline: 'Rajiv Gandhi Polytechnic, GSS' },
  'Rajiv Gandhi ITI': { short: 'ITI', tagline: 'Rajiv Gandhi ITI, GSS' },
  'GSS Diploma College': { short: 'GSS', tagline: 'Gramodyog Sewa Sansthan' },
};

export default function IDCardModal({ open, onClose, student }: IDCardModalProps) {
  const schoolInfo = schoolShortFull[student.school] || { short: 'GSS', tagline: student.school };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=500,height=700');
    if (!printWindow) return;

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>ID Card — ${student.name}</title>
  <meta charset="UTF-8"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:Arial,Helvetica,sans-serif;background:#f3f4f6;display:flex;flex-direction:column;align-items:center;padding:20px;gap:16px;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    @page{size:85mm 140mm;margin:5mm;}
    @media print{body{background:#fff;padding:0;}}
    .card{width:320px;border-radius:16px;overflow:hidden;border:2px solid #2563eb;box-shadow:0 4px 12px rgba(0,0,0,0.15);}
    .card-header{background:#2563eb;padding:12px 16px;text-align:center;}
    .card-header h1{color:#fff;font-weight:700;font-size:14px;margin-bottom:2px;}
    .card-header p{color:#bfdbfe;font-size:11px;}
    .card-body{background:#fff;padding:16px;display:flex;gap:14px;}
    .avatar{width:80px;height:96px;border-radius:8px;background:#eff6ff;border:2px solid #e5e7eb;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:700;color:#2563eb;flex-shrink:0;}
    .qr{width:80px;height:80px;background:#f3f4f6;border-radius:8px;border:1px solid #e5e7eb;display:flex;align-items:center;justify-content:center;margin-top:8px;}
    .qr-text{font-size:9px;color:#6b7280;text-align:center;margin-top:4px;}
    .details{flex:1;}
    .student-name{font-weight:700;font-size:14px;color:#111827;line-height:1.3;margin-bottom:2px;}
    .gender{font-size:11px;color:#6b7280;margin-bottom:8px;}
    .field{margin-bottom:5px;}
    .field-label{font-size:9px;color:#6b7280;}
    .field-value{font-size:11px;font-weight:600;color:#111827;}
    .field-value.mono{font-family:monospace;}
    .card-footer{background:#7c3aed;padding:8px 16px;display:flex;justify-content:space-between;align-items:center;}
    .card-footer p{color:#fff;font-size:11px;font-weight:600;}
    .card-back{width:320px;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;background:#f9fafb;}
    .back-header{padding:10px 16px;text-align:center;border-bottom:1px solid #e5e7eb;}
    .back-header p{font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;}
    .back-body{padding:12px 16px;}
    .back-row{display:flex;justify-content:space-between;margin-bottom:6px;font-size:11px;}
    .back-label{color:#6b7280;}
    .back-value{font-weight:600;color:#111827;}
    .back-note{border-top:1px solid #e5e7eb;padding-top:8px;margin-top:8px;font-size:10px;color:#6b7280;text-align:center;line-height:1.5;}
  </style>
</head>
<body>
  <!-- Front -->
  <div class="card">
    <div class="card-header">
      <h1>Gramodyog Sewa Sansthan</h1>
      <p>${schoolInfo.tagline}</p>
    </div>
    <div class="card-body">
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div class="avatar">${student.name.charAt(0)}</div>
        <div class="qr">
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="18" height="18" rx="2" stroke="#374151" stroke-width="2" fill="none"/>
            <rect x="6" y="6" width="10" height="10" fill="#374151"/>
            <rect x="30" y="2" width="18" height="18" rx="2" stroke="#374151" stroke-width="2" fill="none"/>
            <rect x="34" y="6" width="10" height="10" fill="#374151"/>
            <rect x="2" y="30" width="18" height="18" rx="2" stroke="#374151" stroke-width="2" fill="none"/>
            <rect x="6" y="34" width="10" height="10" fill="#374151"/>
            <rect x="30" y="30" width="4" height="4" fill="#374151"/>
            <rect x="36" y="30" width="4" height="4" fill="#374151"/>
            <rect x="42" y="30" width="6" height="4" fill="#374151"/>
            <rect x="30" y="36" width="4" height="4" fill="#374151"/>
            <rect x="36" y="36" width="12" height="4" fill="#374151"/>
            <rect x="30" y="42" width="4" height="6" fill="#374151"/>
            <rect x="38" y="42" width="10" height="6" fill="#374151"/>
            <rect x="22" y="2" width="4" height="4" fill="#374151"/>
            <rect x="22" y="8" width="4" height="4" fill="#374151"/>
            <rect x="22" y="14" width="4" height="4" fill="#374151"/>
            <rect x="22" y="22" width="4" height="4" fill="#374151"/>
            <rect x="2" y="22" width="4" height="4" fill="#374151"/>
            <rect x="8" y="22" width="4" height="4" fill="#374151"/>
            <rect x="14" y="22" width="4" height="4" fill="#374151"/>
          </svg>
        </div>
        <p class="qr-text">Scan to verify</p>
      </div>
      <div class="details">
        <p class="student-name">${student.name}</p>
        <p class="gender">${student.gender}</p>
        <div class="field">
          <p class="field-label">Roll No.</p>
          <p class="field-value mono">${student.rollNo}</p>
        </div>
        <div class="field">
          <p class="field-label">Course</p>
          <p class="field-value">${student.course}</p>
        </div>
        <div class="field">
          <p class="field-label">Semester</p>
          <p class="field-value">Sem ${student.semester} · ${student.admissionYear}</p>
        </div>
        <div class="field">
          <p class="field-label">Guardian</p>
          <p class="field-value">${student.guardianName}</p>
        </div>
        <div class="field">
          <p class="field-label">Phone</p>
          <p class="field-value mono">${student.phone}</p>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <p>Valid: 2026–27</p>
      <p>gramodyog.in</p>
    </div>
  </div>

  <!-- Back -->
  <div class="card-back">
    <div class="back-header"><p>Back of Card</p></div>
    <div class="back-body">
      <div class="back-row">
        <span class="back-label">DOB</span>
        <span class="back-value">${student.dob}</span>
      </div>
      <div class="back-row">
        <span class="back-label">Category</span>
        <span class="back-value">${student.category}</span>
      </div>
      <div class="back-row">
        <span class="back-label">Aadhar</span>
        <span class="back-value" style="font-family:monospace;">${student.aadhar}</span>
      </div>
      <div class="back-row" style="flex-direction:column;gap:2px;">
        <span class="back-label">Address</span>
        <span class="back-value">${student.address}</span>
      </div>
      <div class="back-note">
        If found, please return to: Gramodyog Sewa Sansthan,<br/>
        Musafirkhana, Amethi, UP. Contact: 05361-222358
      </div>
    </div>
  </div>

  <script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script>
</body>
</html>`);
    printWindow.document.close();
  };

  return (
    <Modal open={open} onClose={onClose} title="Student ID Card" subtitle={`${student.name} · ${student.rollNo}`} size="md">
      <div className="flex flex-col items-center gap-5">
        {/* ID Card */}
        <div className="w-80 rounded-2xl overflow-hidden border-2 border-primary shadow-lg">
          {/* Header */}
          <div className="bg-primary px-4 py-3 text-center">
            <p className="text-white font-bold text-sm">Gramodyog Sewa Sansthan</p>
            <p className="text-blue-200 text-xs">{schoolInfo.tagline}</p>
          </div>

          {/* Body */}
          <div className="bg-white px-4 py-4 flex gap-4">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-24 rounded-lg bg-secondary border-2 border-border flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">
                  {student.name.charAt(0)}
                </span>
              </div>
              {/* QR placeholder */}
              <div className="w-20 h-20 bg-secondary rounded-lg flex items-center justify-center border border-border">
                <QrCode size={40} className="text-foreground" />
              </div>
              <p className="text-xs text-muted-foreground text-center">Scan to verify</p>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-1.5">
              <p className="font-bold text-foreground text-sm leading-tight">{student.name}</p>
              <p className="text-xs text-muted-foreground">{student.gender}</p>
              <div className="space-y-1 mt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Roll No.</p>
                  <p className="text-xs font-bold font-mono text-foreground">{student.rollNo}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Course</p>
                  <p className="text-xs font-semibold text-foreground leading-tight">{student.course}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Semester</p>
                  <p className="text-xs font-semibold text-foreground">Sem {student.semester} · {student.admissionYear}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Guardian</p>
                  <p className="text-xs font-semibold text-foreground">{student.guardianName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-xs font-semibold font-tabular text-foreground">{student.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-accent px-4 py-2 flex items-center justify-between">
            <p className="text-white text-xs font-semibold">Valid: 2026–27</p>
            <p className="text-white text-xs">gramodyog.in</p>
          </div>
        </div>

        {/* Back of card */}
        <div className="w-80 rounded-2xl overflow-hidden border border-border shadow-sm bg-secondary/40">
          <div className="px-4 py-3 text-center border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Back of Card</p>
          </div>
          <div className="px-4 py-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">DOB</span>
              <span className="font-semibold text-foreground">{student.dob}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="font-semibold text-foreground">{student.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Aadhar</span>
              <span className="font-semibold font-mono text-foreground">{student.aadhar}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Address: </span>
              <span className="font-semibold text-foreground">{student.address}</span>
            </div>
            <div className="border-t border-border pt-2 text-muted-foreground text-center leading-relaxed">
              If found, please return to: Gramodyog Sewa Sansthan,
              Musafirkhana, Amethi, UP. Contact: 05361-222358
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full justify-end">
          <button onClick={onClose} className="btn-secondary">Close</button>
          <button
            onClick={handlePrint}
            className="btn-primary flex items-center gap-2"
          >
            <Printer size={14} />
            Print ID Card
          </button>
        </div>
      </div>
    </Modal>
  );
}