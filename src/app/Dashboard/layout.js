'use client';

import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-gray-900">
      
      {/* Reusable Sidebar Component Wrapper */}
      <Sidebar />

      {/* 🚀 Dynamic Page Content Workspace Panel */}
      <main className="flex-1 p-4 sm:p-8 md:p-10 overflow-x-hidden max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-8 min-h-[80vh]">
          {children}
        </div>
      </main>

    </div>
  );
}