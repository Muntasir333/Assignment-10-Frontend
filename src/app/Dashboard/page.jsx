// src/app/Dashboard/page.jsx
'use client';

import { authClient } from '@/lib/auth-client';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const role = user?.role || "donor";

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-gray-500 mt-1">Role: {role}</p>
        </div>
    );
}