'use client';

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { FileDollar, Plus, Calendar, Person, Flame } from '@gravity-ui/icons';
import { toast } from 'react-toastify';

export default function FundingDashboard() {
  const [funds, setFunds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the active logged-in user profile records via better-auth
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // 🔄 Fetch all fund history documents from your Express backend
  useEffect(() => {
    const fetchAllFunds = async () => {
      try {
        setIsLoading(true);
        // 🌟 UPDATED: Changed from 'p' to your absolute Express server URL
        const response = await fetch('http://localhost:5000/api-funds');
        if (!response.ok) throw new Error("Failed to sync collection history.");
        
        const data = await response.json();
        setFunds(data);
      } catch (err) {
        console.error(err);
        toast.error("Could not load funding database records.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllFunds();
  }, []);

  // 🧮 Compute total system funds dynamically for Admin and Volunteers overview
  const totalFundsAmount = funds.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  // 💳 Handle direct user funding initiation via Express -> Stripe gateway
  const handleGiveFundingDirectly = async () => {
    const userInput = prompt("Enter the amount you wish to donate to the organization (৳ / BDT):", "500");
    const parsedAmount = parseFloat(userInput);

    if (!userInput) return; // User canceled out of prompt input
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please provide a valid contribution quantity.");
      return;
    }

    try {
      setIsSubmitting(true);
      // 🌟 UPDATED: Points to your absolute Express server route instead of Next API
      const response = await fetch('http://localhost:3000/api/fundings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parsedAmount,
          userId: user?.id || 'guest',
          userEmail: user?.email || 'anonymous@test.com',
          userName: user?.name || 'Anonymous Donor',
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to initialize Stripe.");

      if (data.url) {
        window.location.href = data.url; // Fire redirection to secure Stripe Checkout page
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Gateway connectivity error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 font-medium space-y-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <p className="text-sm">Compiling payment ledger streams...</p>
      </div>
    );
  }

  return (
    <div className="text-gray-800">
      
      {/* Upper Actions Dashboard Hub Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-gray-900">Organization Funding Ledger 💰</h2>
          <p className="text-gray-500 text-sm mt-0.5">Transparent ledger tracking platform support fees and emergency distributions.</p>
        </div>

        {/* Give Fund Button triggered inline matching Stripe checkout specifications */}
        <button
          onClick={handleGiveFundingDirectly}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs shrink-0"
        >
          <Plus className="size-4" />
          {isSubmitting ? "Opening Gateway..." : "Give Fund"}
        </button>
      </div>

      {/* 💡 Admin & Volunteer Summary Analytics KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xs border border-slate-900">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-1">
            <FileDollar className="text-amber-400 size-3.5" /> Cumulative Platform Revenue
          </p>
          <h3 className="text-3xl font-black tracking-tight">৳ {totalFundsAmount.toLocaleString()} BDT</h3>
          <p className="text-xs text-slate-400 mt-2">Aggregated fund reserves visible strictly to system Management and Volunteers.</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5 mb-1">
            <Flame className="text-red-500 size-3.5" /> Contribution Count
          </p>
          <h3 className="text-3xl font-black tracking-tight text-gray-900">{funds.length} Completed Records</h3>
          <p className="text-xs text-gray-400 mt-2">Active records verified via secure Stripe webhooks.</p>
        </div>
      </div>

      {/* Data Collection Records in Tabular Format */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {funds.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm font-medium">
            No contributions have been updated to the database ledger yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-4 px-6"><span className="flex items-center gap-1.5"><Person className="size-3.5" /> Contributor Name</span></th>
                  <th className="py-4 px-6"><span className="flex items-center gap-1.5"><FileDollar className="size-3.5" /> Contribution Amount</span></th>
                  <th className="py-4 px-6"><span className="flex items-center gap-1.5"><Calendar className="size-3.5" /> Date Recorded</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-gray-700">
                {funds.map((fund, index) => (
                  <tr key={fund._id || index} className="hover:bg-slate-50/70 transition-colors">
                    {/* User Name */}
                    <td className="py-4 px-6 font-bold text-gray-900">
                      {fund.userName || "Anonymous Benefactor"}
                      {fund.userEmail && <span className="block text-xs text-gray-400 font-normal mt-0.5">{fund.userEmail}</span>}
                    </td>
                    {/* Fund Amount */}
                    <td className="py-4 px-6 text-emerald-600 font-extrabold text-base">
                      ৳ {parseFloat(fund.amount).toLocaleString()}
                    </td>
                    {/* Funding Date */}
                    <td className="py-4 px-6 text-gray-500 font-medium">
                      {fund.createdAt ? new Date(fund.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}