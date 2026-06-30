import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react';

const layout = ({children}) => {
    return (
        <div>
            <Navbar />
            <main className="container mx-auto min-h-[80vh] p-5">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default layout;