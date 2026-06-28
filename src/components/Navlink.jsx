'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { use } from 'react';

const Navlink = ({ href, children }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <div>
            <Link href={href} className={isActive ? 'text-blue-500' : 'text-white'}>
                {children}
            </Link>
        </div>
    );
};

export default Navlink;