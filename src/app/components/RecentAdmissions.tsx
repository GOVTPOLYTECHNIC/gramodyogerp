'use client';
import React, { useEffect, useState } from 'react';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { getStudents } from '@/lib/studentStore';
import { Student } from '@/app/student-management/components/studentData';

const SCHOOL_SHORT: Record<string, string> = {
  'Rajiv Gandhi Polytechnic': 'RG Polytechnic',
  'Rajiv Gandhi ITI': 'RG ITI',
  'GSS Diploma College': 'GSS Diploma',
};

const feeStatusVariant = (s: string) => {
  if (s === 'Paid') return 'success';
  if (s === 'Partial') return 'warning';
  return 'danger';
};

export default function RecentAdmissions() {
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);

  useEffect(() => {
    const students = getStudents();
    // Sort by admissionYear desc, then take last 5 (most recently added = highest index)
    const sorted = [...students].reverse().slice(0, 5);
    setRecentStudents(sorted);
  }, []);

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
        {recentStudents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No students enrolled yet. Add students from Student Management.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="table-th">Roll No</th>
                <th className="table-th">Name</th>
                <th className="table-th">Institution</th>
                <th className="table-th">Course</th>
                <th className="table-th">Year</th>
                <th className="table-th">Fee Status</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((s) => (
                <tr key={s.id} className="table-row">
                  <td className="table-td font-mono text-xs text-muted-foreground">
                    {s.rollNo}
                  </td>
                  <td className="table-td font-medium">{s.name}</td>
                  <td className="table-td text-muted-foreground">
                    {SCHOOL_SHORT[s.school] || s.school}
                  </td>
                  <td className="table-td text-muted-foreground max-w-[180px] truncate">
                    {s.course}
                  </td>
                  <td className="table-td text-muted-foreground">{s.admissionYear}</td>
                  <td className="table-td">
                    <Badge
                      variant={
                        feeStatusVariant(s.feeStatus) as 'success' | 'warning' | 'danger'
                      }
                    >
                      {s.feeStatus}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}