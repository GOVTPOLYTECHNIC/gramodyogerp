'use client';
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getStudents } from '@/lib/studentStore';

const SCHOOL_COLORS: Record<string, string> = {
  'Rajiv Gandhi Polytechnic': '#1e40af',
  'Rajiv Gandhi ITI': '#f59e0b',
  'GSS Diploma College': '#16a34a',
};

const SCHOOL_SHORT: Record<string, string> = {
  'Rajiv Gandhi Polytechnic': 'RG Polytechnic',
  'Rajiv Gandhi ITI': 'RG ITI',
  'GSS Diploma College': 'GSS Diploma',
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) => {
  if (active && payload && payload.length) {
    const p = payload[0];
    return (
      <div className="bg-card border border-border rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-foreground">{p.name}</p>
        <p className="text-muted-foreground">{p.value} students</p>
      </div>
    );
  }
  return null;
};

export default function SchoolDistributionChart() {
  const [data, setData] = useState<{ name: string; value: number; color: string }[]>([]);

  useEffect(() => {
    const students = getStudents();
    const schoolMap: Record<string, number> = {};
    students.forEach((s) => {
      schoolMap[s.school] = (schoolMap[s.school] || 0) + 1;
    });
    const chartData = Object.entries(schoolMap).map(([school, count]) => ({
      name: SCHOOL_SHORT[school] || school,
      value: count,
      color: SCHOOL_COLORS[school] || '#6b7280',
    }));
    setData(chartData);
  }, []);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="card p-5 h-full">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">Students by Institution</h3>
        <p className="text-xs text-muted-foreground">
          {total > 0 ? `${total} total enrolled` : 'No students enrolled yet'}
        </p>
      </div>
      {total === 0 ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground text-xs">
          Add students to see distribution
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {data.map((d) => (
              <div
                key={`legend-${d.name}`}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ background: d.color }}
                  />
                  <span className="text-muted-foreground">{d.name}</span>
                </span>
                <span className="font-semibold text-foreground font-tabular">{d.value}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}