'use client';
import React, { useState, useMemo } from 'react';
import { Search, CheckCircle2, Clock, AlertCircle, History } from 'lucide-react';
import { paymentHistory, PaymentRecord, COLLEGE_SHORT, COLLEGE_COLORS, MONTHS } from './salaryData';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  Paid: { label: 'Paid', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle2 size={12} /> },
  Pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock size={12} /> },
  'On Hold': { label: 'On Hold', color: 'bg-red-100 text-red-700 border-red-200', icon: <AlertCircle size={12} /> },
};

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function PaymentHistoryTab() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('2026');

  const filtered = useMemo(() => {
    return paymentHistory.filter((p) => {
      const matchSearch =
        search === '' ||
        p.staffName.toLowerCase().includes(search.toLowerCase()) ||
        p.empId.toLowerCase().includes(search.toLowerCase()) ||
        (p.transactionId ?? '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchMonth = monthFilter === 'All' || p.month === monthFilter;
      const matchYear = yearFilter === 'All' || p.year === yearFilter;
      return matchSearch && matchStatus && matchMonth && matchYear;
    });
  }, [search, statusFilter, monthFilter, yearFilter]);

  const totals = useMemo(() => {
    const paid = filtered.filter((p) => p.status === 'Paid');
    const pending = filtered.filter((p) => p.status === 'Pending');
    return {
      paidCount: paid.length,
      paidAmount: paid.reduce((s, p) => s + p.netSalary, 0),
      pendingCount: pending.length,
      pendingAmount: pending.reduce((s, p) => s + p.netSalary, 0),
    };
  }, [filtered]);

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Records', value: String(filtered.length), sub: 'filtered results', color: 'text-foreground', bg: 'bg-muted/50' },
          { label: 'Paid', value: String(totals.paidCount), sub: fmt(totals.paidAmount), color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Pending', value: String(totals.pendingCount), sub: fmt(totals.pendingAmount), color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Total Disbursed', value: fmt(totals.paidAmount), sub: 'net salary paid', color: 'text-primary', bg: 'bg-primary/5' },
        ].map((k, i) => (
          <div key={i} className={`${k.bg} border border-border rounded-xl p-3`}>
            <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className="text-xs text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, ID or transaction…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="On Hold">On Hold</option>
        </select>
        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="All">All Months</option>
          {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="All">All Years</option>
          {['2024', '2025', '2026'].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
          <History size={16} className="text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">{filtered.length} payment record{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">College</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Period</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Gross</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-red-600">Deductions</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-emerald-600">Net Pay</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Paid On</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p: PaymentRecord) => {
                const cfg = STATUS_CONFIG[p.status];
                return (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground text-xs">{p.staffName}</p>
                      <p className="text-xs text-muted-foreground">{p.empId}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${COLLEGE_COLORS[p.college]}`}>
                        {COLLEGE_SHORT[p.college]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.month} {p.year}</td>
                    <td className="px-4 py-3 text-right text-xs font-medium">{fmt(p.grossSalary)}</td>
                    <td className="px-4 py-3 text-right text-xs font-semibold text-red-600">{fmt(p.totalDeductions)}</td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-emerald-700">{fmt(p.netSalary)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.paidDate ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{p.transactionId ?? '—'}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No payment records found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
