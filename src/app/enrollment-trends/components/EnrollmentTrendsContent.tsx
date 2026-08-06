'use client';
import React, { useState, useMemo } from 'react';
import { TrendingUp, Users, Building2, GraduationCap, BarChart3 } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLLEGES = [
  { key: 'RGP', name: 'Rajiv Gandhi Polytechnic', color: '#2563eb' },
  { key: 'ITI', name: 'Rajiv Gandhi ITI', color: '#059669' },
  { key: 'GSS', name: 'GSS Diploma College', color: '#d97706' },
];

const yearlyData = [
  { year: '2020-21', RGP: 85, ITI: 62, GSS: 28 },
  { year: '2021-22', RGP: 92, ITI: 70, GSS: 31 },
  { year: '2022-23', RGP: 108, ITI: 78, GSS: 36 },
  { year: '2023-24', RGP: 124, ITI: 89, GSS: 42 },
  { year: '2024-25', RGP: 138, ITI: 96, GSS: 48 },
  { year: '2026-27', RGP: 152, ITI: 110, GSS: 55 },
];

const courseWiseData = [
  { course: 'Civil Engg', students: 52, college: 'RGP', color: '#2563eb' },
  { course: 'Mech Engg', students: 58, college: 'RGP', color: '#2563eb' },
  { course: 'Electrical', students: 42, college: 'RGP', color: '#2563eb' },
  { course: 'Fitter', students: 40, college: 'ITI', color: '#059669' },
  { course: 'Electrician', students: 38, college: 'ITI', color: '#059669' },
  { course: 'Welder', students: 32, college: 'ITI', color: '#059669' },
  { course: 'Dip. SpEd (HI)', students: 28, college: 'GSS', color: '#d97706' },
  { course: 'Dip. SpEd (MR)', students: 27, college: 'GSS', color: '#d97706' },
];

const genderData = [
  { year: '2021-22', Male: 118, Female: 75 },
  { year: '2022-23', Male: 132, Female: 90 },
  { year: '2023-24', Male: 148, Female: 107 },
  { year: '2024-25', Male: 162, Female: 120 },
  { year: '2026-27', Male: 178, Female: 139 },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color?: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-semibold text-foreground">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function EnrollmentTrendsContent() {
  const [activeCollege, setActiveCollege] = useState<string>('All');

  const currentYear = yearlyData[yearlyData.length - 1];
  const prevYear = yearlyData[yearlyData.length - 2];

  const totalCurrent = currentYear.RGP + currentYear.ITI + currentYear.GSS;
  const totalPrev = prevYear.RGP + prevYear.ITI + prevYear.GSS;
  const growthPct = Math.round(((totalCurrent - totalPrev) / totalPrev) * 100);

  const kpis = [
    {
      label: 'Total Enrolled (2026-27)',
      value: totalCurrent,
      sub: `+${growthPct}% vs last year`,
      icon: <Users size={20} />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'RGP Enrollment',
      value: currentYear.RGP,
      sub: `+${Math.round(((currentYear.RGP - prevYear.RGP) / prevYear.RGP) * 100)}% growth`,
      icon: <Building2 size={20} />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'ITI Enrollment',
      value: currentYear.ITI,
      sub: `+${Math.round(((currentYear.ITI - prevYear.ITI) / prevYear.ITI) * 100)}% growth`,
      icon: <GraduationCap size={20} />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'GSS Enrollment',
      value: currentYear.GSS,
      sub: `+${Math.round(((currentYear.GSS - prevYear.GSS) / prevYear.GSS) * 100)}% growth`,
      icon: <BarChart3 size={20} />,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  const filteredCourseData = useMemo(() => {
    if (activeCollege === 'All') return courseWiseData;
    return courseWiseData.filter((d) => d.college === activeCollege);
  }, [activeCollege]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <TrendingUp size={20} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Year-wise Enrollment Trends</h1>
          <p className="text-sm text-muted-foreground">Growth tracking across all 3 institutions</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-9 h-9 rounded-lg ${k.bg} flex items-center justify-center mb-3`}>
              <span className={k.color}>{k.icon}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{k.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
            <p className="text-xs font-medium text-emerald-600 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Line Chart — Year-wise Trend */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Enrollment Growth (2020–2026) — All Institutions
        </h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={yearlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {COLLEGES.map((c) => (
              <Line
                key={c.key}
                type="monotone"
                dataKey={c.key}
                name={c.name}
                stroke={c.color}
                strokeWidth={2.5}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Course-wise Enrollment */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Course-wise Enrollment (2025-26)</h2>
            <div className="flex gap-1">
              {['All', 'RGP', 'ITI', 'GSS'].map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCollege(c)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    activeCollege === c
                      ? 'bg-primary text-white' :'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2.5">
            {filteredCourseData.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-28 truncate">{d.course}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(d.students / 60) * 100}%`,
                      background: d.color,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-foreground w-6 text-right">
                  {d.students}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gender-wise Trend */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Gender-wise Enrollment Trend
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={genderData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Male" name="Male" fill="#2563eb" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Female" name="Female" fill="#db2777" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Year-wise Summary Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Year-wise Summary Table</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Academic Year
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-blue-600">RGP</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-emerald-600">ITI</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-amber-600">GSS</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Total
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">
                  YoY Growth
                </th>
              </tr>
            </thead>
            <tbody>
              {yearlyData.map((row, i) => {
                const total = row.RGP + row.ITI + row.GSS;
                const prevTotal =
                  i > 0
                    ? yearlyData[i - 1].RGP + yearlyData[i - 1].ITI + yearlyData[i - 1].GSS
                    : null;
                const growth =
                  prevTotal !== null ? Math.round(((total - prevTotal) / prevTotal) * 100) : null;
                return (
                  <tr key={row.year} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{row.year}</td>
                    <td className="px-4 py-3 text-center text-blue-700 font-semibold">{row.RGP}</td>
                    <td className="px-4 py-3 text-center text-emerald-700 font-semibold">{row.ITI}</td>
                    <td className="px-4 py-3 text-center text-amber-700 font-semibold">{row.GSS}</td>
                    <td className="px-4 py-3 text-center font-bold text-foreground">{total}</td>
                    <td className="px-4 py-3 text-center">
                      {growth !== null ? (
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            growth >= 0
                              ? 'bg-emerald-100 text-emerald-700' :'bg-red-100 text-red-700'
                          }`}
                        >
                          {growth >= 0 ? '+' : ''}
                          {growth}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
