'use client';
import React, { useState, useMemo } from 'react';
import { Wallet, Search, FileText, Plus, Trash2, X } from 'lucide-react';
import { mockStaff as initialMockStaff, computePayroll, MONTHS, StaffMember } from './payrollData';
import SalarySlipModal from './SalarySlipModal';

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
  const [staffList, setStaffList] = useState<StaffMember[]>(initialMockStaff);
  const [search, setSearch] = useState('');
  const [college, setCollege] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [slipStaff, setSlipStaff] = useState<StaffMember | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState<AddStaffForm>(emptyForm);
  const [formError, setFormError] = useState('');

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

  const handleAddStaff = () => {
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
    setStaffList((prev) => [...prev, newStaff]);
    setShowAddModal(false);
    setForm(emptyForm);
    setFormError('');
  };

  const handleDelete = (id: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
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
              Salary records, deductions & monthly salary slip generation
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
          { label: 'Total Staff', value: String(filtered.length), sub: 'across selected colleges', color: 'text-foreground', bg: 'bg-muted' },
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
          {COLLEGES.map((c) => (
            <option key={c} value={c}>{c === 'All' ? 'All Colleges' : `${COLLEGE_SHORT[c]} — ${c}`}</option>
          ))}
        </select>
      </div>

      {/* Payroll Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <span className="text-sm font-semibold text-foreground">
            {filtered.length} staff member{filtered.length !== 1 ? 's' : ''} — {selectedMonth} {selectedYear}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">College</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Role</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Basic</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Allowances</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Gross</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-red-600">Deductions</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-emerald-600">Net Pay</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const { gross, deductions, net } = computePayroll(s);
                const allowances = s.hra + s.ta + s.da;
                return (
                  <tr key={s.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.empId}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${COLLEGE_COLORS[s.college]}`}>
                        {COLLEGE_SHORT[s.college]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{s.role}</td>
                    <td className="px-4 py-3 text-right text-xs font-medium">₹{s.basicSalary.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right text-xs font-medium">₹{allowances.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right text-xs font-semibold text-foreground">₹{gross.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right text-xs font-semibold text-red-600">₹{deductions.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-emerald-700">₹{net.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSlipStaff(s)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                        >
                          <FileText size={12} />
                          View
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(s.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete staff"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {/* Totals Row */}
              <tr className="border-t-2 border-border bg-muted/40">
                <td colSpan={5} className="px-4 py-3 text-xs font-bold text-foreground">
                  Total ({filtered.length} staff)
                </td>
                <td className="px-4 py-3 text-right text-xs font-bold text-foreground">
                  ₹{totals.gross.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-right text-xs font-bold text-red-600">
                  ₹{totals.deductions.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-emerald-700">
                  ₹{totals.net.toLocaleString('en-IN')}
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Slip Modal */}
      {slipStaff && (
        <SalarySlipModal
          staff={slipStaff}
          month={selectedMonth}
          year={selectedYear}
          onClose={() => setSlipStaff(null)}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-base font-bold text-foreground mb-2">Delete Staff Member?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              This will remove the staff member from payroll. This action cannot be undone.
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

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-base font-bold text-foreground">Add Staff Member</h3>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {formError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Full Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="e.g. Ramesh Kumar Sharma" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Employee ID *</label>
                  <input type="text" value={form.empId} onChange={(e) => setForm(f => ({ ...f, empId: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="e.g. RGP-EMP-010" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">College *</label>
                  <select value={form.college} onChange={(e) => setForm(f => ({ ...f, college: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="Rajiv Gandhi Polytechnic">Rajiv Gandhi Polytechnic</option>
                    <option value="Rajiv Gandhi ITI">Rajiv Gandhi ITI</option>
                    <option value="GSS Diploma College">GSS Diploma College</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Department *</label>
                  <input type="text" value={form.department} onChange={(e) => setForm(f => ({ ...f, department: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="e.g. Civil Engineering" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Role *</label>
                  <select value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Basic Salary (₹) *</label>
                  <input type="number" value={form.basicSalary} onChange={(e) => setForm(f => ({ ...f, basicSalary: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="e.g. 30000" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">HRA (₹)</label>
                  <input type="number" value={form.hra} onChange={(e) => setForm(f => ({ ...f, hra: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">TA (₹)</label>
                  <input type="number" value={form.ta} onChange={(e) => setForm(f => ({ ...f, ta: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">DA (₹)</label>
                  <input type="number" value={form.da} onChange={(e) => setForm(f => ({ ...f, da: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">PF Deduction (₹)</label>
                  <input type="number" value={form.pf} onChange={(e) => setForm(f => ({ ...f, pf: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">TDS Deduction (₹)</label>
                  <input type="number" value={form.tds} onChange={(e) => setForm(f => ({ ...f, tds: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="0" />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2 border-t border-border">
                <button onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button onClick={handleAddStaff}
                  className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Add Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
