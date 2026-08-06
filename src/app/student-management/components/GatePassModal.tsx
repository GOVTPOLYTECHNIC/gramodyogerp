'use client';
import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Student } from './studentData';
import { Printer } from 'lucide-react';
import { toast } from 'sonner';

interface GatePassModalProps {
  open: boolean;
  onClose: () => void;
  student: Student;
}

export default function GatePassModal({ open, onClose, student }: GatePassModalProps) {
  const [purpose, setPurpose] = useState('');
  const [destination, setDestination] = useState('');
  const [outTime, setOutTime] = useState('10:00');
  const [returnTime, setReturnTime] = useState('16:00');
  const [generated, setGenerated] = useState(false);

  const gpNumber = `GP-${student.rollNo}-${Date.now().toString().slice(-4)}`;
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const handleGenerate = () => {
    if (!purpose || !destination) {
      toast.error('Please fill purpose and destination');
      return;
    }
    setGenerated(true);
    toast.success('Gate pass generated successfully');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=600,height=500');
    if (!printWindow) return;

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Gate Pass — ${gpNumber}</title>
  <meta charset="UTF-8"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:Arial,Helvetica,sans-serif;background:#fff;padding:20px;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    @page{size:A5 landscape;margin:10mm;}
    @media print{body{padding:0;}}
    .pass{border:2px solid #2563eb;border-radius:10px;overflow:hidden;max-width:560px;margin:0 auto;}
    .pass-header{background:#2563eb;padding:14px 20px;text-align:center;}
    .pass-header h1{color:#fff;font-weight:700;font-size:17px;margin-bottom:3px;}
    .pass-header p{color:#bfdbfe;font-size:12px;margin-bottom:2px;}
    .pass-header .badge{display:inline-block;background:#7c3aed;color:#fff;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:3px 12px;border-radius:20px;margin-top:6px;}
    .pass-body{padding:16px 20px;background:#eff6ff;}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
    .field-label{font-size:10px;color:#6b7280;margin-bottom:2px;}
    .field-value{font-size:12px;font-weight:600;color:#111827;}
    .field-value.mono{font-family:monospace;}
    .pass-footer{padding:12px 20px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;background:#fff;}
    .footer-text{font-size:11px;color:#6b7280;}
    .sign-box{text-align:right;font-size:11px;}
    .sign-line{border-top:1px solid #111827;padding-top:4px;width:130px;display:inline-block;}
  </style>
</head>
<body>
  <div class="pass">
    <div class="pass-header">
      <h1>Gramodyog Sewa Sansthan</h1>
      <p>${student.school}</p>
      <span class="badge">Student Gate Pass</span>
    </div>
    <div class="pass-body">
      <div class="grid">
        <div>
          <p class="field-label">GP Number</p>
          <p class="field-value mono">${gpNumber}</p>
        </div>
        <div>
          <p class="field-label">Date</p>
          <p class="field-value">${today}</p>
        </div>
        <div>
          <p class="field-label">Student Name</p>
          <p class="field-value">${student.name}</p>
        </div>
        <div>
          <p class="field-label">Roll Number</p>
          <p class="field-value mono">${student.rollNo}</p>
        </div>
        <div>
          <p class="field-label">Course</p>
          <p class="field-value">${student.course}</p>
        </div>
        <div>
          <p class="field-label">Semester</p>
          <p class="field-value">Sem ${student.semester}</p>
        </div>
        <div>
          <p class="field-label">Purpose</p>
          <p class="field-value">${purpose}</p>
        </div>
        <div>
          <p class="field-label">Destination</p>
          <p class="field-value">${destination}</p>
        </div>
        <div>
          <p class="field-label">Out Time</p>
          <p class="field-value">${outTime}</p>
        </div>
        <div>
          <p class="field-label">Return By</p>
          <p class="field-value">${returnTime}</p>
        </div>
      </div>
    </div>
    <div class="pass-footer">
      <span class="footer-text">Issued by: Admin / Principal</span>
      <div class="sign-box">
        <div class="sign-line">
          <p style="color:#6b7280;">Authorised Signatory</p>
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
    <Modal open={open} onClose={onClose} title="Student Gate Pass" subtitle={`For: ${student.name} · ${student.rollNo}`} size="md">
      {!generated ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Purpose of Going Out <span className="text-danger">*</span></label>
            <input
              type="text"
              placeholder="e.g. Medical appointment, Personal work"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Destination <span className="text-danger">*</span></label>
            <input
              type="text"
              placeholder="e.g. District Hospital, Home"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Out Time</label>
              <input type="time" value={outTime} onChange={(e) => setOutTime(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Expected Return</label>
              <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="input-field" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="btn-secondary">Cancel</button>
            <button onClick={handleGenerate} className="btn-primary">Generate Gate Pass</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Gate Pass Preview */}
          <div className="border-2 border-primary rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-primary px-5 py-3 text-center">
              <p className="font-bold text-white text-lg">Gramodyog Sewa Sansthan</p>
              <p className="text-sm font-semibold text-blue-200">{student.school}</p>
              <span className="inline-block bg-accent text-white text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mt-2">
                Student Gate Pass
              </span>
            </div>
            {/* Body */}
            <div className="px-5 py-4 bg-blue-50/30 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground">GP Number</p>
                <p className="font-semibold text-foreground font-mono">{gpNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-semibold text-foreground">{today}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Student Name</p>
                <p className="font-semibold text-foreground">{student.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Roll Number</p>
                <p className="font-semibold text-foreground font-mono">{student.rollNo}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Course</p>
                <p className="font-semibold text-foreground">{student.course}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Semester</p>
                <p className="font-semibold text-foreground">Sem {student.semester}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Purpose</p>
                <p className="font-semibold text-foreground">{purpose}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Destination</p>
                <p className="font-semibold text-foreground">{destination}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Out Time</p>
                <p className="font-semibold text-foreground">{outTime}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Return By</p>
                <p className="font-semibold text-foreground">{returnTime}</p>
              </div>
            </div>
            {/* Footer */}
            <div className="px-5 py-3 border-t border-border flex justify-between text-xs text-muted-foreground bg-white">
              <span>Issued by: Admin / Principal</span>
              <span>Signature: ___________</span>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="btn-secondary">Close</button>
            <button
              onClick={handlePrint}
              className="btn-primary flex items-center gap-2"
            >
              <Printer size={14} />
              Print Gate Pass
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}