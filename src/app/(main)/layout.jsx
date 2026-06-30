import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react';

const layout = ({children}) => {
    return (
        <div>
            <Navbar />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default layout;