'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Users, IndianRupee, AlertCircle, Tag, Building2, CheckCircle2, Clock, XCircle,  } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,  } from 'recharts';
import { getStudents, getFeeRecords } from '@/lib/studentStore';
import { Student } from '@/app/student-management/components/studentData';
import { FeeRecord } from '@/app/fee-management/components/feeData';

type CollegeKey = 'RGP' | 'ITI' | 'GSS';

const COLLEGES = [
  {
    key: 'RGP' as CollegeKey,
    name: 'Rajiv Gandhi Polytechnic',
    shortName: 'RGP',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    activeBg: 'bg-blue-600',
    accentColor: '#2563eb',
    courses: ['Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering'],
    annualFee: { regular: 20000, lateral: 25000 },
    semesters: 6,
    duration: '3 Years',
  },
  {
    key: 'ITI' as CollegeKey,
    name: 'Rajiv Gandhi ITI',
    shortName: 'ITI',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    activeBg: 'bg-emerald-600',
    accentColor: '#059669',
    courses: ['Fitter', 'Electrician', 'Welder'],
    annualFee: { regular: 15000, lateral: 15000 },
    semesters: 4,
    duration: '2 Years',
  },
  {
    key: 'GSS' as CollegeKey,
    name: 'Gramodyog Sewa Sansthan',
    shortName: 'GSS',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    activeBg: 'bg-amber-600',
    accentColor: '#d97706',
    courses: ['Diploma in Special Education (HI)', 'Diploma in Special Education (MR)'],
    annualFee: { regular: 40000, lateral: 40000 },
    semesters: 4,
    duration: '2 Years',
  },
];

const SCHOOL_MAP: Record<CollegeKey, string> = {
  RGP: 'Rajiv Gandhi Polytechnic',
  ITI: 'Rajiv Gandhi ITI',
  GSS: 'GSS Diploma College',
};

const MONTHLY_DATA: Record<CollegeKey, { month: string; collected: number; target: number }[]> = {
  RGP: [
    { month: 'Feb', collected: 60000, target: 80000 },
    { month: 'Mar', collected: 85000, target: 80000 },
    { month: 'Apr', collected: 72000, target: 90000 },
    { month: 'May', collected: 95000, target: 90000 },
    { month: 'Jun', collected: 78000, target: 95000 },
    { month: 'Jul', collected: 52000, target: 95000 },
  ],
  ITI: [
    { month: 'Feb', collected: 45000, target: 60000 },
    { month: 'Mar', collected: 68000, target: 60000 },
    { month: 'Apr', collected: 55000, target: 65000 },
    { month: 'May', collected: 72000, target: 65000 },
    { month: 'Jun', collected: 61000, target: 70000 },
    { month: 'Jul', collected: 38000, target: 70000 },
  ],
  GSS: [
    { month: 'Feb', collected: 80000, target: 120000 },
    { month: 'Mar', collected: 120000, target: 120000 },
    { month: 'Apr', collected: 95000, target: 130000 },
    { month: 'May', collected: 140000, target: 130000 },
    { month: 'Jun', collected: 110000, target: 140000 },
    { month: 'Jul', collected: 72000, target: 140000 },
  ],
};

