'use client';

import { authClient } from '@/lib/auth-client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function DonationRequestsCardsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDonateModal, setShowDonateModal] = useState(false);
  
  // Donor response form state
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');

  // Fetch the data from your updated endpoint
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        
        setIsLoading(true);
        const res = await fetch('http://localhost:5000/blood-requests');
        if (!res.ok) throw new Error("Failed to load blood stream registries.");
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(err.message || "Error reading database.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleDonateSubmit = async (e) => {
    e.preventDefault();
    if (!donorName || !donorPhone) {
      toast.error("Please fill in your donor contact details.");
      return;
    }
    const tokenResponse = await authClient.token();
  const token = tokenResponse?.data?.token;


    try {
      // Send the interest response back to the server
      const res = await fetch(`http://localhost:5000/blood-requests/${selectedRequest._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          status: 'pending_donor', // Updates the status so admins/volunteers see someone stepped up
          donorDetails: { name: donorName, phone: donorPhone, appliedAt: new Date() }
        }),
      });

      if (!res.ok) throw new Error("Could not process your donation commitment.");
      
      toast.success("Thank you! Your willingness to donate has been logged.");
      setShowDonateModal(false);
      setSelectedRequest(null);
      setDonorName('');
      setDonorPhone('');

      // Refresh data grid
      const refresh = await fetch('http://localhost:5000/blood-requests');
      const freshData = await refresh.json();
      setRequests(freshData);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (isLoading) return <div className="p-12 text-center text-gray-500">Loading active blood matching channels...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-800">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Active Blood Requests 🩸</h1>
        <p className="text-gray-500 text-sm mt-1">Click on any card to see details or volunteer to donate.</p>
      </div>

      {/* Grid Layout Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => (
          <div 
            key={req._id} 
            onClick={() => setSelectedRequest(req)}
            className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs hover:shadow-md hover:border-red-200 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="bg-red-50 text-red-600 font-black px-3 py-1 rounded-xl text-lg border border-red-100">
                  {req.bloodGroup || 'Any'}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${
                  req.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {req.status || 'pending'}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-xl mb-1">Recipient: {req.recipientName}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">📍 Location: {req.hospitalName || req.location || "Not Specified"}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-right">
              <span className="text-xs font-bold text-red-600 hover:underline">View Details & Donate →</span>
            </div>
          </div>
        ))}
      </div>

      {/* 🔴 OVERLAY DIALOG MODAL (Details & Response submission Form) */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            
            {!showDonateModal ? (
              /* PANEL A: Request Specification Detail Sheet */
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4">Request Profile</h2>
                <div className="space-y-3 text-sm border-y border-slate-100 py-4 my-4">
                  <p><strong>Patient Name:</strong> {selectedRequest.recipientName}</p>
                  <p><strong>Required Blood Type:</strong> <span className="text-red-600 font-bold">{selectedRequest.bloodGroup}</span></p>
                  <p><strong>Medical Facility Location:</strong> {selectedRequest.hospitalName || "Global Registry"}</p>
                  <p><strong>Created On:</strong> {selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleDateString() : 'N/A'}</p>
                  {selectedRequest.notes && <p><strong>Additional Case Notes:</strong> {selectedRequest.notes}</p>}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 text-xs font-bold uppercase text-gray-500 hover:bg-slate-50 rounded-xl"
                  >
                    Close
                  </button>
                  {selectedRequest.status !== 'completed' && (
                    <button 
                      onClick={() => setShowDonateModal(true)}
                      className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-xs"
                    >
                      I Want to Donate 🤝
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* PANEL B: Interested Donor Commitment Entry Sheet */
              <form onSubmit={handleDonateSubmit}>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Donation Commitment</h2>
                <p className="text-xs text-gray-500 mb-4">Please input your matching credentials so the patient’s team can reach out immediately.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Your Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={donorName} 
                      onChange={(e) => setDonorName(e.target.value)} 
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-red-500" 
                      placeholder="e.g. Rahat Karim"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={donorPhone} 
                      onChange={(e) => setDonorPhone(e.target.value)} 
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-red-500" 
                      placeholder="e.g. +88017XXXXXXXX"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setShowDonateModal(false)}
                    className="px-4 py-2 text-xs font-bold uppercase text-gray-500 hover:bg-slate-50 rounded-xl"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-xs"
                  >
                    Confirm Donation Commitment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}