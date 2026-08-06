'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { AlertTriangle, Search, Filter, Download, Phone, IndianRupee } from 'lucide-react';
import { getStudents, getFeeRecords } from '@/lib/studentStore';
import { Student } from '@/app/student-management/components/studentData';
import { FeeRecord } from '@/app/fee-management/components/feeData';

const COLLEGES = ['All', 'Rajiv Gandhi Polytechnic', 'Rajiv Gandhi ITI', 'GSS Diploma College'];
const COLLEGE_SHORT: Record<string, string> = {
  'Rajiv Gandhi Polytechnic': 'RGP',
  'Rajiv Gandhi ITI': 'ITI',
  'GSS Diploma College': 'GSS',
};
const SEMESTERS = ['All', '1', '2', '3', '4', '5', '6'];

const STATUS_STYLE: Record<string, string> = {
  Overdue: 'bg-red-100 text-red-700',
  Partial: 'bg-amber-100 text-amber-700',
  Pending: 'bg-gray-100 text-gray-600',
};

const fmt = (n: number) =>
  n >= 100000
    ? `₹${(n / 100000).toFixed(2)}L`
    : n >= 1000
    ? `₹${(n / 1000).toFixed(1)}K`
    : `₹${n}`;

export default function DefaulterListContent() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allFeeRecords, setAllFeeRecords] = useState<FeeRecord[]>([]);
  const [search, setSearch] = useState('');
  const [college, setCollege] = useState('All');
  const [semester, setSemester] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');

  useEffect(() => {
    setAllStudents(getStudents());
    setAllFeeRecords(getFeeRecords());
  }, []);

  // Compute actual paid per student from fee records
  const paidByStudent = useMemo(() => {
    const map: Record<string, number> = {};
    allFeeRecords.forEach((f) => {
      map[f.studentId] = (map[f.studentId] || 0) + f.paidAmount;
    });
    return map;
  }, [allFeeRecords]);

  const defaulters = useMemo(() => {
    return allStudents.filter(
      (s) => s.feeStatus === 'Overdue' || s.feeStatus === 'Partial' || s.feeStatus === 'Pending'
    );
  }, [allStudents]);

  const filtered = useMemo(() => {
    return defaulters.filter((s) => {
      const matchSearch =
        search === '' ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
        s.phone.includes(search);
      const matchCollege = college === 'All' || s.school === college;
      const matchSem = semester === 'All' || String(s.semester) === semester;
      const matchStatus = statusFilter === 'All' || s.feeStatus === statusFilter;
      return matchSearch && matchCollege && matchSem && matchStatus;
    });
  }, [defaulters, search, college, semester, statusFilter]);

  const totalPending = filtered.reduce((sum, s) => {
    const actualPaid = paidByStudent[s.id] || 0;
    return sum + Math.max(0, s.totalFees - actualPaid);
  }, 0);
  const overdueCount = filtered.filter((s) => s.feeStatus === 'Overdue').length;
  const partialCount = filtered.filter((s) => s.feeStatus === 'Partial').length;
  const pendingCount = filtered.filter((s) => s.feeStatus === 'Pending').length;

  const courses = useMemo(() => {
    const src = college === 'All' ? defaulters : defaulters.filter((s) => s.school === college);
    return ['All', ...Array.from(new Set(src.map((s) => s.course)))];
  }, [college, defaulters]);

  const finalFiltered = useMemo(() => {
    return filtered.filter((s) => courseFilter === 'All' || s.course === courseFilter);
  }, [filtered, courseFilter]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Defaulter List</h1>
            <p className="text-sm text-muted-foreground">
              Students with pending fees — filterable by college, course, semester
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Download size={15} />
          Export
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Defaulters', value: defaulters.length, color: 'text-foreground', bg: 'bg-muted' },
          { label: 'Overdue', value: overdueCount, color: 'text-red-700', bg: 'bg-red-50' },
          { label: 'Partial', value: partialCount, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Pending', value: pendingCount, color: 'text-gray-700', bg: 'bg-gray-50' },
        ].map((k, i) => (
          <div key={i} className={`${k.bg} border border-border rounded-xl p-4`}>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Total Pending Amount */}
      <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center gap-3">
        <IndianRupee size={18} className="text-red-600" />
        <div>
          <p className="text-xs text-red-600 font-medium">Total Pending Amount (filtered)</p>
          <p className="text-xl font-bold text-red-700">{fmt(totalPending)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Filter size={14} className="text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Filters
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search name, roll no, phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          {/* College */}
          <select
            value={college}
            onChange={(e) => { setCollege(e.target.value); setCourseFilter('All'); }}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {COLLEGES.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Colleges' : COLLEGE_SHORT[c] + ' — ' + c}</option>
            ))}
          </select>
          {/* Course */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {courses.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Courses' : c}</option>
            ))}
          </select>
          {/* Semester */}
          <div className="flex gap-2">
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All Semesters' : `Semester ${s}`}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {['All', 'Overdue', 'Partial', 'Pending'].map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            {finalFiltered.length} student{finalFiltered.length !== 1 ? 's' : ''} found
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Student</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">College</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Course</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Sem</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Total Fees</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Paid</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-red-600">Pending</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Contact</th>
              </tr>
            </thead>
            <tbody>
              {finalFiltered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-muted-foreground text-sm">
                    {allStudents.length === 0
                      ? 'No students enrolled yet. Add students from Student Management.' :'No defaulters found for the selected filters.'}
                  </td>
                </tr>
              ) : (
                finalFiltered.map((s, i) => (
                  <tr key={s.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.rollNo}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {COLLEGE_SHORT[s.school]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[140px] truncate">
                      {s.course}
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-medium">{s.semester}</td>
                    <td className="px-4 py-3 text-right text-xs font-medium">{fmt(s.totalFees)}</td>
                    <td className="px-4 py-3 text-right text-xs font-medium text-emerald-700">
                      {fmt(paidByStudent[s.id] || s.paidFees)}
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-bold text-red-600">
                      {fmt(Math.max(0, s.totalFees - (paidByStudent[s.id] ?? s.paidFees)))}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[s.feeStatus] || ''}`}
                      >
                        {s.feeStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone size={12} />
                        {s.phone}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
