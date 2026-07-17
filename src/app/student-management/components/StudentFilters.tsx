'use client';
import React from 'react';
import { Search, X } from 'lucide-react';
import { SCHOOL_COURSES, School } from './studentData';

interface StudentFiltersProps {
  search: string;
  onSearch: (v: string) => void;
  filterSchool: string;
  onFilterSchool: (v: string) => void;
  filterCourse: string;
  onFilterCourse: (v: string) => void;
  filterStatus: string;
  onFilterStatus: (v: string) => void;
  filterSemester: string;
  onFilterSemester: (v: string) => void;
}

const schools = Object.keys(SCHOOL_COURSES) as School[];
const feeStatuses = ['Paid', 'Partial', 'Pending', 'Overdue'];
const semesters = ['1', '2', '3', '4', '5', '6'];

export default function StudentFilters({
  search, onSearch,
  filterSchool, onFilterSchool,
  filterCourse, onFilterCourse,
  filterStatus, onFilterStatus,
  filterSemester, onFilterSemester,
}: StudentFiltersProps) {
  const courses = filterSchool
    ? SCHOOL_COURSES[filterSchool as School]
    : Object.values(SCHOOL_COURSES).flat();

  const hasFilters = filterSchool || filterCourse || filterStatus || filterSemester;

  return (
    <div className="card p-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, roll no, guardian, phone..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="input-field pl-9 h-9 text-sm"
          />
        </div>

        {/* School filter */}
        <select
          value={filterSchool}
          onChange={(e) => onFilterSchool(e.target.value)}
          className="input-field h-9 text-sm w-full sm:w-52"
        >
          <option value="">All Institutions</option>
          {schools.map((s) => (
            <option key={`filter-school-${s}`} value={s}>{s}</option>
          ))}
        </select>

        {/* Course filter */}
        <select
          value={filterCourse}
          onChange={(e) => onFilterCourse(e.target.value)}
          className="input-field h-9 text-sm w-full sm:w-52"
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={`filter-course-${c}`} value={c}>{c}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={(e) => onFilterStatus(e.target.value)}
          className="input-field h-9 text-sm w-full sm:w-36"
        >
          <option value="">All Statuses</option>
          {feeStatuses.map((s) => (
            <option key={`filter-status-${s}`} value={s}>{s}</option>
          ))}
        </select>

        {/* Semester filter */}
        <select
          value={filterSemester}
          onChange={(e) => onFilterSemester(e.target.value)}
          className="input-field h-9 text-sm w-full sm:w-28"
        >
          <option value="">All Sem.</option>
          {semesters.map((s) => (
            <option key={`filter-sem-${s}`} value={s}>Sem {s}</option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {filterSchool && (
            <span className="badge badge-info flex items-center gap-1">
              {filterSchool}
              <button onClick={() => onFilterSchool('')} className="hover:text-danger">
                <X size={10} />
              </button>
            </span>
          )}
          {filterCourse && (
            <span className="badge badge-info flex items-center gap-1">
              {filterCourse}
              <button onClick={() => onFilterCourse('')} className="hover:text-danger">
                <X size={10} />
              </button>
            </span>
          )}
          {filterStatus && (
            <span className="badge badge-info flex items-center gap-1">
              {filterStatus}
              <button onClick={() => onFilterStatus('')} className="hover:text-danger">
                <X size={10} />
              </button>
            </span>
          )}
          {filterSemester && (
            <span className="badge badge-info flex items-center gap-1">
              Sem {filterSemester}
              <button onClick={() => onFilterSemester('')} className="hover:text-danger">
                <X size={10} />
              </button>
            </span>
          )}
          <button
            onClick={() => { onFilterSchool(''); onFilterCourse(''); onFilterStatus(''); onFilterSemester(''); }}
            className="text-xs text-danger font-medium hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}