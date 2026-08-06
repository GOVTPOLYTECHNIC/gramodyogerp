'use client';
import React, { useMemo, useState, useEffect } from 'react';
import {
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  TrendingUp,
  Building2,
  CreditCard,
  Wallet,
  Landmark,
  FileCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { studentService, feeService } from '@/lib/supabase/services';

const COLLEGES = [
  {
    key: 'RGP',
    name: 'Rajiv Gandhi Polytechnic',
    shortName: 'RGP',
    schoolName: 'Rajiv Gandhi Polytechnic',
    color: '#2563eb',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    key: 'ITI',
    name: 'Rajiv Gandhi ITI',
    shortName: 'ITI',
    schoolName: 'Rajiv Gandhi ITI',
    color: '#059669',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    key: 'GSS',
    name: 'Gramodyog Sewa Sansthan',
    shortName: 'GSS',
    schoolName: 'GSS Diploma College',
    color: '#d97706',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
  },
];

const PAYMENT_MODE_COLORS: Record<string, string> = {
  Cash: '#f59e0b',
  Online: '#2563eb',
  DD: '#7c3aed',
  Cheque: '#059669',
};

const STATUS_COLORS: Record<string, string> = {
  Paid: '#16a34a',
  Partial: '#d97706',
  Pending: '#6b7280',
  Overdue: '#dc2626',
};

const fmt = (n: number) =>
  n >= 100000
    ? `₹${(n / 100000).toFixed(2)}L`
    : n >= 1000
    ? `₹${(n / 1000).toFixed(1)}K`
    : `₹${n}`;

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color?: string; fill?: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: p.color || p.fill }}
            />
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-semibold text-foreground">
              {typeof p.value === 'number' && p.name !== 'Students'
                ? fmt(p.value)
                : p.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function FinancialReconciliationContent() {
  const [students, setStudents] = useState<any[]>([]);
  const [feeRecords, setFeeRecords] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const [studentsData, feesData] = await Promise.all([
        studentService.getAll(),
        feeService.getAll(),
      ]);
      setStudents(studentsData);
      setFeeRecords(feesData);
    }
    loadData();
  }, []);

  // ── Institution-level aggregations ──────────────────────────────────────
  const institutionStats = useMemo(() => {
    return COLLEGES.map((col) => {
      const records = feeRecords.filter((f) => f.school === col.schoolName);
      const studentsInCollege = students.filter((s) => s.school === col.schoolName);

      const totalBilled = studentsInCollege.reduce((s, st) => s + st.totalFees, 0);
      const totalCollected = records.reduce((s, r) => s + r.paidAmount, 0);
      const totalDiscount = records.reduce((s, r) => s + r.discount, 0);
      const totalPending = studentsInCollege.reduce(
        (s, st) => s + Math.max(0, st.totalFees - st.paidFees),
        0
      );
      const paidCount = studentsInCollege.filter((s) => s.feeStatus === 'Paid').length;
      const overdueCount = studentsInCollege.filter((s) => s.feeStatus === 'Overdue').length;
      const partialCount = studentsInCollege.filter((s) => s.feeStatus === 'Partial').length;
      const pendingCount = studentsInCollege.filter((s) => s.feeStatus === 'Pending').length;
      const collectionRate =
        totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

      return {
        ...col,
        totalBilled,
        totalCollected,
        totalDiscount,
        totalPending,
        paidCount,
        overdueCount,
        partialCount,
        pendingCount,
        collectionRate,
        studentCount: studentsInCollege.length,
      };
    });
  }, [students, feeRecords]);

  // ── Grand totals ─────────────────────────────────────────────────────────
  const grandTotals = useMemo(() => {
    return institutionStats.reduce(
      (acc, s) => ({
        totalBilled: acc.totalBilled + s.totalBilled,
        totalCollected: acc.totalCollected + s.totalCollected,
        totalDiscount: acc.totalDiscount + s.totalDiscount,
        totalPending: acc.totalPending + s.totalPending,
        studentCount: acc.studentCount + s.studentCount,
      }),
      { totalBilled: 0, totalCollected: 0, totalDiscount: 0, totalPending: 0, studentCount: 0 }
    );
  }, [institutionStats]);

  const overallCollectionRate =
    grandTotals.totalBilled > 0
      ? Math.round((grandTotals.totalCollected / grandTotals.totalBilled) * 100)
      : 0;

  // ── Course-wise revenue ──────────────────────────────────────────────────
  const courseRevenueData = useMemo(() => {
    const map: Record<string, { collected: number; pending: number; college: string }> = {};
    students.forEach((s) => {
      if (!map[s.course]) {
        const col = COLLEGES.find((c) => c.schoolName === s.school);
        map[s.course] = { collected: 0, pending: 0, college: col?.shortName || '' };
      }
      map[s.course].collected += s.paidFees;
      map[s.course].pending += Math.max(0, s.totalFees - s.paidFees);
    });
    return Object.entries(map)
      .map(([course, data]) => ({
        course: course.length > 20 ? course.slice(0, 18) + '…' : course,
        fullCourse: course,
        ...data,
      }))
      .sort((a, b) => b.collected - a.collected);
  }, [students]);

  // ── Semester breakdown ───────────────────────────────────────────────────
  const semesterData = useMemo(() => {
    const map: Record<string, { collected: number; pending: number; students: number }> = {};
    students.forEach((s) => {
      const key = `Sem ${s.semester}`;
      if (!map[key]) map[key] = { collected: 0, pending: 0, students: 0 };
      map[key].collected += s.paidFees;
      map[key].pending += Math.max(0, s.totalFees - s.paidFees);
      map[key].students += 1;
    });
    return Object.entries(map)
      .map(([sem, data]) => ({ sem, ...data }))
      .sort((a, b) => parseInt(a.sem.split(' ')[1]) - parseInt(b.sem.split(' ')[1]));
  }, [students]);

  // ── Payment method summary ───────────────────────────────────────────────
  const paymentMethodData = useMemo(() => {
    const map: Record<string, { amount: number; count: number }> = {};
    feeRecords.forEach((r) => {
      if (r.paidAmount > 0) {
        if (!map[r.paymentMode]) map[r.paymentMode] = { amount: 0, count: 0 };
        map[r.paymentMode].amount += r.paidAmount;
        map[r.paymentMode].count += 1;
      }
    });
    return Object.entries(map).map(([mode, data]) => ({ mode, ...data }));
  }, [feeRecords]);

  const totalPaymentAmount = paymentMethodData.reduce((s, d) => s + d.amount, 0);

  // ── Fee status pie data ──────────────────────────────────────────────────
  const feeStatusData = useMemo(() => {
    const map: Record<string, number> = { Paid: 0, Partial: 0, Pending: 0, Overdue: 0 };
    students.forEach((s) => {
      map[s.feeStatus] = (map[s.feeStatus] || 0) + 1;
    });
    return Object.entries(map)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));
  }, [students]);

  // ── Institution comparison bar data ─────────────────────────────────────
  const comparisonData = institutionStats.map((s) => ({
    name: s.shortName,
    Collected: s.totalCollected,
    Pending: s.totalPending,
    Discount: s.totalDiscount,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Financial Reconciliation</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Institution-wide fee collection overview — Academic Year 2026-27
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2">
          <Building2 size={16} className="text-primary" />
          <span className="text-sm font-semibold text-primary">All 3 Institutions</span>
        </div>
      </div>

      {/* Grand KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: 'Total Billed',
            value: fmt(grandTotals.totalBilled),
            icon: FileCheck,
            color: 'text-slate-700',
            bg: 'bg-slate-50',
            border: 'border-slate-200',
          },
          {
            label: 'Total Collected',
            value: fmt(grandTotals.totalCollected),
            icon: CheckCircle2,
            color: 'text-green-700',
            bg: 'bg-green-50',
            border: 'border-green-200',
          },
          {
            label: 'Total Pending',
            value: fmt(grandTotals.totalPending),
            icon: AlertCircle,
            color: 'text-red-700',
            bg: 'bg-red-50',
            border: 'border-red-200',
          },
          {
            label: 'Total Discount',
            value: fmt(grandTotals.totalDiscount),
            icon: TrendingUp,
            color: 'text-purple-700',
            bg: 'bg-purple-50',
            border: 'border-purple-200',
          },
          {
            label: 'Collection Rate',
            value: `${overallCollectionRate}%`,
            icon: IndianRupee,
            color: 'text-amber-700',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className={`${kpi.bg} ${kpi.border} border rounded-2xl p-4 flex flex-col gap-2`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
              <kpi.icon size={16} className={kpi.color} />
            </div>
            <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-muted-foreground">{grandTotals.studentCount} students</p>
          </div>
        ))}
      </div>

      {/* Fee Collection Reconciliation Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <IndianRupee size={18} className="text-primary" />
          <h2 className="font-semibold text-foreground">Fee Collection Reconciliation</h2>
          <span className="ml-auto text-xs text-muted-foreground">Per Institution</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-xs text-muted-foreground uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-semibold">Institution</th>
                <th className="text-right px-4 py-3 font-semibold">Students</th>
                <th className="text-right px-4 py-3 font-semibold">Total Billed</th>
                <th className="text-right px-4 py-3 font-semibold">Collected</th>
                <th className="text-right px-4 py-3 font-semibold">Discount</th>
                <th className="text-right px-4 py-3 font-semibold">Pending</th>
                <th className="text-right px-4 py-3 font-semibold">Paid</th>
                <th className="text-right px-4 py-3 font-semibold">Overdue</th>
                <th className="text-right px-5 py-3 font-semibold">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {institutionStats.map((s) => (
                <tr key={s.key} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-lg ${s.badge}`}
                      >
                        {s.shortName}
                      </span>
                      <span className="font-medium text-foreground text-xs">{s.name}</span>
                    </div>
                  </td>
                  <td className="text-right px-4 py-3.5 font-medium text-foreground">
                    {s.studentCount}
                  </td>
                  <td className="text-right px-4 py-3.5 text-foreground font-medium">
                    {fmt(s.totalBilled)}
                  </td>
                  <td className="text-right px-4 py-3.5 font-semibold text-green-700">
                    {fmt(s.totalCollected)}
                  </td>
                  <td className="text-right px-4 py-3.5 text-purple-700">
                    {fmt(s.totalDiscount)}
                  </td>
                  <td className="text-right px-4 py-3.5 text-red-600 font-medium">
                    {fmt(s.totalPending)}
                  </td>
                  <td className="text-right px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-green-700 font-medium">
                      <CheckCircle2 size={12} />
                      {s.paidCount}
                    </span>
                  </td>
                  <td className="text-right px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                      <XCircle size={12} />
                      {s.overdueCount}
                    </span>
                  </td>
                  <td className="text-right px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-muted rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${s.collectionRate}%`,
                            background: s.color,
                          }}
                        />
                      </div>
                      <span
                        className="text-xs font-bold"
                        style={{ color: s.color }}
                      >
                        {s.collectionRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/50 font-semibold text-foreground border-t-2 border-border">
                <td className="px-5 py-3 text-sm font-bold">Grand Total</td>
                <td className="text-right px-4 py-3">{grandTotals.studentCount}</td>
                <td className="text-right px-4 py-3">{fmt(grandTotals.totalBilled)}</td>
                <td className="text-right px-4 py-3 text-green-700">
                  {fmt(grandTotals.totalCollected)}
                </td>
                <td className="text-right px-4 py-3 text-purple-700">
                  {fmt(grandTotals.totalDiscount)}
                </td>
                <td className="text-right px-4 py-3 text-red-600">
                  {fmt(grandTotals.totalPending)}
                </td>
                <td className="text-right px-4 py-3" colSpan={2} />
                <td className="text-right px-5 py-3 text-primary font-bold">
                  {overallCollectionRate}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Charts Row 1: Institution Comparison + Fee Status Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Institution Comparison Bar */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Building2 size={16} className="text-primary" />
            Institution-wise Revenue Comparison
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={comparisonData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Collected" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Pending" fill="#dc2626" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Discount" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fee Status Pie */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            Fee Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={feeStatusData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {feeStatusData.map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLORS[entry.name] || '#6b7280'} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [value + ' students', name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {feeStatusData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: STATUS_COLORS[d.name] }}
                />
                <span className="text-xs text-muted-foreground">{d.name}</span>
                <span className="text-xs font-semibold text-foreground ml-auto">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Course-wise Revenue + Semester Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Course-wise Revenue */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            Course-wise Revenue
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={courseRevenueData}
              layout="vertical"
              barCategoryGap="25%"
              margin={{ left: 8, right: 16 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
              />
              <YAxis
                type="category"
                dataKey="course"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={110}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="collected" name="Collected" fill="#2563eb" radius={[0, 4, 4, 0]} />
              <Bar dataKey="pending" name="Pending" fill="#f87171" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Semester Breakdown */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileCheck size={16} className="text-primary" />
            Semester-wise Fee Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={semesterData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="sem" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="collected" name="Collected" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {/* Semester summary mini-table */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {semesterData.map((d) => (
              <div
                key={d.sem}
                className="bg-muted/30 rounded-xl p-2.5 text-center"
              >
                <p className="text-xs font-bold text-foreground">{d.sem}</p>
                <p className="text-xs text-green-700 font-semibold">{fmt(d.collected)}</p>
                <p className="text-xs text-muted-foreground">{d.students} students</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Method Summary */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <CreditCard size={16} className="text-primary" />
          Payment Method Summary
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {paymentMethodData.map((d) => {
            const icons: Record<string, React.ReactNode> = {
              Cash: <Wallet size={20} />,
              Online: <CreditCard size={20} />,
              DD: <Landmark size={20} />,
              Cheque: <FileCheck size={20} />,
            };
            const pct = totalPaymentAmount > 0
              ? Math.round((d.amount / totalPaymentAmount) * 100)
              : 0;
            const color = PAYMENT_MODE_COLORS[d.mode] || '#6b7280';
            return (
              <div
                key={d.mode}
                className="border border-border rounded-2xl p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: color + '18', color }}
                  >
                    {icons[d.mode]}
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: color + '18', color }}
                  >
                    {pct}%
                  </span>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{fmt(d.amount)}</p>
                  <p className="text-xs text-muted-foreground">{d.mode}</p>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{d.count} transactions</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment mode totals row */}
        <div className="mt-4 flex flex-wrap gap-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Total Transactions:</span>
            <span className="font-semibold text-foreground">
              {paymentMethodData.reduce((s, d) => s + d.count, 0)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Total Amount:</span>
            <span className="font-semibold text-green-700">{fmt(totalPaymentAmount)}</span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Avg. per Transaction:</span>
            <span className="font-semibold text-foreground">
              {paymentMethodData.reduce((s, d) => s + d.count, 0) > 0
                ? fmt(
                    Math.round(
                      totalPaymentAmount /
                        paymentMethodData.reduce((s, d) => s + d.count, 0)
                    )
                  )
                : '₹0'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
