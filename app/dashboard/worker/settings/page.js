"use client";
import DashboardLayout from '@/components/dashboard/worker/DashboardLayout';
import SettingsPage from '@/components/dashboard/worker/SettingsPage';

export default function SettingsPageRoute() {
  return (
    <DashboardLayout>
      <SettingsPage />
    </DashboardLayout>
  );
}