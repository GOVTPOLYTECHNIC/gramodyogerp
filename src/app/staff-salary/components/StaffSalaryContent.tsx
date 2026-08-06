'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { IndianRupee, Search, FileText, Users, TrendingDown, Wallet, CalendarCheck, History, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import {
  attendanceRecords, MONTHS, COLLEGE_SHORT, COLLEGE_COLORS,
  computeAttendancePayroll,
} from './salaryData';
import { staffService } from '@/lib/supabase/services';
import SalarySlipModal from './SalarySlipModal';
import PaymentHistoryTab from './PaymentHistoryTab';
import type { SalaryStaff } from './salaryData';
import { toast } from 'sonner';

const COLLEGES = ['All', 'Rajiv Gandhi Polytechnic', 'Rajiv Gandhi ITI', 'GSS Diploma College'];
const CURRENT_YEAR = '2026';
const CURRENT_MONTH = 'July';
const DESIGNATIONS = ['Principal', 'HOD', 'Lecturer', 'Instructor', 'Lab Assistant', 'Clerk', 'Peon'];

const fmt = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${n}`;

type Tab = 'payroll' | 'history';

interface StaffForm {
  name: string; empId: string; college: string; department: string;
  designation: string; basicSalary: string; hra: string; ta: string;
  da: string; pf: string; tds: string; bankName: string;
}

const emptyForm: StaffForm = {
  name: '', empId: '', college: 'Rajiv Gandhi Polytechnic', department: '',
  designation: 'Lecturer', basicSalary: '', hra: '', ta: '', da: '', pf: '', tds: '', bankName: '',
};

export default function StaffSalaryContent() {
  const [staffList, setStaffList] = useState<SalaryStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('payroll');
  const [search, setSearch] = useState('');
  const [college, setCollege] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [slipStaff, setSlipStaff] = useState<SalaryStaff | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<SalaryStaff | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState<StaffForm>(emptyForm);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadStaff();
  }, []);

  async function loadStaff() {
    setLoading(true);
    try {
      const data = await staffService.getAll();
      // Map staff data to SalaryStaff shape
      const mapped = (data as any[]).map((s) => ({
        id: s.id,
        empId: s.empId,
        name: s.name,
        college: s.college,
        department: s.department,
        designation: s.designation || s.role,
        basicSalary: s.basicSalary,
        hra: s.hra,
        ta: s.ta,
        da: s.da,
        pf: s.pf,
        tds: s.tds,
        otherDeductions: s.otherDeductions,
        joiningDate: s.joiningDate,
        bankAccount: s.bankAccount,
        ifsc: s.ifsc,
        bankName: s.bankName,
      }));
      setStaffList(mapped as SalaryStaff[]);
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

  const payrollRows = useMemo(() => {
    return filtered.map((s) => {
      const att = attendanceRecords.find(
        (a) => a.staffId === s.id && a.month === selectedMonth && a.year === selectedYear
      );
      const calc = computeAttendancePayroll(s, att);
      return { staff: s, att, calc };
    });
  }, [filtered, selectedMonth, selectedYear]);

  const totals = useMemo(() => {
    return payrollRows.reduce(
      (acc, r) => ({
        gross: acc.gross + r.calc.gross,
        deductions: acc.deductions + r.calc.totalDeductions,
        net: acc.net + r.calc.net,
        absenceDeductions: acc.absenceDeductions + r.calc.attendanceDeduction,
      }),
      { gross: 0, deductions: 0, net: 0, absenceDeductions: 0 }
    );
  }, [payrollRows]);

  const slipAttendance = slipStaff
    ? attendanceRecords.find(
        (a) => a.staffId === slipStaff.id && a.month === selectedMonth && a.year === selectedYear
      )
    : undefined;

  const openAdd = () => {
    setEditingStaff(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (s: SalaryStaff) => {
    setEditingStaff(s);
    setForm({
      name: s.name, empId: s.empId, college: s.college, department: s.department,
      designation: s.designation, basicSalary: String(s.basicSalary), hra: String(s.hra),
      ta: String(s.ta), da: String(s.da), pf: String(s.pf), tds: String(s.tds), bankName: s.bankName,
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.empId.trim() || !form.department.trim() || !form.basicSalary) {
      setFormError('Name, Employee ID, Department and Basic Salary are required.');
      return;
    }
    const staffData = {
      empId: form.empId.trim(),
      name: form.name.trim(),
      college: form.college,
      department: form.department.trim(),
      role: form.designation,
      designation: form.designation,
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
      bankName: form.bankName.trim() || '',
    };
    try {
      if (editingStaff) {
        const result = await staffService.update(editingStaff.id, staffData);
        if (result) {
          setStaffList(prev => prev.map(s => s.id === editingStaff.id ? {
            ...s, ...(result as any),
            designation: (result as any).designation || (result as any).role,
          } : s));
          toast.success('Staff member updated successfully');
        }
      } else {
        const result = await staffService.create(staffData);
        if (result) {
          const mapped: SalaryStaff = {
            id: (result as any).id,
            empId: (result as any).empId,
            name: (result as any).name,
            college: (result as any).college as SalaryStaff['college'],
            department: (result as any).department,
            designation: (result as any).designation || (result as any).role,
            basicSalary: (result as any).basicSalary,
            hra: (result as any).hra,
            ta: (result as any).ta,
            da: (result as any).da,
            pf: (result as any).pf,
            tds: (result as any).tds,
            otherDeductions: (result as any).otherDeductions,
            joiningDate: (result as any).joiningDate,
            bankAccount: (result as any).bankAccount,
            ifsc: (result as any).ifsc,
            bankName: (result as any).bankName,
          };
          setStaffList(prev => [...prev, mapped]);
          toast.success('Staff member added successfully');
        }
      }
    } catch (e: any) {
      toast.error('Failed to save staff: ' + e.message);
      return;
    }
    setShowModal(false);
    setEditingStaff(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleDelete = async (id: string) => {
    try {
      await staffService.delete(id);
      setStaffList(prev => prev.filter(s => s.id !== id));
      setDeleteConfirmId(null);
      toast.success('Staff member removed');
    } catch (e: any) {
      toast.error('Delete failed: ' + e.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
            <IndianRupee size={20} className="text-violet-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Staff Salary Management</h1>
            <p className="text-sm text-muted-foreground">
              Attendance-based payroll, salary slips & payment history
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {['2024', '2025', '2026'].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={15} />
            Add Staff
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Staff', value: String(filtered.length), sub: 'selected colleges', icon: <Users size={18} />, color: 'text-foreground', bg: 'bg-muted/50', iconBg: 'bg-muted' },
          { label: 'Gross Payroll', value: fmt(totals.gross), sub: `${selectedMonth} ${selectedYear}`, icon: <Wallet size={18} />, color: 'text-violet-700', bg: 'bg-violet-50', iconBg: 'bg-violet-100' },
          { label: 'Absence Deductions', value: fmt(totals.absenceDeductions), sub: 'attendance-based', icon: <TrendingDown size={18} />, color: 'text-red-600', bg: 'bg-red-50', iconBg: 'bg-red-100' },
          { label: 'Net Payroll', value: fmt(totals.net), sub: `After ₹${(totals.deductions / 1000).toFixed(1)}K deductions`, icon: <IndianRupee size={18} />, color: 'text-emerald-700', bg: 'bg-emerald-50', iconBg: 'bg-emerald-100' },
        ].map((k, i) => (
          <div key={i} className={`${k.bg} border border-border rounded-xl p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-lg ${k.iconBg} flex items-center justify-center flex-shrink-0`}>
              <span className={k.color}>{k.icon}</span>
            </div>
            <div>
              <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="text-xs text-muted-foreground">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {([
          { id: 'payroll', label: 'Payroll Calculator', icon: <CalendarCheck size={15} /> },
          { id: 'history', label: 'Payment History', icon: <History size={15} /> },
        ] as { id: Tab; label: string; icon: React.ReactNode }[]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'payroll' && (
        <div className="space-y-4">
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
                <option key={c} value={c}>
                  {c === 'All' ? 'All Colleges' : `${COLLEGE_SHORT[c]} — ${c}`}
                </option>
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
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Attendance</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Gross</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-orange-600">Absence Cut</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-red-600">Total Deductions</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-emerald-600">Net Pay</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollRows.map(({ staff: s, att, calc }) => {
                    const attPct = att ? Math.round((att.presentDays / att.totalDays) * 100) : null;
                    return (
                      <tr key={s.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground text-xs">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.empId}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${COLLEGE_COLORS[s.college]}`}>
                            {COLLEGE_SHORT[s.college]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {att ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 min-w-[60px]">
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${attPct && attPct >= 90 ? 'bg-emerald-500' : attPct && attPct >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                                    style={{ width: `${attPct}%` }}
                                  />
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {att.presentDays}/{att.totalDays}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">No data</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-xs font-medium">₹{calc.gross.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-right text-xs font-semibold text-orange-600">
                          {calc.attendanceDeduction > 0 ? `-₹${calc.attendanceDeduction.toLocaleString('en-IN')}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-right text-xs font-semibold text-red-600">₹{calc.totalDeductions.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-right text-sm font-bold text-emerald-700">₹{calc.net.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setSlipStaff(s)}
                              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                            >
                              <FileText size={11} />
                              Slip
                            </button>
                            <button
                              onClick={() => openEdit(s)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit staff"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(s.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete staff"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {/* Totals Row */}
                  <tr className="border-t-2 border-border bg-muted/40">
                    <td colSpan={3} className="px-4 py-3 text-xs font-bold text-foreground">
                      Total ({filtered.length} staff)
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-bold text-foreground">
                      ₹{totals.gross.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-bold text-orange-600">
                      {totals.absenceDeductions > 0 ? `-₹${totals.absenceDeductions.toLocaleString('en-IN')}` : '—'}
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
        </div>
      )}

      {activeTab === 'history' && <PaymentHistoryTab />}

      {/* Salary Slip Modal */}
      {slipStaff && (
        <SalarySlipModal
          staff={slipStaff}
          attendance={slipAttendance}
          month={selectedMonth}
          year={selectedYear}
          onClose={() => setSlipStaff(null)}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-base font-bold text-foreground mb-2">Delete Staff Member?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              This will remove the staff member from salary management. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-base font-bold text-foreground">
                {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
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
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Designation *</label>
                  <select value={form.designation} onChange={(e) => setForm(f => ({ ...f, designation: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                    {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
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
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">TA (₹)</label>
                  <input type="number" value={form.ta} onChange={(e) => setForm(f => ({ ...f, ta: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">DA (₹)</label>
                  <input type="number" value={form.da} onChange={(e) => setForm(f => ({ ...f, da: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">PF Deduction (₹)</label>
                  <input type="number" value={form.pf} onChange={(e) => setForm(f => ({ ...f, pf: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">TDS Deduction (₹)</label>
                  <input type="number" value={form.tds} onChange={(e) => setForm(f => ({ ...f, tds: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="0" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Bank Name</label>
                  <input type="text" value={form.bankName} onChange={(e) => setForm(f => ({ ...f, bankName: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="e.g. State Bank of India" />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2 border-t border-border">
                <button onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  <Check size={14} />
                  {editingStaff ? 'Save Changes' : 'Add Staff'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
