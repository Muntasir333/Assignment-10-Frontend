'use client';

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function AllBloodDonationRequestsPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const role = user?.role ? user.role.toLowerCase() : "donor";
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;

    // 🛡️ Security Check
    if (!user || (role !== 'admin' && role !== 'volunteer')) {
      toast.error("Unauthorized access.");
      router.push('/Dashboard');
      return;
    }

    const syncGlobalRequests = async () => {
      try {
        setIsLoading(true);
        // 🌟 Ensure this endpoint returns ALL requests from the database
        const res = await fetch('http://localhost:5000/blood-requests');
        if (!res.ok) throw new Error("Could not pull reservation registries.");
        const data = await res.json();
        
        // Handle array validation safely
        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error("Failed to sync global registries.");
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    syncGlobalRequests();
  }, [user, isPending, role, router]);

  const handleUpdateStatus = async (requestId, nextStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/blood-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, requestedByRole: role }), 
      });

      if (!res.ok) throw new Error("State alteration denied.");
      toast.success(`Status updated to ${nextStatus}`);
      
      // Instantly update the local state array so the buttons change immediately
      setRequests(prev => prev.map(req => 
        req._id === requestId ? { ...req, status: nextStatus } : req
      ));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAdminDelete = async (requestId) => {
    if (!confirm("Permanently delete this record?")) return;
    try {
      const res = await fetch(`http://localhost:5000/blood-requests/${requestId}?role=${role}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error("Deletion rejected by server.");
      toast.success("Document removed.");
      setRequests(prev => prev.filter(r => r._id !== requestId));
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Safe status string checking for filters
  const filteredRequests = requests.filter(req => {
    if (filterStatus === 'all') return true;
    const currentStatus = (req.status || 'pending').toLowerCase();
    return currentStatus === filterStatus;
  });

  if (isPending || isLoading) {
    return (
      <div className="p-12 text-center text-sm font-medium text-gray-500 tracking-wide">
        Syncing database values...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Global Donation Registries 🩸</h2>
          <p className="text-gray-500 text-sm mt-0.5">Role Clearance level: <span className="uppercase font-bold text-red-600">{role}</span></p>
        </div>

        {/* Filtering Functionality */}
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)} 
          className="border border-slate-200 bg-white rounded-xl text-xs font-semibold px-3 py-2 text-gray-700 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
              <th className="py-4 px-6">Recipient</th>
              <th className="py-4 px-6">Blood Group</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-gray-700">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-gray-400 font-medium">
                  No active donation requests found matching this criteria.
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => {
                const currentStatus = (req.status || 'pending').toLowerCase();

                return (
                  <tr key={req._id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900">{req.recipientName}</td>
                    <td className="py-4 px-6">
                      <span className="text-red-600 font-black bg-red-50 border border-red-100 px-2.5 py-0.5 rounded text-sm">
                        {req.bloodGroup}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        currentStatus === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        currentStatus === 'canceled' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {currentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      {/* Both Admins and Volunteers can see these buttons if status is pending */}
                      {currentStatus === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(req._id, 'completed')} 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Complete
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(req._id, 'canceled')} 
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    
                      {role === 'admin' && (
                        <button 
                          onClick={() => handleAdminDelete(req._id)} 
                          className="border border-red-200 text-red-600 hover:bg-red-50 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Purge Document
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}