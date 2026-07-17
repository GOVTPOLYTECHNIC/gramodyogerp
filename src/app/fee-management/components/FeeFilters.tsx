'use client';
import React from 'react';
import { Search, X } from 'lucide-react';

interface FeeFiltersProps {
  search: string;
  onSearch: (v: string) => void;
  filterSchool: string;
  onFilterSchool: (v: string) => void;
  filterStatus: string;
  onFilterStatus: (v: string) => void;
  filterMode: string;
  onFilterMode: (v: string) => void;
}

const schools = [
  'Rajiv Gandhi Polytechnic',
  'Rajiv Gandhi ITI',
  'GSS Diploma College',
];
const statuses = ['Paid', 'Partial', 'Pending', 'Overdue'];
const modes = ['Cash', 'Online', 'DD', 'Cheque'];

export default function FeeFilters({
  search, onSearch,
  filterSchool, onFilterSchool,
  filterStatus, onFilterStatus,
  filterMode, onFilterMode,
}: FeeFiltersProps) {
  const hasFilters = filterSchool || filterStatus || filterMode;

  return (
    <div className="card p-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by student name, roll no, receipt no..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="input-field pl-9 h-9 text-sm"
          />
        </div>
        <select
          value={filterSchool}
          onChange={(e) => onFilterSchool(e.target.value)}
          className="input-field h-9 text-sm w-full sm:w-52"
        >
          <option value="">All Institutions</option>
          {schools.map((s) => (
            <option key={`fee-filter-school-${s}`} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => onFilterStatus(e.target.value)}
          className="input-field h-9 text-sm w-full sm:w-36"
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={`fee-filter-status-${s}`} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={filterMode}
          onChange={(e) => onFilterMode(e.target.value)}
          className="input-field h-9 text-sm w-full sm:w-32"
        >
          <option value="">All Modes</option>
          {modes.map((m) => (
            <option key={`fee-filter-mode-${m}`} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {filterSchool && (
            <span className="badge badge-info flex items-center gap-1">
              {filterSchool}
              <button onClick={() => onFilterSchool('')}><X size={10} /></button>
            </span>
          )}
          {filterStatus && (
            <span className="badge badge-info flex items-center gap-1">
              {filterStatus}
              <button onClick={() => onFilterStatus('')}><X size={10} /></button>
            </span>
          )}
          {filterMode && (
            <span className="badge badge-info flex items-center gap-1">
              {filterMode}
              <button onClick={() => onFilterMode('')}><X size={10} /></button>
            </span>
          )}
          <button
            onClick={() => { onFilterSchool(''); onFilterStatus(''); onFilterMode(''); }}
            className="text-xs text-danger font-medium hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}