import React from 'react';
import { RootLayout } from '../components/layout/RootLayout';
import Dashboard from '../components/dashboard/Dashboard';

export default function DashboardPage() {
  return (
    <RootLayout>
      <Dashboard />
    </RootLayout>
  );
}