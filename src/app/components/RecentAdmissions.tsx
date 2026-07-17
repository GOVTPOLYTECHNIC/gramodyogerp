import React from 'react';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

const recentAdmissions = [
  {
    id: 'std-1001',
    name: 'Priya Sharma',
    rollNo: 'RGP-2026-041',
    school: 'RG Polytechnic',
    course: 'Civil Engineering',
    date: '17 Jul 2026',
    feeStatus: 'Paid',
  },
  {
    id: 'std-1002',
    name: 'Rahul Verma',
    rollNo: 'ITI-2026-089',
    school: 'RG ITI',
    course: 'Electrician',
    date: '16 Jul 2026',
    feeStatus: 'Pending',
  },
  {
    id: 'std-1003',
    name: 'Sunita Devi',
    rollNo: 'GSS-2026-022',
    school: 'GSS Diploma',
    course: 'Diploma in Special Education (HI)',
    date: '16 Jul 2026',
    feeStatus: 'Partial',
  },
  {
    id: 'std-1004',
    name: 'Aakash Patel',
    rollNo: 'RGP-2026-040',
    school: 'RG Polytechnic',
    course: 'Mechanical Engineering',
    date: '15 Jul 2026',
    feeStatus: 'Paid',
  },
  {
    id: 'std-1005',
    name: 'Kavita Singh',
    rollNo: 'ITI-2026-088',
    school: 'RG ITI',
    course: 'Fitter',
    date: '15 Jul 2026',
    feeStatus: 'Pending',
  },
];

const feeStatusVariant = (s: string) => {
  if (s === 'Paid') return 'success';
  if (s === 'Partial') return 'warning';
  return 'danger';
};

export default function RecentAdmissions() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Recent Admissions
          </h3>
          <p className="text-xs text-muted-foreground">Latest 5 enrollments</p>
        </div>
        <Link
          href="/student-management"
          className="text-xs font-semibold text-primary hover:underline"
        >
          View All Students →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="table-th">Roll No</th>
              <th className="table-th">Name</th>
              <th className="table-th">Institution</th>
              <th className="table-th">Course</th>
              <th className="table-th">Admitted On</th>
              <th className="table-th">Fee Status</th>
            </tr>
          </thead>
          <tbody>
            {recentAdmissions.map((s) => (
              <tr key={s.id} className="table-row">
                <td className="table-td font-mono text-xs text-muted-foreground">
                  {s.rollNo}
                </td>
                <td className="table-td font-medium">{s.name}</td>
                <td className="table-td text-muted-foreground">{s.school}</td>
                <td className="table-td text-muted-foreground max-w-[180px] truncate">
                  {s.course}
                </td>
                <td className="table-td text-muted-foreground">{s.date}</td>
                <td className="table-td">
                  <Badge variant={feeStatusVariant(s.feeStatus) as 'success' | 'warning' | 'danger'}>
                    {s.feeStatus}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}