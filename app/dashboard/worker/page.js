// app/dashboard/page.jsx  (or pages/dashboard.jsx for Pages Router)
import DashboardLayout from '@/components/dashboard/DashboardLayout';
export const metadata = {
  title: 'Dashboard | InklusiJobs',
  description: 'Your personalized career development dashboard',
};

export default function DashboardPage() {
  return <DashboardLayout />;
}