'use client';
import React from 'react';
import { X, Printer, Building2 } from 'lucide-react';
import { StaffMember, computePayroll } from './payrollData';

interface SalarySlipModalProps {
  staff: StaffMember;
  month: string;
  year: string;
  onClose: () => void;
}

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function SalarySlipModal({ staff, month, year, onClose }: SalarySlipModalProps) {
  const { gross, deductions, net } = computePayroll(staff);

  const earnings = [
    { label: 'Basic Salary', amount: staff.basicSalary },
    { label: 'House Rent Allowance (HRA)', amount: staff.hra },
    { label: 'Travel Allowance (TA)', amount: staff.ta },
    { label: 'Dearness Allowance (DA)', amount: staff.da },
  ];

  const deductionItems = [
    { label: 'Provident Fund (PF)', amount: staff.pf },
    { label: 'TDS (Income Tax)', amount: staff.tds },
    { label: 'Other Deductions', amount: staff.otherDeductions },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-800">Salary Slip</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              <Printer size={13} />
              Print
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Slip Content */}
        <div className="p-6 space-y-5" id="salary-slip-print">
          {/* Institution Header */}
          <div className="text-center border-b border-gray-200 pb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Building2 size={20} className="text-primary" />
              <span className="text-base font-bold text-gray-800">GramodyogERP</span>
            </div>
            <p className="text-sm font-semibold text-gray-700">{staff.college}</p>
            <p className="text-xs text-gray-500 mt-0.5">Salary Slip for {month} {year}</p>
          </div>

          {/* Employee Details */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {[
              ['Employee ID', staff.empId],
              ['Employee Name', staff.name],
              ['Department', staff.department],
              ['Designation', staff.role],
              ['Date of Joining', staff.joiningDate],
              ['Bank Account', staff.bankAccount],
              ['IFSC Code', staff.ifsc],
              ['Pay Period', `${month} ${year}`],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-2">
                <span className="text-gray-500 min-w-[120px]">{label}:</span>
                <span className="font-medium text-gray-800">{value}</span>
              </div>
            ))}
          </div>

          {/* Earnings & Deductions */}
          <div className="grid grid-cols-2 gap-4">
            {/* Earnings */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-emerald-50 px-4 py-2 border-b border-gray-200">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Earnings</p>
              </div>
              <div className="divide-y divide-gray-100">
                {earnings.map((e) => (
                  <div key={e.label} className="flex justify-between px-4 py-2 text-sm">
                    <span className="text-gray-600">{e.label}</span>
                    <span className="font-medium text-gray-800">{fmt(e.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between px-4 py-2.5 bg-emerald-50">
                  <span className="text-sm font-bold text-emerald-700">Gross Salary</span>
                  <span className="text-sm font-bold text-emerald-700">{fmt(gross)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-red-50 px-4 py-2 border-b border-gray-200">
                <p className="text-xs font-bold text-red-700 uppercase tracking-wide">Deductions</p>
              </div>
              <div className="divide-y divide-gray-100">
                {deductionItems.map((d) => (
                  <div key={d.label} className="flex justify-between px-4 py-2 text-sm">
                    <span className="text-gray-600">{d.label}</span>
                    <span className="font-medium text-gray-800">{fmt(d.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between px-4 py-2.5 bg-red-50">
                  <span className="text-sm font-bold text-red-700">Total Deductions</span>
                  <span className="text-sm font-bold text-red-700">{fmt(deductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-primary font-medium">Net Salary (Take Home)</p>
              <p className="text-2xl font-bold text-primary">{fmt(net)}</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>Gross: {fmt(gross)}</p>
              <p>Deductions: {fmt(deductions)}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
            <span>This is a computer-generated salary slip.</span>
            <span>GramodyogERP — {staff.college}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
