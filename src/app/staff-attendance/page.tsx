'use client';
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { createClient } from '@/lib/supabase/client';
import { CalendarCheck, CheckCircle2, XCircle, Clock, Users, Pencil, Trash2, X, Save, Plus, Loader2 } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: string;
}

type AttendanceStatus = 'present' | 'absent' | 'late';

interface EditForm {
  name: string;
  role: string;
  department: string;
}

export default function StaffAttendancePage() {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ name: '', role: '', department: '' });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<EditForm>({ name: '', role: '', department: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('staff')
        .select('id, name, role, department')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      const members: StaffMember[] = (data || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        role: s.role || 'Staff',
        department: s.department || 'General',
        status: 'present',
      }));

      setStaffList(members);
      setAttendance(Object.fromEntries(members.map((s) => [s.id, 'present' as AttendanceStatus])));
      setLoading(false);
    };

    fetchStaff();
  }, []);

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

  const handleEditStart = (staff: StaffMember) => {
    setEditingId(staff.id);
    setEditForm({ name: staff.name, role: staff.role, department: staff.department });
  };

  const handleEditSave = (id: string) => {
    if (!editForm.name.trim()) return;
    setStaffList((prev) =>
      prev.map((s) => s.id === id ? { ...s, name: editForm.name.trim(), role: editForm.role.trim(), department: editForm.department.trim() } : s)
    );
    setEditingId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
    setAttendance((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    setDeleteConfirmId(null);
  };

  const handleAddStaff = () => {
    if (!addForm.name.trim()) return;
    const newId = `local-${Date.now()}`;
    const newStaff: StaffMember = {
      id: newId,
      name: addForm.name.trim(),
      role: addForm.role.trim() || 'Staff',
      department: addForm.department.trim() || 'General',
      status: 'present',
    };
    setStaffList((prev) => [...prev, newStaff]);
    setAttendance((prev) => ({ ...prev, [newId]: 'present' }));
    setAddForm({ name: '', role: '', department: '' });
    setAddOpen(false);
  };

  return (
    <AppLayout title="Staff Attendance">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Staff Attendance</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="btn-primary flex items-center gap-2 h-9"
          >
            <Plus size={16} />
            Add Staff
          </button>
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

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 size={20} className="animate-spin" />
              <span>Loading staff...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-16 text-danger text-sm">
              Error: {error}
            </div>
          ) : staffList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground text-sm gap-2">
              <Users size={32} className="opacity-30" />
              <p>Koi staff nahi mila. Pehle Staff Management mein staff add karein.</p>
            </div>
          ) : (
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
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {staffList.map((staff, idx) => {
                    const status = attendance[staff.id] || 'present';
                    const cfg = statusConfig[status];
                    const isEditing = editingId === staff.id;
                    const isDeleting = deleteConfirmId === staff.id;

                    return (
                      <tr key={staff.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>

                        {/* Name */}
                        <td className="px-4 py-3 font-medium text-foreground">
                          {isEditing ? (
                            <input
                              className="input-field py-1 text-sm w-36"
                              value={editForm.name}
                              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                            />
                          ) : staff.name}
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3 text-muted-foreground">
                          {isEditing ? (
                            <input
                              className="input-field py-1 text-sm w-28"
                              value={editForm.role}
                              onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                            />
                          ) : staff.role}
                        </td>

                        {/* Department */}
                        <td className="px-4 py-3 text-muted-foreground">
                          {isEditing ? (
                            <input
                              className="input-field py-1 text-sm w-32"
                              value={editForm.department}
                              onChange={(e) => setEditForm((f) => ({ ...f, department: e.target.value }))}
                            />
                          ) : staff.department}
                        </td>

                        {/* Status Badge */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
                            {cfg.icon}
                            {cfg.label}
                          </span>
                        </td>

                        {/* Mark Attendance */}
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

                        {/* Edit / Delete Actions */}
                        <td className="px-4 py-3">
                          {isDeleting ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-danger font-medium">Delete?</span>
                              <button
                                onClick={() => handleDelete(staff.id)}
                                className="px-2 py-1 rounded text-xs font-medium bg-danger text-white hover:bg-danger/90 transition-colors"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 rounded text-xs font-medium border border-border hover:bg-secondary transition-colors"
                              >
                                No
                              </button>
                            </div>
                          ) : isEditing ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEditSave(staff.id)}
                                className="p-1.5 rounded text-green-600 hover:bg-green-50 transition-colors"
                                title="Save"
                              >
                                <Save size={15} />
                              </button>
                              <button
                                onClick={handleEditCancel}
                                className="p-1.5 rounded text-muted-foreground hover:bg-secondary transition-colors"
                                title="Cancel"
                              >
                                <X size={15} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEditStart(staff)}
                                className="p-1.5 rounded text-primary hover:bg-primary/10 transition-colors"
                                title="Edit"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(staff.id)}
                                className="p-1.5 rounded text-danger hover:bg-danger/10 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Staff Modal */}
        {addOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-background rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Add New Staff</h3>
                <button onClick={() => setAddOpen(false)} className="p-1.5 rounded hover:bg-secondary transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Name <span className="text-danger">*</span></label>
                  <input
                    className="input-field"
                    placeholder="Enter staff name"
                    value={addForm.name}
                    onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Role</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Lecturer, Instructor"
                    value={addForm.role}
                    onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Department</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Computer Science"
                    value={addForm.department}
                    onChange={(e) => setAddForm((f) => ({ ...f, department: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <button onClick={() => setAddOpen(false)} className="btn-secondary">Cancel</button>
                <button
                  onClick={handleAddStaff}
                  disabled={!addForm.name.trim()}
                  className="btn-primary disabled:opacity-50"
                >
                  Add Staff
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
