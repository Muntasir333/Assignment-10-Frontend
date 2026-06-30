'use client';

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { Persons, FileDollar, Heart } from '@gravity-ui/icons';
import { toast } from 'react-toastify';

export default function DashboardHome() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [stats, setStats] = useState({
    totalDonors: 0,
    totalFunding: 0,
    totalRequests: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // 🌟 Simply fetch all records to calculate counts dynamically from your Express server
        const [usersRes, fundsRes, requestsRes] = await Promise.all([
          fetch('http://localhost:5000/users'),
          fetch('http://localhost:5000/api-funds'),
          fetch('http://localhost:5000/blood-requests')
        ]);

        const users = usersRes.ok ? await usersRes.json() : [];
        const funds = fundsRes.ok ? await fundsRes.json() : [];
        const requests = requestsRes.ok ? await requestsRes.json() : [];

        const donorsCount = users.filter(u => u.role === 'donor').length;
        const fundingSum = funds.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

        setStats({
          totalDonors: donorsCount || users.length, // Fallback to all users if roles aren't preset
          totalFunding: fundingSum,
          totalRequests: requests.length,
        });
      } catch (err) {
        console.error("Stats aggregation failed:", err);
        toast.error("Failed to compile dashboard metrics ledger streams.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 text-gray-800 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xs mb-8">
        <h1 className="text-3xl font-black tracking-tight">Welcome Back, {user?.name || "Admin"}! 👋</h1>
        <p className="text-slate-400 text-sm mt-1.5 font-medium">
          System Core Governance Board. Track active platform support indices, donor tallies, and critical blood registries.
        </p>
      </div>

      {/* Featured Statistics KPI Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Users/Donors */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Donors Registered</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight mt-1">
              {isLoading ? "..." : stats.totalDonors.toLocaleString()}
            </h3>
          </div>
          <div className="bg-blue-50 text-blue-600 p-4 rounded-xl">
            <Persons className="size-6" />
          </div>
        </div>

        {/* Card 2: Total Funding */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cumulative Platform Funding</p>
            <h3 className="text-3xl font-black text-emerald-600 tracking-tight mt-1">
              {isLoading ? "..." : `৳ ${stats.totalFunding.toLocaleString()}`}
            </h3>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl">
            <FileDollar className="size-6" />
          </div>
        </div>

        {/* Card 3: Total Blood Donation Request */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Blood Donation Requests</p>
            <h3 className="text-3xl font-black text-red-600 tracking-tight mt-1">
              {isLoading ? "..." : stats.totalRequests.toLocaleString()}
            </h3>
          </div>
          <div className="bg-red-50 text-red-50 p-4 rounded-xl text-red-600">
            <Heart className="size-6" />
          </div>
        </div>
      </div>
    </div>
  );
}