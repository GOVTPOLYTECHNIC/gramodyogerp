'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { CalendarDays, CheckCircle2, XCircle, Clock, Search, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import {
  LEAVE_TYPE_COLORS,
  STATUS_COLORS,
  LeaveApplication,
} from './leaveData';
import { leaveService } from '@/lib/supabase/services';
import { toast } from 'sonner';

const COLLEGES = [
  'All',
  'Rajiv Gandhi Polytechnic',
  'Rajiv Gandhi ITI',
  'GSS Diploma College',
];

const COLLEGE_SHORT: Record<string, string> = {
  'Rajiv Gandhi Polytechnic': 'RGP',
  'Rajiv Gandhi ITI': 'ITI',
  'GSS Diploma College': 'GSS',
};

const COLLEGE_COLORS: Record<string, string> = {
  'Rajiv Gandhi Polytechnic': 'bg-blue-100 text-blue-700',
  'Rajiv Gandhi ITI': 'bg-purple-100 text-purple-700',
  'GSS Diploma College': 'bg-teal-100 text-teal-700',
};

export default function LeaveManagementContent() {
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [college, setCollege] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [remarksMap, setRemarksMap] = useState<Record<string, string>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadLeaves();
  }, []);

  async function loadLeaves() {
    setLoading(true);
    try {
      const data = await leaveService.getAll();
      setApplications(data as LeaveApplication[]);
    } catch (e: any) {
      toast.error('Failed to load leave applications: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      const matchSearch =
        search === '' ||
        a.staffName.toLowerCase().includes(search.toLowerCase()) ||
        a.empId.toLowerCase().includes(search.toLowerCase());
      const matchCollege = college === 'All' || a.college === college;
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      return matchSearch && matchCollege && matchStatus;
    });
  }, [applications, search, college, statusFilter]);

  const pending = applications.filter((a) => a.status === 'Pending').length;
  const approved = applications.filter((a) => a.status === 'Approved').length;
  const rejected = applications.filter((a) => a.status === 'Rejected').length;

  const handleAction = async (id: string, action: 'Approved' | 'Rejected') => {
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    const updated = {
      ...app,
      status: action as LeaveApplication['status'],
      approvedBy: 'Admin User',
      approvedOn: new Date().toLocaleDateString('en-IN'),
      remarks: remarksMap[id] || '',
    };
    try {
      const result = await leaveService.update(id, updated);
      if (result) {
        setApplications((prev) => prev.map((a) => (a.id === id ? (result as LeaveApplication) : a)));
        toast.success(`Leave ${action.toLowerCase()} successfully`);
      }
    } catch (e: any) {
      toast.error('Action failed: ' + e.message);
    }
    setExpandedId(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await leaveService.delete(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      setDeleteConfirmId(null);
      if (expandedId === id) setExpandedId(null);
      toast.success('Leave application deleted');
    } catch (e: any) {
      toast.error('Delete failed: ' + e.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
          <CalendarDays size={20} className="text-teal-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Leave Management</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${applications.length} applications · ${pending} pending`}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: pending, color: 'text-amber-600', bg: 'bg-amber-50', icon: <Clock size={16} className="text-amber-600" /> },
          { label: 'Approved', value: approved, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <CheckCircle2 size={16} className="text-emerald-600" /> },
          { label: 'Rejected', value: rejected, color: 'text-red-600', bg: 'bg-red-50', icon: <XCircle size={16} className="text-red-600" /> },
        ].map((k) => (
          <div key={k.label} className={`${k.bg} border border-border rounded-xl p-4 flex items-center gap-3`}>
            {k.icon}
            <div>
              <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or employee ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {COLLEGES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {['All', 'Pending', 'Approved', 'Rejected'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="card p-8 text-center text-muted-foreground">Loading leave applications from database...</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const isExpanded = expandedId === app.id;
            const isDeleting = deleteConfirmId === app.id;
            return (
              <div key={app.id} className="card overflow-hidden">
                <div
                  className="p-4 flex items-start gap-4 cursor-pointer hover:bg-secondary/20 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : app.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground">{app.staffName}</p>
                      <span className="text-xs text-muted-foreground">{app.empId}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${COLLEGE_COLORS[app.college] || 'bg-gray-100 text-gray-700'}`}>
                        {COLLEGE_SHORT[app.college] || app.college}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${LEAVE_TYPE_COLORS[app.leaveType] || 'bg-gray-100 text-gray-600'}`}>
                        {app.leaveType}
                      </span>
                      <span className="text-xs text-muted-foreground">{app.fromDate} → {app.toDate} ({app.days} day{app.days > 1 ? 's' : ''})</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-600'}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isDeleting ? (
                      <>
                        <span className="text-xs text-red-600">Delete?</span>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(app.id); }} className="text-xs text-red-600 hover:underline">Yes</button>
                        <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }} className="text-xs text-muted-foreground hover:underline">No</button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(app.id); }}
                        className="p-1.5 text-red-400 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    {isExpanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border p-4 bg-secondary/10 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <div><p className="text-xs text-muted-foreground">Department</p><p className="font-medium">{app.department}</p></div>
                      <div><p className="text-xs text-muted-foreground">Role</p><p className="font-medium">{app.role}</p></div>
                      <div><p className="text-xs text-muted-foreground">Applied On</p><p className="font-medium">{app.appliedOn}</p></div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Reason</p>
                      <p className="text-sm text-foreground bg-background border border-border rounded-lg p-3">{app.reason}</p>
                    </div>
                    {app.status !== 'Pending' && (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><p className="text-xs text-muted-foreground">Actioned By</p><p className="font-medium">{app.approvedBy}</p></div>
                        <div><p className="text-xs text-muted-foreground">On</p><p className="font-medium">{app.approvedOn}</p></div>
                        {app.remarks && <div className="col-span-2"><p className="text-xs text-muted-foreground">Remarks</p><p className="font-medium">{app.remarks}</p></div>}
                      </div>
                    )}
                    {app.status === 'Pending' && (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          placeholder="Add remarks (optional)…"
                          value={remarksMap[app.id] || ''}
                          onChange={(e) => setRemarksMap((m) => ({ ...m, [app.id]: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(app.id, 'Approved')}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                          >
                            <CheckCircle2 size={14} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(app.id, 'Rejected')}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="card p-8 text-center text-muted-foreground">No leave applications found</div>
          )}
        </div>
      )}
    </div>
  );
}
