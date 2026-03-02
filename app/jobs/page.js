"use client";

import DashboardLayout from '@/components/dashboard/worker/DashboardLayout';
import JobsPageMain from '@/components/dashboard/jobs/JobsPageMain';

export default function JobsPageRoute() {
  return (
    <DashboardLayout>
      <JobsPageMain />
    </DashboardLayout>
  );
}