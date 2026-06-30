'use client';

import React from 'react';
import { authClient } from '@/lib/auth-client';
import AdminDashboardHome from '@/components/dashboard/AdminDashboardHome';
import DonorDashboardHome from '@/components/dashboard/DonorDashboardHome';

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const role = user?.role || "donor";

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 font-medium">
        Validating dashboard entry permissions...
      </div>
    );
  }

  // 🛡️ Conditional Switcher: Render completely different dashboards based on role
  if (role === 'admin') {
    return <AdminDashboardHome user={user} />;
  }

  // Fallback: If they are a regular donor or volunteer, show their specific limited view
  return <DonorDashboardHome user={user} />;
}