import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardContent from './components/DashboardContent';

export default function HomePage() {
  return (
    <AppLayout title="Dashboard">
      <DashboardContent />
    </AppLayout>
  );
}