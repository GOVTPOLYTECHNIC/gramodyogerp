'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Wallet, Search, FileText, Plus, Trash2, X } from 'lucide-react';
import { computePayroll, MONTHS, StaffMember } from './payrollData';
import { staffService } from '@/lib/supabase/services';
import SalarySlipModal from './SalarySlipModal';
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
  'Rajiv Gandhi ITI': 'bg-emerald-100 text-emerald-700',
  'GSS Diploma College': 'bg-amber-100 text-amber-700',
};

const fmt = (n: number) =>
  n >= 100000
    ? `₹${(n / 100000).toFixed(2)}L`
    : n >= 1000
    ? `₹${(n / 1000).toFixed(1)}K`
    : `₹${n}`;

const CURRENT_YEAR = '2026';
const CURRENT_MONTH = 'July';

const ROLES = ['Principal', 'HOD', 'Lecturer', 'Instructor', 'Lab Assistant', 'Clerk', 'Peon'] as const;

interface AddStaffForm {
  name: string;
  empId: string;
  college: string;
  department: string;
  role: string;
  basicSalary: string;
  hra: string;
  ta: string;
  da: string;
  pf: string;
  tds: string;
}

const emptyForm: AddStaffForm = {
  name: '', empId: '', college: 'Rajiv Gandhi Polytechnic', department: '',
  role: 'Lecturer', basicSalary: '', hra: '', ta: '', da: '', pf: '', tds: '',
};

export default function StaffPayrollContent() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [college, setCollege] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [slipStaff, setSlipStaff] = useState<StaffMember | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState<AddStaffForm>(emptyForm);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadStaff();
  }, []);

  async function loadStaff() {
    setLoading(true);
    try {
      const data = await staffService.getAll();
      setStaffList(data as StaffMember[]);
    } catch (e: any) {
      toast.error('Failed to load staff: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return staffList.filter((s) => {
      const matchSearch =
        search === '' ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.empId.toLowerCase().includes(search.toLowerCase());
      const matchCollege = college === 'All' || s.college === college;
      return matchSearch && matchCollege;
    });
  }, [search, college, staffList]);

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, s) => {
        const { gross, deductions, net } = computePayroll(s);
        return {
          gross: acc.gross + gross,
          deductions: acc.deductions + deductions,
          net: acc.net + net,
        };
      },
      { gross: 0, deductions: 0, net: 0 }
    );
  }, [filtered]);

  const handleAddStaff = async () => {
    if (!form.name.trim() || !form.empId.trim() || !form.department.trim() || !form.basicSalary) {
      setFormError('Name, Employee ID, Department and Basic Salary are required.');
      return;
    }
    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      empId: form.empId.trim(),
      name: form.name.trim(),
      college: form.college as StaffMember['college'],
      department: form.department.trim(),
      role: form.role as StaffMember['role'],
      basicSalary: Number(form.basicSalary) || 0,
      hra: Number(form.hra) || 0,
      ta: Number(form.ta) || 0,
      da: Number(form.da) || 0,
      pf: Number(form.pf) || 0,
      tds: Number(form.tds) || 0,
      otherDeductions: 0,
      joiningDate: new Date().toLocaleDateString('en-IN'),
      bankAccount: '',
      ifsc: '',
    };
    try {
      const result = await staffService.create(newStaff);
      if (result) {
        setStaffList((prev) => [...prev, result as StaffMember]);
        toast.success('Staff member added successfully');
      }
    } catch (e: any) {
      toast.error('Failed to add staff: ' + e.message);
    }
    setShowAddModal(false);
    setForm(emptyForm);
    setFormError('');
  };

  const handleDelete = async (id: string) => {
    try {
      await staffService.delete(id);
      setStaffList((prev) => prev.filter((s) => s.id !== id));
      toast.success('Staff member removed');
    } catch (e: any) {
      toast.error('Delete failed: ' + e.message);
    }
    setDeleteConfirmId(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <Wallet size={20} className="text-violet-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Staff Payroll</h1>
            <p className="text-sm text-muted-foreground">
              Salary records, deductions &amp; monthly salary slip generation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {['2024', '2025', '2026'].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={() => { setShowAddModal(true); setForm(emptyForm); setFormError(''); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={15} />
            Add Staff
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Staff', value: loading ? '...' : String(filtered.length), sub: 'across selected colleges', color: 'text-foreground', bg: 'bg-muted' },
          { label: 'Gross Payroll', value: fmt(totals.gross), sub: `${selectedMonth} ${selectedYear}`, color: 'text-violet-700', bg: 'bg-violet-50' },
          { label: 'Net Payroll', value: fmt(totals.net), sub: `After ₹${(totals.deductions / 1000).toFixed(1)}K deductions`, color: 'text-emerald-700', bg: 'bg-emerald-50' },
        ].map((k, i) => (
          <div key={i} className={`${k.bg} border border-border rounded-xl p-4`}>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{k.sub}</p>
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
      </div>

      {/* Table */}
      {loading ? (
        <div className="card p-8 text-center text-muted-foreground">Loading staff from database...</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50 text-left">
                  <th className="px-4 py-3 font-semibold text-muted-foreground">#</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Employee</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">College</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Role</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Gross</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Deductions</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Net</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((s, idx) => {
                  const { gross, deductions, net } = computePayroll(s);
                  const isDeleting = deleteConfirmId === s.id;
                  return (
                    <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.empId} · {s.department}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${COLLEGE_COLORS[s.college] || 'bg-gray-100 text-gray-700'}`}>
                          {COLLEGE_SHORT[s.college] || s.college}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{s.role}</td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">{fmt(gross)}</td>
                      <td className="px-4 py-3 text-right text-red-600">-{fmt(deductions)}</td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-700">{fmt(net)}</td>
                      <td className="px-4 py-3">
                        {isDeleting ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-red-600">Delete?</span>
                            <button onClick={() => handleDelete(s.id)} className="text-xs text-red-600 hover:underline">Yes</button>
                            <button onClick={() => setDeleteConfirmId(null)} className="text-xs text-muted-foreground hover:underline">No</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSlipStaff(s)}
                              className="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                            >
                              <FileText size={12} />
                              Slip
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(s.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No staff found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-semibold text-foreground">Add Staff Member</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-secondary rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {formError && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded">{formError}</p>}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Full Name *', key: 'name', type: 'text' },
                  { label: 'Employee ID *', key: 'empId', type: 'text' },
                  { label: 'Department *', key: 'department', type: 'text' },
                  { label: 'Basic Salary *', key: 'basicSalary', type: 'number' },
                  { label: 'HRA', key: 'hra', type: 'number' },
                  { label: 'TA', key: 'ta', type: 'number' },
                  { label: 'DA', key: 'da', type: 'number' },
                  { label: 'PF', key: 'pf', type: 'number' },
                  { label: 'TDS', key: 'tds', type: 'number' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
                    <input
                      type={type}
                      value={(form as any)[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">College</label>
                  <select
                    value={form.college}
                    onChange={(e) => setForm((f) => ({ ...f, college: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {COLLEGES.filter((c) => c !== 'All').map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-5 border-t border-border">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary text-sm h-9">Cancel</button>
              <button onClick={handleAddStaff} className="btn-primary text-sm h-9">Add Staff</button>
            </div>
          </div>
        </div>
      )}

      {slipStaff && (
        <SalarySlipModal
          staff={slipStaff}
          month={selectedMonth}
          year={selectedYear}
          onClose={() => setSlipStaff(null)}
        />
      )}
    </div>
  );
}
