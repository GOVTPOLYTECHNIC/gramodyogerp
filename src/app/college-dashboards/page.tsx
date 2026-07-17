'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import CollegeDashboardContent from './components/CollegeDashboardContent';

export default function CollegeDashboardsPage() {
  return (
    <AppLayout>
      <CollegeDashboardContent />
    </AppLayout>
  );
}
