import React, { useState, useEffect } from 'react';

export default function DonorDashboardHome({ user }) {
  const [myRequestsCount, setMyRequestsCount] = useState(0);

  useEffect(() => {
    // 🔒 Notice this calls /my-requests?email= instead of global listings!
    fetch(`http://localhost:5000/my-requests?email=${user.email}`)
      .then(res => res.json())
      .then(data => setMyRequestsCount(data.length));
  }, [user.email]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-red-600 rounded-3xl p-8 text-white mb-6">
        <h1 className="text-3xl font-black">Donor Portal 🩸</h1>
        <p className="text-red-100 text-sm mt-1">Welcome back, {user.name}. Thank you for saving lives.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 border rounded-2xl">
          <p className="text-xs font-bold text-gray-400 uppercase">My Active Request Count</p>
          <h3 className="text-3xl font-black mt-1 text-red-600">{myRequestsCount}</h3>
        </div>
      </div>
    </div>
  );
}