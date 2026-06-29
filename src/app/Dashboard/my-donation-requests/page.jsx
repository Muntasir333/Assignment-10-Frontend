'use client';

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { 
  Calendar, Clock, Stethoscope, Pin, 
  TrashBin, Pencil, Eye, CircleArrowDown, CircleXmark 
} from '@gravity-ui/icons';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function MyDonationRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Fetch the active logged-in user session records
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // 🔄 Fetch user-specific requests from the database collection
  useEffect(() => {
    const fetchMyRequests = async () => {
      if (!user?.email) return;
      
      try {
        setIsLoading(true);
        // Fetch calls filtered by requester email via your API route
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/my-requests?email=${user.email}`);
        if (!response.ok) throw new Error("Failed to load collection data.");
        
        const data = await response.json();
        setRequests(data);
      } catch (err) {
        console.error(err);
        toast.error("Could not synchronize your donation requests.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyRequests();
  }, [user?.email]);

  // Color theme generator based on real-time collection document statuses
  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'inprogress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'done': return 'bg-green-50 text-green-700 border-green-200';
      case 'canceled': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // ⚡ Update collection document status mutation handler
  const updateStatus = async (id, nextStatus) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/donation-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donationStatus: nextStatus })
      });

      if (!response.ok) throw new Error("Status transmission update failed.");

      setRequests(prev => prev.map(req => 
        req._id === id ? { ...req, donationStatus: nextStatus } : req
      ));
      toast.success(`Request marked as ${nextStatus}!`);
    } catch (err) {
      toast.error("Failed to update status on the server.");
    }
    console.log(req)
  };

  // 🗑️ Delete collection document handler
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this request?")) return;

    try {
      const response = await fetch(`/api/donation-requests/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Deletion failed.");

      setRequests(prev => prev.filter(req => req._id !== id));
      toast.info("Request removed from database.");
    } catch (err) {
      toast.error("Could not delete request.");
    }
  };

  // Data client filter matrix matching dashboard state toggles
  const filteredRequests = requests.filter(req => 
    filter === 'all' ? true : req.donationStatus === filter
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 font-medium space-y-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <p className="text-sm">Fetching request history from collection...</p>
      </div>
    );
  }

  return (
    <div className="text-gray-800">
      
      {/* Upper Layout Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-gray-900">My Donation Requests 🩸</h2>
          <p className="text-gray-500 text-sm mt-0.5">Track and maintain emergency distribution calls created by your profile.</p>
        </div>
        
        {/* State Filtering Row Component */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
          {['all', 'pending', 'inprogress', 'done', 'canceled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                filter === status 
                  ? 'bg-white text-red-600 shadow-xs border border-gray-200/50' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Canvas Panel Container */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
          No donation records found matching criteria profile.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredRequests.map((req) => (
            <div 
              key={req._id} 
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden"
            >
              
              {/* Header section */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl font-black text-xl flex items-center justify-center border border-red-100 shrink-0">
                    {req.bloodGroup}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base leading-tight">Patient: {req.recipientName}</h4>
                    <span className="text-xs text-gray-400 font-medium">ID: {req._id ? req._id.slice(-8) : 'N/A'}</span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${getStatusStyle(req.donationStatus)}`}>
                  {req.donationStatus}
                </span>
              </div>

              {/* Main Content Body */}
              <div className="p-5 flex-1 space-y-4 text-sm">
                
                {/* Logistics scheduling block */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2.5 text-gray-600">
                    <Calendar className="size-4 text-gray-400 shrink-0" />
                    <span className="font-medium truncate">{req.donationDate}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-gray-600">
                    <Clock className="size-4 text-gray-400 shrink-0" />
                    <span className="font-medium truncate">{req.donationTime}</span>
                  </div>
                </div>

                {/* Hospital and Full Address Data */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-start gap-2.5 text-gray-700">
                    <Stethoscope className="size-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold leading-tight">{req.hospitalName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{req.fullAddress}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5 text-gray-600 text-xs pl-6">
                    <Pin className="size-3 text-red-400 shrink-0" />
                    <span>Location: <strong className="text-gray-800">{req.recipientUpazila}, {req.recipientDistrict}</strong></span>
                  </div>
                </div>

                {/* Case Note message excerpt */}
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100/80 text-xs italic text-gray-500">
                  &ldquo;{req.requestMessage}&rdquo;
                </div>

                {/* Conditional Donor Info Panel */}
                {req.donationStatus === 'inprogress' && req.donorName && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-blue-800">Assigned Community Donor</p>
                    <p className="text-xs font-semibold text-slate-800">{req.donorName}</p>
                    <p className="text-[11px] text-slate-500">{req.donorEmail}</p>
                  </div>
                )}
              </div>

              {/* Action Operations Control Footer */}
              <div className="px-5 py-4 bg-slate-50/30 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                
                {/* View details link */}
                <Link 
                  href={`/dashboard/donation-request/${req._id}`}
                  className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-red-600 transition-colors bg-white px-3 py-2 rounded-xl border border-gray-200"
                >
                  <Eye className="size-4" /> View Details
                </Link>

                {/* Action buttons based on current state statuses */}
                <div className="flex items-center gap-2">
                  {req.donationStatus === 'inprogress' ? (
                    <>
                      <button 
                        onClick={() => updateStatus(req._id, 'done')}
                        className="flex items-center gap-1.5 text-xs font-bold bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl shadow-xs transition-colors"
                      >
                        <CircleArrowDown className="size-4" /> Done
                      </button>
                      <button 
                        onClick={() => updateStatus(req._id, 'canceled')}
                        className="flex items-center gap-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-xl shadow-xs transition-colors"
                      >
                        <CircleXmark className="size-4" /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href={`/dashboard/edit-donation-request/${req._id}`}
                        className="p-2 text-gray-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-gray-200 flex items-center justify-center"
                        title="Edit Request"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(req._id)}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-200"
                        title="Delete Request"
                      >
                        <TrashBin className="size-4" />
                      </button>
                    </>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}