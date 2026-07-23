'use client';
import React, { useEffect, useState } from 'react';
import {
  Users,
  IndianRupee,
  AlertCircle,
  CalendarCheck,
  TrendingUp,
  GraduationCap,
  Building2,
  Clock,
} from 'lucide-react';
import { studentService, feeService } from '@/lib/supabase/services';
import Icon from '@/components/ui/AppIcon';


export default function KPIBentoGrid() {
  const [kpiData, setKpiData] = useState<
    {
      id: string;
      label: string;
      value: string;
      sub: string;
      icon: React.ElementType;
      color: string;
      bg: string;
      border: string;
      trend: string;
      trendUp: boolean;
      span: string;
    }[]
  >([]);

  useEffect(() => {
    async function loadData() {
      const [students, feeRecords] = await Promise.all([
        studentService.getAll(),
        feeService.getAll(),
      ]);

      const totalStudents = students.length;
      const rgpCount = students.filter((s) => s.school === 'Rajiv Gandhi Polytechnic').length;
      const itiCount = students.filter((s) => s.school === 'Rajiv Gandhi ITI').length;
      const gssCount = students.filter((s) => s.school === 'GSS Diploma College').length;

      const totalCollected = feeRecords.reduce((sum, r) => sum + r.paidAmount, 0);

      const totalPending = students.reduce(
        (sum, s) => sum + Math.max(0, s.totalFees - s.paidFees),
        0
      );
      const studentsWithDues = students.filter((s) => s.feeStatus !== 'Paid').length;
      const overdueStudents = students.filter((s) => s.feeStatus === 'Overdue').length;

      const currentYear = new Date().getFullYear().toString();
      const newAdmissions = students.filter((s) => s.admissionYear === currentYear).length;

      const receiptsGenerated = feeRecords.filter((r) => r.paidAmount > 0).length;
      const rgpReceipts = feeRecords.filter(
        (r) => r.school === 'Rajiv Gandhi Polytechnic' && r.paidAmount > 0
      ).length;
      const itiReceipts = feeRecords.filter(
        (r) => r.school === 'Rajiv Gandhi ITI' && r.paidAmount > 0
      ).length;
      const gssReceipts = feeRecords.filter(
        (r) => r.school === 'GSS Diploma College' && r.paidAmount > 0
      ).length;

      const fmt = (n: number) =>
        n >= 100000
          ? `₹${(n / 100000).toFixed(2)}L`
          : n >= 1000
          ? `₹${(n / 1000).toFixed(1)}K`
          : `₹${n}`;

      setKpiData([
        {
          id: 'kpi-total-students',
          label: 'Total Enrolled Students',
          value: totalStudents.toString(),
          sub: `RGP: ${rgpCount} · ITI: ${itiCount} · GSS: ${gssCount}`,
          icon: Users,
          color: 'text-blue-700',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          trend: `${newAdmissions} new this year`,
          trendUp: true,
          span: 'lg:col-span-2',
        },
        {
          id: 'kpi-fee-collected',
          label: 'Total Fee Collected',
          value: fmt(totalCollected),
          sub: 'All time collected',
          icon: IndianRupee,
          color: 'text-green-700',
          bg: 'bg-green-50',
          border: 'border-green-200',
          trend: `${receiptsGenerated} receipts`,
          trendUp: true,
          span: '',
        },
        {
          id: 'kpi-pending-dues',
          label: 'Pending Fee Dues',
          value: fmt(totalPending),
          sub: `${studentsWithDues} students with dues`,
          icon: AlertCircle,
          color: 'text-red-700',
          bg: 'bg-red-50',
          border: 'border-red-200',
          trend: `${overdueStudents} overdue`,
          trendUp: false,
          span: '',
        },
        {
          id: 'kpi-attendance',
          label: "Today's Staff Attendance",
          value: '—',
          sub: 'Mark attendance to update',
          icon: CalendarCheck,
          color: 'text-amber-700',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          trend: 'Go to Staff Attendance',
          trendUp: true,
          span: '',
        },
        {
          id: 'kpi-admissions',
          label: `New Admissions (${currentYear})`,
          value: newAdmissions.toString(),
          sub: 'Current year intake',
          icon: TrendingUp,
          color: 'text-purple-700',
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          trend: `${totalStudents} total enrolled`,
          trendUp: newAdmissions > 0,
          span: '',
        },
        {
          id: 'kpi-receipts',
          label: 'Receipts Generated',
          value: receiptsGenerated.toString(),
          sub: 'Total fee receipts',
          icon: GraduationCap,
          color: 'text-teal-700',
          bg: 'bg-teal-50',
          border: 'border-teal-200',
          trend: `RGP: ${rgpReceipts} · ITI: ${itiReceipts} · GSS: ${gssReceipts}`,
          trendUp: true,
          span: '',
        },
        {
          id: 'kpi-schools',
          label: 'Active Institutions',
          value: '3',
          sub: 'RGP · ITI · GSS',
          icon: Building2,
          color: 'text-indigo-700',
          bg: 'bg-indigo-50',
          border: 'border-indigo-200',
          trend: 'All operational',
          trendUp: true,
          span: '',
        },
        {
          id: 'kpi-overdue',
          label: 'Overdue Fees Alert',
          value: overdueStudents.toString(),
          sub: 'Students with overdue fees',
          icon: Clock,
          color: 'text-red-700',
          bg: 'bg-red-100',
          border: 'border-red-300',
          trend: overdueStudents > 0 ? 'Requires immediate action' : 'No overdue fees',
          trendUp: false,
          span: '',
        },
      ]);
    }

    loadData();
  }, []);

  if (kpiData.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card p-4 border border-border animate-pulse h-28" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {kpiData?.map((kpi) => {
        const Icon = kpi?.icon;
        return (
          <div
            key={kpi?.id}
            className={`card p-4 border ${kpi?.border} ${kpi?.span} flex flex-col gap-3 hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-9 h-9 rounded-lg ${kpi?.bg} flex items-center justify-center`}>
                <Icon size={18} className={kpi?.color} />
              </div>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  kpi?.trendUp
                    ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {kpi?.trend}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {kpi?.label}
              </p>
              <p className={`text-2xl font-bold font-tabular mt-0.5 ${kpi?.color}`}>
                {kpi?.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi?.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}