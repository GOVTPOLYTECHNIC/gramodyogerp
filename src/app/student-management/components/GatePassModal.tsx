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
  const today = '17/07/2026';

  const handleGenerate = () => {
    if (!purpose || !destination) {
      toast.error('Please fill purpose and destination');
      return;
    }
    setGenerated(true);
    toast.success('Gate pass generated successfully');
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
          <div className="border-2 border-primary rounded-xl p-5 space-y-4 bg-blue-50/30">
            <div className="text-center border-b border-border pb-3">
              <p className="font-bold text-primary text-lg">Gramodyog Sewa Sansthan</p>
              <p className="text-sm font-semibold text-foreground">{student.school}</p>
              <p className="text-xs text-muted-foreground mt-1 font-bold tracking-widest uppercase">Student Gate Pass</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
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
            <div className="border-t border-border pt-3 flex justify-between text-xs text-muted-foreground">
              <span>Issued by: Admin / Principal</span>
              <span>Signature: ___________</span>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="btn-secondary">Close</button>
            <button
              onClick={() => { window.print(); }}className="btn-primary flex items-center gap-2"
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