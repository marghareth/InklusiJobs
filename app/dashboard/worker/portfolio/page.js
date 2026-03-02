"use client";

import DashboardLayout from '@/components/dashboard/worker/DashboardLayout';
import PortfolioPage from '@/components/dashboard/worker/portfolio/PortfolioPage';

export default function PortfolioPageRoute() {
  return (
    <DashboardLayout>
      <PortfolioPage />
    </DashboardLayout>
  );
}