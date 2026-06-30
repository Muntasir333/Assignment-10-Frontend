'use client';

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';

export default function ProfileDashboard() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Grab the logged-in session user details
  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    // Only fetch once the user session is loaded and available
    if (!user?.email) return;

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        
        // 🌟 Simply GET the data from your Express backend via a relative query parameter
        const response = await fetch(`http://localhost:5000/api/profile?email=${user.email}`);
        
        if (!response.ok) throw new Error("Could not fetch user ledger document.");
        
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to map live API identity profiles.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.email]); // Re-run hook when user email completes loading

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[30vh] text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-2"></div>
        <p className="text-xs">Streaming live backend ledger keys...</p>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-10 text-gray-400">Please sign in to fetch live metrics.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto my-6 p-4">
      <div className="bg-slate-950 rounded-t-3xl p-6 text-white flex items-center gap-6">
        <img src={profile.photoUrl || profile.image} alt="avatar" className="size-16 rounded-full object-cover border-2 border-slate-700" />
        <div>
          <h2 className="text-xl font-black">{profile.name}</h2>
          <p className="text-slate-400 text-xs font-mono">{profile._id}</p>
        </div>
      </div>

      <div className="bg-white border-x border-b border-slate-200 rounded-b-3xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
              <th className="py-4 px-6">Field Name</th>
              <th className="py-4 px-6">Database Registry Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-gray-700">
            <tr>
              <td className="py-4 px-6 font-bold text-gray-500">Email Address</td>
              <td className="py-4 px-6 font-semibold">{profile.email}</td>
            </tr>
            <tr>
              <td className="py-4 px-6 font-bold text-gray-500">Blood Classification</td>
              <td className="py-4 px-6 font-black text-red-600 bg-red-50/50">{profile.bloodGroup}</td>
            </tr>
            <tr>
              <td className="py-4 px-6 font-bold text-gray-500">Governance Role</td>
              <td className="py-4 px-6 uppercase font-bold text-xs tracking-wide text-slate-600">{profile.role}</td>
            </tr>
            <tr>
              <td className="py-4 px-6 font-bold text-gray-500">Geographic Territory</td>
              <td className="py-4 px-6 font-medium text-gray-900">{profile.upazila}, {profile.district}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}