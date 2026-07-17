import React from 'react';
import AppLayout from '@/components/AppLayout';
import StudentManagementContent from './components/StudentManagementContent';

export default function StudentManagementPage() {
  return (
    <AppLayout title="Student Management">
      <StudentManagementContent />
    </AppLayout>
  );
}