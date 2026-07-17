'use client';
import React, { useState, useMemo } from 'react';
import { CalendarDays, CheckCircle2, XCircle, Clock, Search, ChevronDown, ChevronUp, Building2, Trash2 } from 'lucide-react';
import {
  mockLeaveApplications,
  LEAVE_TYPE_COLORS,
  STATUS_COLORS,
  LeaveApplication,
} from './leaveData';

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

export default function LeaveManagementContent() {
  const [applications, setApplications] = useState<LeaveApplication[]>(mockLeaveApplications);
  const [search, setSearch] = useState('');
  const [college, setCollege] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [remarksMap, setRemarksMap] = useState<Record<string, string>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: action,
              approvedBy: 'Admin User',
              approvedOn: new Date().toLocaleDateString('en-IN'),
              remarks: remarksMap[id] || '',
            }
          : a
      )
    );
    setExpandedId(null);
  };

  const handleDelete = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirmId(null);
    if (expandedId === id) setExpandedId(null);
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
            Staff leave applications and admin approval workflow
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Approval', value: pending, icon: <Clock size={18} />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: 'Approved', value: approved, icon: <CheckCircle2 size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
          { label: 'Rejected', value: rejected, icon: <XCircle size={18} />, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
        ].map((k, i) => (
          <div key={i} className={`${k.bg} border ${k.border} rounded-xl p-4 flex items-center gap-3`}>
            <div className={`w-9 h-9 rounded-lg bg-white flex items-center justify-center ${k.color}`}>
              {k.icon}
            </div>
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
          {COLLEGES.map((c) => (
            <option key={c} value={c}>{c === 'All' ? 'All Colleges' : `${COLLEGE_SHORT[c]} — ${c}`}</option>
          ))}
        </select>
        <div className="flex gap-1">
          {['All', 'Pending', 'Approved', 'Rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                statusFilter === s
                  ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-xl py-12 text-center text-muted-foreground text-sm">
            No leave applications found.
          </div>
        ) : (
          filtered.map((app) => {
            const isExpanded = expandedId === app.id;
            return (
              <div
                key={app.id}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                {/* Card Header */}
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Clickable area */}
                  <div
                    className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                      {app.staffName.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground text-sm">{app.staffName}</p>
                        <span className="text-xs text-muted-foreground">{app.empId}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${LEAVE_TYPE_COLORS[app.leaveType]}`}>
                          {app.leaveType}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Building2 size={11} />
                          {COLLEGE_SHORT[app.college]} · {app.department}
                        </span>
                        <span>{app.fromDate} → {app.toDate}</span>
                        <span className="font-medium">{app.days} day{app.days !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[app.status]}`}>
                      {app.status}
                    </span>
                    <button
                      onClick={() => setDeleteConfirmId(app.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete application"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : app.id)}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-border px-5 py-4 space-y-4 bg-muted/20">
                    {/* Reason */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Reason
                      </p>
                      <p className="text-sm text-foreground">{app.reason}</p>
                    </div>

                    {/* Applied On */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Applied on: <span className="font-medium text-foreground">{app.appliedOn}</span></span>
                      {app.approvedOn && (
                        <span>
                          {app.status === 'Approved' ? 'Approved' : 'Rejected'} on:{' '}
                          <span className="font-medium text-foreground">{app.approvedOn}</span>
                          {app.approvedBy && ` by ${app.approvedBy}`}
                        </span>
                      )}
                    </div>

                    {/* Existing Remarks */}
                    {app.remarks && (
                      <div className="bg-card border border-border rounded-lg px-4 py-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Admin Remarks</p>
                        <p className="text-sm text-foreground">{app.remarks}</p>
                      </div>
                    )}

                    {/* Approval Actions (only for Pending) */}
                    {app.status === 'Pending' && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                            Remarks (optional)
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Add remarks before approving or rejecting…"
                            value={remarksMap[app.id] || ''}
                            onChange={(e) =>
                              setRemarksMap((prev) => ({ ...prev, [app.id]: e.target.value }))
                            }
                            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleAction(app.id, 'Approved')}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                          >
                            <CheckCircle2 size={15} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(app.id, 'Rejected')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            <XCircle size={15} />
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-base font-bold text-foreground mb-2">Delete Leave Application?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              This will permanently remove this leave application. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
