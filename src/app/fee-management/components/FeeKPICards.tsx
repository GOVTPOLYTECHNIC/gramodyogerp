'use client';
import React from 'react';
import { IndianRupee, AlertCircle, Receipt, Tag } from 'lucide-react';
import { FeeRecord } from './feeData';
import Icon from '@/components/ui/AppIcon';


interface FeeKPICardsProps {
  records: FeeRecord[];
}

export default function FeeKPICards({ records }: FeeKPICardsProps) {
  const todayRecords = records.filter((r) => r.paymentDate === '17/07/2026');
  const collectedToday = todayRecords.reduce((sum, r) => sum + r.paidAmount, 0);

  const totalPending = records.reduce((sum, r) => {
    const netFee = r.annualFee - r.discount;
    const balance = netFee - r.paidAmount;
    return sum + (balance > 0 ? balance : 0);
  }, 0);

  const receiptsGenerated = records.filter((r) => r.paidAmount > 0).length;

  const totalDiscount = records.reduce((sum, r) => sum + r.discount, 0);

  const kpis = [
    {
      id: 'kpi-fee-today',
      label: 'Fee Collected Today',
      value: `₹${collectedToday.toLocaleString('en-IN')}`,
      sub: `${todayRecords.length} transactions on 17 Jul 2026`,
      icon: IndianRupee,
      color: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
    {
      id: 'kpi-pending-dues',
      label: 'Total Pending Dues',
      value: `₹${totalPending.toLocaleString('en-IN')}`,
      sub: `${records.filter((r) => r.status !== 'Paid').length} students with outstanding balance`,
      icon: AlertCircle,
      color: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-300',
    },
    {
      id: 'kpi-receipts',
      label: 'Receipts Generated',
      value: String(receiptsGenerated),
      sub: 'This academic year',
      icon: Receipt,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    {
      id: 'kpi-discount',
      label: 'Total Discount Given',
      value: `₹${totalDiscount.toLocaleString('en-IN')}`,
      sub: `Across ${records.filter((r) => r.discount > 0).length} students`,
      icon: Tag,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            className={`card p-4 border ${kpi.border} hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={kpi.color} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {kpi.label}
                </p>
                <p className={`text-xl font-bold font-tabular mt-0.5 ${kpi.color}`}>
                  {kpi.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{kpi.sub}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}