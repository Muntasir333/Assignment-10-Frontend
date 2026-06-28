'use client';

import Link from 'next/link';
import { Button } from '@heroui/react';
import { FaHeartCirclePlus, FaMagnifyingGlass } from 'react-icons/fa6';

export default function Banner() {
  return (
    <div className="relative overflow-hidden bg-neutral text-white min-h-[500px] flex items-center container mx-auto">
      {/* Visual background accents */}
      <div className="bg-[url('/image.png')] bg-cover bg-center container mx-auto">
      <div className="container mx-auto px-5 py-16 flex flex-col items-center text-center relative z-10">
        
        {/* Core Tag / Accent */}
        <span className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
          Be a Hero, Save Lives
        </span>

        {/* Heading & Hook */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl mb-6 leading-tight">
          Every Blood Donor is a <span className="text-red-500">Lifesaver</span>
        </h1>
        
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mb-10 leading-relaxed">
          Connecting individuals in need with an immediate network of willing donors. Join our blood management collective today to build a stronger, healthier community together.
        </p>

        {/* --- INTERACTIVE ACTION BUTTONS --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          
          {/* Join As Donor Option */}
          <Link href="/register" className="w-full sm:w-auto">
            <Button 
              color="danger" 
              variant="solid" 
              size="lg" 
              className="w-full sm:w-auto font-bold text-base bg-red-600 hover:bg-red-700 px-8 py-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <FaHeartCirclePlus size={18} />
              Join as a donor
            </Button>
          </Link>

          {/* Search Donors Option */}
          <Link href="/search" className="w-full sm:w-auto">
            <Button 
              variant="bordered" 
              size="lg" 
              className="w-full sm:w-auto font-bold text-base text-white border-2 border-slate-500 hover:bg-slate-500/20 px-8 py-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <FaMagnifyingGlass size={16} className="text-slate-400" />
              Search Donors
            </Button>
          </Link>

        </div>

      </div> </div>

      
    </div>
  );
}