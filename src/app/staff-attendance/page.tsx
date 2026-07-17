'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { CalendarCheck, CheckCircle2, XCircle, Clock, Users } from 'lucide-react';

const staffList = [
  { id: 1, name: 'Rajesh Kumar', role: 'Principal', department: 'Administration', status: 'present' },
  { id: 2, name: 'Sunita Devi', role: 'Lecturer', department: 'Computer Science', status: 'present' },
  { id: 3, name: 'Mohan Lal', role: 'Instructor', department: 'Electrical', status: 'absent' },
  { id: 4, name: 'Priya Sharma', role: 'Lecturer', department: 'Mechanical', status: 'present' },
  { id: 5, name: 'Anil Verma', role: 'Lab Assistant', department: 'Electronics', status: 'late' },
  { id: 6, name: 'Kavita Singh', role: 'Clerk', department: 'Administration', status: 'present' },
  { id: 7, name: 'Ramesh Yadav', role: 'Instructor', department: 'Civil', status: 'absent' },
  { id: 8, name: 'Neha Gupta', role: 'Lecturer', department: 'Mathematics', status: 'present' },
];

type AttendanceStatus = 'present' | 'absent' | 'late';

export default function StaffAttendancePage() {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>(
    Object.fromEntries(staffList.map((s) => [s.id, s.status as AttendanceStatus]))
  );

  const counts = {
    present: Object.values(attendance).filter((v) => v === 'present').length,
    absent: Object.values(attendance).filter((v) => v === 'absent').length,
    late: Object.values(attendance).filter((v) => v === 'late').length,
  };

  const statusConfig: Record<AttendanceStatus, { label: string; color: string; icon: React.ReactNode }> = {
    present: { label: 'Present', color: 'text-green-600 bg-green-50 border-green-200', icon: <CheckCircle2 size={14} /> },
    absent: { label: 'Absent', color: 'text-red-600 bg-red-50 border-red-200', icon: <XCircle size={14} /> },
    late: { label: 'Late', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: <Clock size={14} /> },
  };

  return (
    <AppLayout title="Staff Attendance">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Attendance</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Staff</p>
              <p className="text-xl font-bold text-foreground">{staffList.length}</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Present</p>
              <p className="text-xl font-bold text-green-600">{counts.present}</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Absent</p>
              <p className="text-xl font-bold text-red-600">{counts.absent}</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock size={18} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Late</p>
              <p className="text-xl font-bold text-yellow-600">{counts.late}</p>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <CalendarCheck size={18} className="text-primary" />
            <h2 className="font-semibold text-foreground">Today&apos;s Attendance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Department</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Mark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {staffList.map((staff, idx) => {
                  const status = attendance[staff.id];
                  const cfg = statusConfig[status];
                  return (
                    <tr key={staff.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{staff.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{staff.role}</td>
                      <td className="px-4 py-3 text-muted-foreground">{staff.department}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {(['present', 'absent', 'late'] as AttendanceStatus[]).map((s) => (
                            <button
                              key={s}
                              onClick={() => setAttendance((prev) => ({ ...prev, [staff.id]: s }))}
                              className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
                                status === s
                                  ? statusConfig[s].color
                                  : 'text-muted-foreground border-border hover:bg-secondary'
                              }`}
                            >
                              {statusConfig[s].label}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
