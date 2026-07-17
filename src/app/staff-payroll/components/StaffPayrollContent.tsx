'use client';
import React, { useState, useMemo } from 'react';
import { Wallet, Search, FileText } from 'lucide-react';
import { mockStaff, computePayroll, MONTHS, StaffMember } from './payrollData';
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

export default function StaffPayrollContent() {
  const [search, setSearch] = useState('');
  const [college, setCollege] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [slipStaff, setSlipStaff] = useState<StaffMember | null>(null);

  const filtered = useMemo(() => {
    return mockStaff.filter((s) => {
      const matchSearch =
        search === '' ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.empId.toLowerCase().includes(search.toLowerCase());
      const matchCollege = college === 'All' || s.college === college;
      return matchSearch && matchCollege;
    });
  }, [search, college]);

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
        {/* Month/Year Selector */}
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
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Slip</th>
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
    </div>
  );
}
