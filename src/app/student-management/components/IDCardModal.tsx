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
            <p className="text-white text-xs font-semibold">Valid: 2025–26</p>
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
              If found, please return to: Gramodyog Sewa Sansthan, Varanasi, UP.
              Contact: 0542-XXXXXXX
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full justify-end">
          <button onClick={onClose} className="btn-secondary">Close</button>
          <button
            onClick={() => window.print()}
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