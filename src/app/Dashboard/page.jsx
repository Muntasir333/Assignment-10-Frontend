'use client';

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { Persons, FileDollar, Heart } from '@gravity-ui/icons';
import { toast } from 'react-toastify';

export default function DashboardPage() {
  // 🔐 1. Fetching live dynamic session indicators using authClient
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const role = user?.role || "donor";

  const [stats, setStats] = useState({
    totalDonors: 0,
    totalFunding: 0,
    totalRequests: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 2. Simply query live database collections across your Express routers
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const [usersRes, fundsRes, requestsRes] = await Promise.all([
          fetch('http://localhost:5000/users'),
          fetch('http://localhost:5000/api-funds'),
          fetch('http://localhost:5000/my-requests')
        ]);

        const users = usersRes.ok ? await usersRes.json() : [];
        const funds = fundsRes.ok ? await fundsRes.json() : [];
        const requests = requestsRes.ok ? await requestsRes.json() : [];

        const donorsCount = users.filter(u => u.role === 'donor').length;
        const fundingSum = funds.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

        setStats({
          totalDonors: donorsCount || users.length, 
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
      
      {/* Dynamic Integrated Welcome Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xs mb-8">
        <h1 className="text-3xl font-black tracking-tight">
          Welcome, {user?.name || "User"}! 👋
        </h1>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-slate-400 text-sm font-medium">System Role Authorization:</span>
          <span className="bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-red-500/30">
            {role}
          </span>
        </div>
      </div>

      {/* Featured Statistics Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Users/Donors */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Donors</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight mt-1">
              {isLoading ? "..." : stats.totalDonors.toLocaleString()}
            </h3>
          </div>
          <div className="bg-blue-50 text-blue-600 p-4 rounded-xl">
            <Persons className="size-6" />
          </div>
        </div>

        {/* Total Funding */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Funding</p>
            <h3 className="text-3xl font-black text-emerald-600 tracking-tight mt-1">
              {isLoading ? "..." : `৳ ${stats.totalFunding.toLocaleString()}`}
            </h3>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl">
            <FileDollar className="size-6" />
          </div>
        </div>

        {/* Total Blood Requests */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Donation Requests</p>
            <h3 className="text-3xl font-black text-red-600 tracking-tight mt-1">
              {isLoading ? "..." : stats.totalRequests.toLocaleString()}
            </h3>
          </div>
          <div className="bg-red-50 p-4 rounded-xl text-red-600">
            <Heart className="size-6" />
          </div>
        </div>

      </div>
    </div>
  );
}