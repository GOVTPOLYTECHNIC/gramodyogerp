'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { FileText, Download, Eye, GraduationCap, IndianRupee, Users, BarChart2 } from 'lucide-react';

const reports = [
  {
    id: 1,
    title: 'Student Enrollment Report',
    description: 'Total enrolled students by school, course, and semester',
    icon: <GraduationCap size={20} className="text-primary" />,
    category: 'Academic',
    lastGenerated: '15 Jul 2025',
  },
  {
    id: 2,
    title: 'Fee Collection Report',
    description: 'Monthly fee collection summary with defaulter details',
    icon: <IndianRupee size={20} className="text-green-600" />,
    category: 'Finance',
    lastGenerated: '14 Jul 2025',
  },
  {
    id: 3,
    title: 'Staff Attendance Report',
    description: 'Monthly staff attendance with present/absent/late breakdown',
    icon: <Users size={20} className="text-blue-600" />,
    category: 'HR',
    lastGenerated: '13 Jul 2025',
  },
  {
    id: 4,
    title: 'Defaulter List Report',
    description: 'Students with pending fee dues above threshold',
    icon: <FileText size={20} className="text-red-600" />,
    category: 'Finance',
    lastGenerated: '12 Jul 2025',
  },
  {
    id: 5,
    title: 'Payroll Summary Report',
    description: 'Monthly staff salary disbursement and deductions',
    icon: <BarChart2 size={20} className="text-purple-600" />,
    category: 'HR',
    lastGenerated: '10 Jul 2025',
  },
  {
    id: 6,
    title: 'Annual Progress Report',
    description: 'Year-wise enrollment, fee, and academic performance trends',
    icon: <BarChart2 size={20} className="text-orange-600" />,
    category: 'Academic',
    lastGenerated: '01 Jul 2025',
  },
];

const categoryColors: Record<string, string> = {
  Academic: 'bg-primary/10 text-primary',
  Finance: 'bg-green-100 text-green-700',
  HR: 'bg-blue-100 text-blue-700',
};

export default function ReportsPage() {
  return (
    <AppLayout title="Reports">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Generate and download institutional reports
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <div key={report.id} className="card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  {report.icon}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[report.category] || 'bg-secondary text-muted-foreground'}`}>
                  {report.category}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{report.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <p className="text-xs text-muted-foreground">Last: {report.lastGenerated}</p>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded-lg border border-border hover:bg-secondary transition-colors" title="Preview">
                    <Eye size={14} className="text-muted-foreground" />
                  </button>
                  <button className="p-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors" title="Download">
                    <Download size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