const STATUS_COLORS: Record<string, string> = {
  Paid: '#16a34a',
  Partial: '#d97706',
  Pending: '#6b7280',
  Overdue: '#dc2626',
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-foreground mb-1">{label} 2026</p>
        {payload.map((p, i) => (
          <div key={`tt-${i}`} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground capitalize">{p.name}:</span>
            <span className="font-semibold text-foreground">₹{(p.value / 1000).toFixed(0)}K</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const BarTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; fill: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((p, i) => (
          <div key={`bt-${i}`} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-semibold text-foreground">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function CollegeDashboardContent() {
  const [activeCollege, setActiveCollege] = useState<CollegeKey>('RGP');
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allFeeRecords, setAllFeeRecords] = useState<FeeRecord[]>([]);

  useEffect(() => {
    setAllStudents(getStudents());
    setAllFeeRecords(getFeeRecords());
  }, []);

  const college = COLLEGES.find((c) => c.key === activeCollege)!;
  const schoolName = SCHOOL_MAP[activeCollege];

  const students = useMemo(
    () => allStudents.filter((s) => s.school === schoolName),
    [allStudents, schoolName]
  );

  const feeRecords = useMemo(
    () => allFeeRecords.filter((f) => f.school === schoolName),
    [allFeeRecords, schoolName]
  );

  // KPI calculations
  const totalStudents = students.length;
  const totalRevenue = feeRecords.reduce((sum, f) => sum + f.paidAmount, 0);

  // Compute actual paid per student from fee records (not stale s.paidFees)
  const paidByStudent = useMemo(() => {
    const map: Record<string, number> = {};
    feeRecords.forEach((f) => {
      map[f.studentId] = (map[f.studentId] || 0) + f.paidAmount;
    });
    return map;
  }, [feeRecords]);

  const totalDues = students.reduce((sum, s) => {
    const actualPaid = paidByStudent[s.id] || 0;
    return sum + Math.max(0, s.totalFees - actualPaid);
  }, 0);

  const totalDiscount = feeRecords.reduce((sum, f) => sum + f.discount, 0);
  const newThisMonth = students.filter((s) => s.admissionYear === '2026').length;

  // Fee status breakdown
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { Paid: 0, Partial: 0, Pending: 0, Overdue: 0 };
    students.forEach((s) => {
      counts[s.feeStatus] = (counts[s.feeStatus] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [students]);

  // Course-wise enrollment
  const courseEnrollment = useMemo(() => {
    const map: Record<string, number> = {};
    students.forEach((s) => {
      map[s.course] = (map[s.course] || 0) + 1;
    });
    return Object.entries(map).map(([course, count]) => ({ course, count }));
  }, [students]);

  // Semester-wise enrollment
  const semesterEnrollment = useMemo(() => {
    const map: Record<number, number> = {};
    students.forEach((s) => {
      map[s.semester] = (map[s.semester] || 0) + 1;
    });
    return Object.entries(map)
      .map(([sem, count]) => ({ semester: `Sem ${sem}`, count }))
      .sort((a, b) => parseInt(a.semester.split(' ')[1]) - parseInt(b.semester.split(' ')[1]));
  }, [students]);

  const monthlyData = MONTHLY_DATA[activeCollege];
  const totalCollectedAllMonths = monthlyData.reduce((s, d) => s + d.collected, 0);

  const kpis = [
    {
      id: 'kpi-students',
      label: 'Total Enrolled',
      value: totalStudents.toString(),
      sub: `${newThisMonth} new this month`,
      icon: Users,
      color: college.color,
      bg: college.bg,
      border: college.border,
      trend: `+${newThisMonth} Jul 2026`,
      trendUp: true,
    },
    {
      id: 'kpi-revenue',
      label: 'Total Fee Collected',
      value: `₹${(totalRevenue / 1000).toFixed(0)}K`,
      sub: 'Current academic year',
      icon: IndianRupee,
      color: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-200',
      trend: `₹${(totalCollectedAllMonths / 1000).toFixed(0)}K (6 months)`,
      trendUp: true,
    },
    {
      id: 'kpi-dues',
      label: 'Pending Dues',
      value: `₹${(totalDues / 1000).toFixed(0)}K`,
      sub: `${students.filter((s) => s.feeStatus !== 'Paid').length} students with dues`,
      icon: AlertCircle,
      color: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
      trend: `${students.filter((s) => s.feeStatus === 'Overdue').length} overdue`,
      trendUp: false,
    },
    {
      id: 'kpi-discount',
      label: 'Discount Given',
      value: `₹${(totalDiscount / 1000).toFixed(1)}K`,
      sub: `${feeRecords.filter((f) => f.discount > 0).length} students benefited`,
      icon: Tag,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      trend: 'Scholarships & merit',
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">College-wise Dashboards</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gramodyog Sewa Sansthan — Academic Year 2025–26
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-lg px-3 py-2">
          <Building2 size={13} className="text-primary" />
          <span>3 Institutions</span>
        </div>
      </div>

      {/* College Tabs */}
      <div className="flex gap-2 flex-wrap">
        {COLLEGES.map((c) => (
          <button
            key={c.key}
            onClick={() => setActiveCollege(c.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
              activeCollege === c.key
                ? `${c.activeBg} text-white border-transparent shadow-md`
                : `bg-card ${c.color} ${c.border} hover:shadow-sm`
            }`}
          >
            <Building2 size={15} />
            <span>{c.shortName}</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                activeCollege === c.key
                  ? 'bg-white/20 text-white'
                  : `${c.bg} ${c.color}`
              }`}
            >
              {c.duration}
            </span>
          </button>
        ))}
      </div>

      {/* College Info Banner */}
      <div className={`card border ${college.border} ${college.bg} p-4 flex flex-wrap items-center gap-4`}>
        <div className={`w-10 h-10 rounded-xl ${college.activeBg} flex items-center justify-center text-white font-bold text-sm`}>
          {college.shortName}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className={`font-bold text-base ${college.color}`}>{college.name}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {college.duration} · {college.semesters} Semesters · Annual Fee: ₹{college.annualFee.regular.toLocaleString('en-IN')}
            {college.annualFee.lateral !== college.annualFee.regular &&
              ` (Regular) / ₹${college.annualFee.lateral.toLocaleString('en-IN')} (Lateral)`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {college.courses.map((course) => (
            <span
              key={course}
              className={`text-xs px-2.5 py-1 rounded-full border ${college.border} ${college.bg} ${college.color} font-medium`}
            >
              {course}
            </span>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const KpiIcon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className={`card p-4 border ${kpi.border} flex flex-col gap-3 hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                  <KpiIcon size={18} className={kpi.color} />
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    kpi.trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {kpi.trend}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {kpi.label}
                </p>
                <p className={`text-2xl font-bold font-tabular mt-0.5 ${kpi.color}`}>
                  {kpi.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Fee Collection Trend */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Monthly Fee Collection Trend</h3>
              <p className="text-xs text-muted-foreground">Feb – Jul 2026 · {college.name}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 inline-block rounded" style={{ background: college.accentColor }} />
                Collected
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-gray-400 inline-block rounded border-dashed" />
                Target
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradCollege-${activeCollege}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={college.accentColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={college.accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${v / 1000}K`} width={52} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="target" stroke="#9ca3af" strokeWidth={1.5} fill="none" strokeDasharray="4 2" name="target" />
              <Area type="monotone" dataKey="collected" stroke={college.accentColor} strokeWidth={2} fill={`url(#gradCollege-${activeCollege})`} name="collected" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Fee Status Pie */}
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Fee Status Breakdown</h3>
            <p className="text-xs text-muted-foreground">{totalStudents} students</p>
          </div>
          {totalStudents > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={statusCounts.filter((s) => s.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusCounts
                      .filter((s) => s.value > 0)
                      .map((entry) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#6b7280'} />
                      ))}
                  </Pie>
                  <Tooltip formatter={(value: number, name: string) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {statusCounts.map((s) => (
                  <div key={s.name} className="flex items-center gap-1.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: STATUS_COLORS[s.name] }} />
                    <span className="text-muted-foreground">{s.name}</span>
                    <span className="font-semibold text-foreground ml-auto">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-xs">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Course-wise Enrollment */}
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Course-wise Enrollment</h3>
            <p className="text-xs text-muted-foreground">{college.name}</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={courseEnrollment} margin={{ top: 4, right: 4, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="course"
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                angle={-20}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="count" name="Students" fill={college.accentColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Semester-wise Enrollment */}
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground">Semester-wise Enrollment</h3>
            <p className="text-xs text-muted-foreground">{college.semesters} semesters · {college.duration}</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={semesterEnrollment} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="semester" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="count" name="Students" fill={college.accentColor} radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student Fee Summary Table */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Student Fee Summary</h3>
            <p className="text-xs text-muted-foreground">{college.name} · {totalStudents} students</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-green-700">
              <CheckCircle2 size={12} /> {students.filter((s) => s.feeStatus === 'Paid').length} Paid
            </span>
            <span className="flex items-center gap-1 text-amber-600">
              <Clock size={12} /> {students.filter((s) => s.feeStatus === 'Partial').length} Partial
            </span>
            <span className="flex items-center gap-1 text-red-600">
              <XCircle size={12} /> {students.filter((s) => s.feeStatus === 'Overdue').length} Overdue
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-semibold uppercase tracking-wide">Roll No</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-semibold uppercase tracking-wide">Name</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-semibold uppercase tracking-wide">Course</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-semibold uppercase tracking-wide">Sem</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-semibold uppercase tracking-wide">Total Fee</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-semibold uppercase tracking-wide">Paid</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-semibold uppercase tracking-wide">Due</th>
                <th className="text-center py-2 px-3 text-muted-foreground font-semibold uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-muted-foreground">
                    No students found for this institution
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const due = student.totalFees - student.paidFees;
                  const statusStyle: Record<string, string> = {
                    Paid: 'bg-green-50 text-green-700 border-green-200',
                    Partial: 'bg-amber-50 text-amber-700 border-amber-200',
                    Pending: 'bg-gray-100 text-gray-600 border-gray-200',
                    Overdue: 'bg-red-50 text-red-700 border-red-200',
                  };
                  return (
                    <tr key={student.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-foreground font-medium">{student.rollNo}</td>
                      <td className="py-2.5 px-3 text-foreground font-medium">{student.name}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{student.course}</td>
                      <td className="py-2.5 px-3 text-center text-muted-foreground">{student.semester}</td>
                      <td className="py-2.5 px-3 text-right font-tabular text-foreground">₹{student.totalFees.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-right font-tabular text-green-700">₹{student.paidFees.toLocaleString('en-IN')}</td>
                      <td className={`py-2.5 px-3 text-right font-tabular font-semibold ${due > 0 ? 'text-red-600' : 'text-green-700'}`}>
                        {due > 0 ? `₹${due.toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${statusStyle[student.feeStatus] || ''}`}>
                          {student.feeStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {students.length > 0 && (
              <tfoot>
                <tr className={`border-t-2 ${college.border} ${college.bg}`}>
                  <td colSpan={4} className={`py-2.5 px-3 font-bold text-xs ${college.color}`}>
                    TOTAL ({totalStudents} students)
                  </td>
                  <td className={`py-2.5 px-3 text-right font-bold font-tabular ${college.color}`}>
                    ₹{students.reduce((s, st) => s + st.totalFees, 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold font-tabular text-green-700">
                    ₹{students.reduce((s, st) => s + st.paidFees, 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold font-tabular text-red-600">
                    ₹{students.reduce((s, st) => s + (st.totalFees - st.paidFees), 0).toLocaleString('en-IN')}
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Monthly Revenue Summary */}
      <div className="card p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">Monthly Revenue Summary</h3>
          <p className="text-xs text-muted-foreground">{college.name} · Feb – Jul 2026</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {monthlyData.map((m) => {
            const pct = Math.min(100, Math.round((m.collected / m.target) * 100));
            const isAbove = m.collected >= m.target;
            return (
              <div key={m.month} className={`rounded-xl border p-3 text-center ${isAbove ? `${college.bg} ${college.border}` : 'bg-muted/30 border-border'}`}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{m.month} 2026</p>
                <p className={`text-lg font-bold font-tabular mt-1 ${isAbove ? college.color : 'text-foreground'}`}>
                  ₹{(m.collected / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-muted-foreground">of ₹{(m.target / 1000).toFixed(0)}K</p>
                <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: college.accentColor }}
                  />
                </div>
                <p className={`text-xs font-semibold mt-1 ${isAbove ? 'text-green-700' : 'text-amber-600'}`}>{pct}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
