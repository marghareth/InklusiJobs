"use client";

import DashboardLayout from '@/components/dashboard/worker/DashboardLayout';
import JobsPage from '@/components/dashboard/worker/portfolio/JobsPage';

export default function JobsPageRoute() {
  return (
    <DashboardLayout>
      <JobsPage />
    </DashboardLayout>
  );
}