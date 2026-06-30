'use client';

import React, { useState, useEffect } from 'react';

export default function DonorDashboardHome({ user }) {
  const [myRequestsCount, setMyRequestsCount] = useState(0);

  useEffect(() => {
    if (!user?.email) return;

    // 🔒 Calls the updated endpoint which now correctly runs a { requesterEmail: email } database match
    fetch(`http://localhost:5000/my-requests?email=${user.email}`)
      .then(res => {
        if (!res.ok) throw new Error("Could not fetch filtered metrics.");
        return res.json();
      })
      .then(data => setMyRequestsCount(data.length))
      .catch(err => console.error("Error updating personal metrics layout:", err));
  }, [user?.email]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-red-600 rounded-3xl p-8 text-white mb-6">
        <h1 className="text-3xl font-black">Donor Portal 🩸</h1>
        <p className="text-red-100 text-sm mt-1">Welcome back, {user?.name}. Thank you for saving lives.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 border rounded-2xl shadow-xs">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">My Personal Request Count</p>
          <h3 className="text-3xl font-black mt-1 text-red-600">
            {myRequestsCount}
          </h3>
        </div>
      </div>
    </div>
  );
}