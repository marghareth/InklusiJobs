"use client";
import DashboardLayout from '@/components/dashboard/worker/DashboardLayout';
import MessagingInbox from '@/components/messaging/MessagingInbox';

export default function FeedbackPageRoute() {
  return (
    <DashboardLayout>
      <MessagingInbox />
    </DashboardLayout>
  );
}   