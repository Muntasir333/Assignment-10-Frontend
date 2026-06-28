'use client';

import Link from 'next/link';
import { FaDroplet, FaFacebook, FaTwitter, FaLinkedin, FaHeart } from 'react-icons/fa6';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral text-gray-300 border-t border-slate-800 container mx-auto">
      
      {/* --- MAIN LINKS GRID --- */}
      <div className="container mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Statement */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center space-x-2">
              <FaDroplet className="text-red-500 text-3xl" />
              <span className="font-bold text-2xl text-white tracking-tight">
                Bloody
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              An intelligent, safe, and real-time community ecosystem dedicated to matching urgent blood requests with active donors instantly. Together we close the medical coordination gap.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-red-600 hover:text-white text-gray-400 transition-colors">
                <FaFacebook size={16} />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-red-600 hover:text-white text-gray-400 transition-colors">
                <FaTwitter size={16} />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-red-600 hover:text-white text-gray-400 transition-colors">
                <FaLinkedin size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: For Donors */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-red-500 pl-2">
              For Donors
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/register" className="hover:text-red-400 transition-colors">Join As Donor</Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-red-400 transition-colors">Search Blood Needs</Link>
              </li>
              <li>
                <Link href="/donation-requests" className="hover:text-red-400 transition-colors">Active Requests</Link>
              </li>
              <li>
                <Link href="/eligibility" className="hover:text-red-400 transition-colors">Eligibility Guidelines</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Facilities */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-red-500 pl-2">
              For Facilities
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/addfacility" className="hover:text-red-400 transition-colors">Add Hospital/Clinic</Link>
              </li>
              <li>
                <Link href="/managemyfacilities" className="hover:text-red-400 transition-colors">Manage Facilities</Link>
              </li>
              <li>
                <Link href="/funding" className="hover:text-red-400 transition-colors">Funding Opportunities</Link>
              </li>
              <li>
                <Link href="/partner-portal" className="hover:text-red-400 transition-colors">Enterprise API</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-red-500 pl-2">
              Platform
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-red-400 transition-colors">Our Mission</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-400 transition-colors">Support Desk</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-red-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-red-400 transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* --- SUB FOOTER / COPYRIGHT --- */}
      <div className="border-t border-slate-800/60 bg-neutral/40 py-6 text-xs text-gray-500">
        <div className="container mx-auto px-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            &copy; {currentYear} Bloody Management Network. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <FaHeart className="text-red-500 mx-0.5" />
            <span>for community health and medical emergency safety.</span>
          </div>
        </div>
      </div>

    </footer>
  );
}