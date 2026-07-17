'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const FeeCollectionChart = dynamic(() => import('./FeeCollectionChart'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-muted rounded-xl h-64 w-full" />
  ),
});

const SchoolDistributionChart = dynamic(
  () => import('./SchoolDistributionChart'),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-muted rounded-xl h-64 w-full" />
    ),
  }
);

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <FeeCollectionChart />
      </div>
      <div>
        <SchoolDistributionChart />
      </div>
    </div>
  );
}