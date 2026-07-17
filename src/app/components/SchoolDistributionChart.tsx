'use client';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer,  } from 'recharts';

const data = [
  { name: 'RG Polytechnic', value: 542, color: '#1e40af' },
  { name: 'RG ITI', value: 498, color: '#f59e0b' },
  { name: 'GSS Diploma', value: 244, color: '#16a34a' },
];

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
        <p className="text-muted-foreground">
          {p.value} students
        </p>
      </div>
    );
  }
  return null;
};

export default function SchoolDistributionChart() {
  return (
    <div className="card p-5 h-full">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">
          Students by Institution
        </h3>
        <p className="text-xs text-muted-foreground">Current enrolment</p>
      </div>
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
          <div key={`legend-${d.name}`} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ background: d.color }}
              />
              <span className="text-muted-foreground">{d.name}</span>
            </span>
            <span className="font-semibold text-foreground font-tabular">
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}