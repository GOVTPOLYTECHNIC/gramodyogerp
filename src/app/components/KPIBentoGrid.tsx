import React from 'react';
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
import Icon from '@/components/ui/AppIcon';


const kpiData = [
  {
    id: 'kpi-total-students',
    label: 'Total Enrolled Students',
    value: '1,284',
    sub: 'Across all 3 institutions',
    icon: Users,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    trend: '+38 this month',
    trendUp: true,
    span: 'lg:col-span-2',
  },
  {
    id: 'kpi-fee-today',
    label: "Fee Collected Today",
    value: '₹1,24,500',
    sub: '17 Jul 2026',
    icon: IndianRupee,
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    trend: '+₹18,000 vs yesterday',
    trendUp: true,
    span: '',
  },
  {
    id: 'kpi-pending-dues',
    label: 'Pending Fee Dues',
    value: '₹8,46,000',
    sub: '142 students with dues',
    icon: AlertCircle,
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    trend: '14 overdue >90 days',
    trendUp: false,
    span: '',
  },
  {
    id: 'kpi-attendance',
    label: "Today\'s Staff Attendance",
    value: '94%',
    sub: '32 / 34 staff present',
    icon: CalendarCheck,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    trend: '2 on leave',
    trendUp: true,
    span: '',
  },
  {
    id: 'kpi-admissions',
    label: 'New Admissions (Jul)',
    value: '38',
    sub: 'Current month intake',
    icon: TrendingUp,
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    trend: 'Target: 60',
    trendUp: true,
    span: '',
  },
  {
    id: 'kpi-receipts',
    label: 'Receipts Generated',
    value: '217',
    sub: 'This month',
    icon: GraduationCap,
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    trend: 'RGP: 98 · ITI: 79 · GSS: 40',
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
    value: '14',
    sub: 'Students >90 days overdue',
    icon: Clock,
    color: 'text-red-700',
    bg: 'bg-red-100',
    border: 'border-red-300',
    trend: 'Requires immediate action',
    trendUp: false,
    span: '',
  },
];

export default function KPIBentoGrid() {
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
                    ? 'bg-green-50 text-green-700' :'bg-red-50 text-red-700'
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