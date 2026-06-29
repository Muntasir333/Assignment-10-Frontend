'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import Navlink from './Navlink';
import { Button } from '@heroui/react';
import { FaChevronDown, FaUser } from 'react-icons/fa6'; // Optional clean icons

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    const { 
        data: session, 
        isPending, 
        error, 
        refetch 
    } = authClient.useSession();
    const user = session?.user;

    const handleLogout = async () => {
        await authClient.signOut();
        setIsDropdownOpen(false);
        refetch(); 
    };

    return (
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center p-5 bg-black text-white relative'>
            
            {/* --- LOGO --- */}
            <div>
                <h2 className='text-3xl font-bold text-red-700'>Bloody</h2>
            </div>
            
            {/* --- LINKS SECTION --- */}
            <div className='bg-slate-500 text-black p-3 rounded-lg mt-3 md:mt-0'>
                <ul className='flex justify-between items-center gap-4'>
                    <li className='font-bold'><Navlink href='/'>Home</Navlink></li>
                    <li className='font-bold'><Navlink href='/donation-requests'>Donation Requests</Navlink></li>
                    
                    {/* Only show Funding link if user is logged in */}
                    { (
                        <li className='font-bold'><Navlink href='/funding'>Funding Links</Navlink></li>
                    )}
                </ul>
            </div>

    
       <div className='mt-3 md:mt-0 relative'>
    {!user ? (
        <Navlink href='/login'>
            <Button color="primary" variant="solid" className="font-semibold">
                Login
            </Button>
        </Navlink>
    ) : (
        <div className="relative">
            <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-full text-white transition-colors focus:outline-none"
            >
                {/* --- AVATAR CONTAINER --- */}
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden border border-slate-600">
                    { user.photoUrl ? (
                        <img 
                            src={ user.photoUrl} 
                            alt={user.name || "User avatar"} 
                            className="w-full h-full object-cover"
                        />
                    ) : user.name ? (
                        user.name[0].toUpperCase()
                    ) : (
                        <FaUser size={12} />
                    )}
                </div>
                
                <span className="text-sm font-medium hidden sm:inline">{user.name || 'User'}</span>
                <FaChevronDown size={12} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-2 border border-gray-100 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray-500 truncate">
                        {user.email}
                    </div>
                    <Navlink href='/Dashboard'>
                        <button 
                            onClick={() => setIsDropdownOpen(false)}
                            className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            Dashboard
                        </button>
                    </Navlink>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold border-t border-gray-100"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    )}
</div>
  
        </div>
    );
};

export default Navbar;