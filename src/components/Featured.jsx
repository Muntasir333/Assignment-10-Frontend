'use client';

import { Button } from '@heroui/react';
import Link from 'next/link';
import { FaDroplet, FaClock, FaShieldHeart, FaArrowRight } from 'react-icons/fa6';

export default function FeaturedSection() {
  const features = [
    {
      icon: <FaClock className="text-red-500 text-3xl" />,
      title: "Real-Time Tracking",
      description: "Track live blood requests and delivery statuses from hospitals directly on your dashboard. Zero delays when every second counts."
    },
    {
      icon: <FaDroplet className="text-red-500 text-3xl" />,
      title: "Smart Matching Network",
      description: "Our intelligent filtering system automatically matches urgent patient requests with compatible, nearby donors within minutes."
    },
    {
      icon: <FaShieldHeart className="text-red-500 text-3xl" />,
      title: "Secure Verification",
      description: "Your health records and privacy are fully protected. Donor eligibility checks protect both donors and recipients seamlessly."
    }
  ];

  return (
    <section className="bg-white text-gray-900 py-20 border-b border-gray-100">
      <div className="container mx-auto px-5">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-red-600 font-bold text-sm tracking-widest uppercase block mb-2">
              Why Choose Bloody?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Revolutionizing emergency blood supply chains
            </h2>
          </div>
          <p className="text-gray-500 max-w-md leading-relaxed">
            Traditional blood banks run into shortages and coordination bottlenecks. We close the gap with an instant, verified community network.
          </p>
        </div>

        {/* --- FEATURES GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="group p-8 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Icon Container */}
              <div className="w-14 h-14 bg-white group-hover:bg-red-50 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 transition-colors mb-6">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* --- BOTTOM CALL TO ACTION --- */}
        <div className="bg-neutral text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex w-12 h-12 rounded-full bg-red-600/20 text-red-500 items-center justify-center font-bold text-xl">
              !
            </div>
            <div>
              <h4 className="font-bold text-lg">Are you a healthcare facility manager?</h4>
              <p className="text-sm text-gray-400">Register your clinic or hospital branch to submit verified requests directly.</p>
            </div>
          </div>
          <Link href="/addfacility">
            <Button 
              color="danger" 
              variant="flat" 
              className="font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl py-5 px-6 shrink-0 flex items-center gap-2 border border-white/10"
            >
              <span>Add Your Facility</span>
              <FaArrowRight size={14} />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}