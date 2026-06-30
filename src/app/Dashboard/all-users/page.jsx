'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'blocked'
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5000/users');
      if (!res.ok) throw new Error("Could not sync user repository documents.");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error(err.message || "Failed to download database arrays.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update administrative user metrics via dynamic API execution calls
  const handleUpdateUser = async (userId, updatePayload) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      if (!res.ok) throw new Error("Database modification rejected.");
      toast.success("User matrix updated successfully.");
      setActiveMenuId(null);
      fetchUsers(); // Live refresh local cache mapping variables
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filterStatus === 'active') return user.status === 'active';
    if (filterStatus === 'blocked') return user.status === 'blocked';
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-500 font-medium">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-2"></div>
        <p className="text-sm">Mapping dynamic user identities...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">System Identity Registry 👤</h2>
          <p className="text-gray-500 text-sm">Review, filter user records, assign administrative governance, or suspend profiles.</p>
        </div>

        {/* Status Filtering Select Switch */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status Scope:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-200 bg-white rounded-xl text-xs font-semibold px-3 py-2 text-gray-700 focus:outline-hidden focus:ring-1 focus:ring-red-500"
          >
            <option value="all">Show All Records</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked Only</option>
          </select>
        </div>
      </div>

      {/* Main Datagrid View Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-visible">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Identities Matrix</th>
                <th className="py-4 px-6">System Role</th>
                <th className="py-4 px-6">Account Status</th>
                <th className="py-4 px-6 text-right">Actions Menu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-gray-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-gray-400 font-medium">No matching user records available.</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/40 transition-colors overflow-visible">
                    {/* User Profile Info */}
                    <td className="py-4 px-6 flex items-center gap-4">
                      <img src={u.photoUrl || u.image || "https://via.placeholder.com/150"} alt="Avatar" className="size-10 rounded-full object-cover bg-slate-100" />
                      <div>
                        <span className="font-bold text-gray-900 block">{u.name}</span>
                        <span className="text-xs text-gray-400 font-normal">{u.email}</span>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                        u.role === 'admin' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                        u.role === 'volunteer' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-md ${
                        u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.status}
                      </span>
                    </td>

                    {/* Administrative Context Action Menu Popover Dropdown */}
                    <td className="py-4 px-6 text-right relative overflow-visible">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === u._id ? null : u._id)}
                        className="text-gray-400 hover:text-gray-900 font-bold px-2 py-1 rounded-lg hover:bg-slate-100 text-sm tracking-widest"
                      >
                        •••
                      </button>

                      {activeMenuId === u._id && (
                        <div className="absolute right-6 top-12 bg-white border border-slate-200 shadow-xl rounded-xl py-2 w-48 text-left z-50">
                          {/* Block / Unblock conditional actions */}
                          {u.status === 'active' ? (
                            <button onClick={() => handleUpdateUser(u._id, { status: 'blocked' })} className="w-full px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left transition-colors">
                              Suspend Profile (Block)
                            </button>
                          ) : (
                            <button onClick={() => handleUpdateUser(u._id, { status: 'active' })} className="w-full px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 text-left transition-colors">
                              Reactivate Profile (Unblock)
                            </button>
                          )}

                          <div className="border-t border-slate-100 my-1"></div>

                          {/* Role escalation actions */}
                          {u.role !== 'volunteer' && u.role !== 'admin' && (
                            <button onClick={() => handleUpdateUser(u._id, { role: 'volunteer' })} className="w-full px-4 py-2 text-xs font-medium text-gray-700 hover:bg-slate-50 text-left transition-colors">
                              Promote to Volunteer
                            </button>
                          )}
                          {u.role !== 'admin' && (
                            <button onClick={() => handleUpdateUser(u._id, { role: 'admin' })} className="w-full px-4 py-2 text-xs font-bold text-purple-700 hover:bg-purple-50 text-left transition-colors">
                              Promote to System Admin
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}