import React from 'react';
import AppLayout from '@/components/AppLayout';
import FeeManagementContent from './components/FeeManagementContent';

export default function FeeManagementPage() {
  return (
    <AppLayout title="Fee Management">
      <FeeManagementContent />
    </AppLayout>
  );
}