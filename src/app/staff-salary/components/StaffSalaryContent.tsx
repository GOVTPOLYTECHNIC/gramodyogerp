'use client';
import React, { useState, useMemo } from 'react';
import { IndianRupee, Search, FileText, Users, TrendingDown, Wallet, CalendarCheck, History,  } from 'lucide-react';
import {
  salaryStaff, attendanceRecords, MONTHS, COLLEGE_SHORT, COLLEGE_COLORS,
  computeAttendancePayroll,
} from './salaryData';
import SalarySlipModal from './SalarySlipModal';
import PaymentHistoryTab from './PaymentHistoryTab';
import type { SalaryStaff } from './salaryData';

const COLLEGES = ['All', 'Rajiv Gandhi Polytechnic', 'Rajiv Gandhi ITI', 'GSS Diploma College'];
const CURRENT_YEAR = '2026';
const CURRENT_MONTH = 'July';

const fmt = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${n}`;

type Tab = 'payroll' | 'history';

export default function StaffSalaryContent() {
  const [activeTab, setActiveTab] = useState<Tab>('payroll');
  const [search, setSearch] = useState('');
  const [college, setCollege] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [slipStaff, setSlipStaff] = useState<SalaryStaff | null>(null);

  const filtered = useMemo(() => {
    return salaryStaff.filter((s) => {
      const matchSearch =
        search === '' ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.empId.toLowerCase().includes(search.toLowerCase());
      const matchCollege = college === 'All' || s.college === college;
      return matchSearch && matchCollege;
    });
  }, [search, college]);

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
        {/* Month/Year Selector */}
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
                ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
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
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Slip</th>
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
                          <button
                            onClick={() => setSlipStaff(s)}
                            className="flex items-center gap-1 mx-auto px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                          >
                            <FileText size={12} />
                            View
                          </button>
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
    </div>
  );
}
