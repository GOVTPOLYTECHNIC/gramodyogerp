import React from 'react';
import KPIBentoGrid from './KPIBentoGrid';
import DashboardCharts from './DashboardCharts';
import RecentAdmissions from './RecentAdmissions';

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gramodyog Sewa Sansthan — Academic Year 2025–26
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-lg px-3 py-2">
          <span className="w-2 h-2 bg-success rounded-full inline-block animate-pulse" />
          Last updated: 17 Jul 2026, 08:59 AM
        </div>
      </div>
      <KPIBentoGrid />
      <DashboardCharts />
      <RecentAdmissions />
    </div>
  );
}