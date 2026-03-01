"use client";

import DashboardLayout from '@/components/dashboard/worker/DashboardLayout';
import TrackerPage from '@/components/dashboard/worker/TrackerPage';

export default function TrackerPageRoute() {
  return (
    <DashboardLayout>
      <TrackerPage />
    </DashboardLayout>
  );
}