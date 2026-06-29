'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { 
  House, Person, Envelope, Bars, 
  PersonFill, Layers, 
  ArrowChevronRight
} from '@gravity-ui/icons';
import { Button, Drawer } from '@heroui/react';

export default function Sidebar() {
  const pathname = usePathname();
  
  // 🛠️ Simple React state management replacing useDisclosure
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;
  console.log(user);
  const userRole = user?.role || "donor"; 

  // --- Dynamic Link Generator Based on Role ---
  const getNavItems = () => {
    const baseItems = [
      { icon: House, label: "Dashboard Home", href: "/Dashboard" },
      { icon: Person, label: "My Profile", href: "/Dashboard/profile" },
    ];

    if (userRole === "donor") {
      return [
        ...baseItems,
        { icon: Envelope, label: "Create Request", href: "/Dashboard/create-donation-request" },
        { icon: Layers, label: "My Requests", href: "/Dashboard/my-donation-requests" },
      ];
    }
    if (userRole === "volunteer") {
      return [
        ...baseItems,
        { icon: Layers, label: "All Blood Requests", href: "/Dashboard/all-blood-donation-request" },
      ];
    }
    if (userRole === "admin") {
      return [
        ...baseItems,
        { icon: PersonFill, label: "All Users", href: "/Dashboard/all-users" },
        { icon: Layers, label: "All Blood Requests", href: "/Dashboard/all-blood-donation-request" },
      ];
    }
    return baseItems;
  };

  const navItems = getNavItems();

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  // Internal link list helper
  const NavigationLinks = ({ closeDrawer = () => {} }) => (
    <nav className="flex flex-col gap-2 mt-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link href={item.href} key={item.label} passHref legacyBehavior>
            <button
              onClick={closeDrawer}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all text-left ${
                isActive 
                  ? "bg-red-600 text-white shadow-sm" 
                  : "text-gray-300 hover:bg-slate-800 hover:text-white"
              }`}
              type="button"
            >
              <item.icon className={`size-5 ${isActive ? "text-white" : "text-gray-400"}`} />
              <span>{item.label}</span>
            </button>
          </Link>
        );
      })}

      <button
        onClick={() => { closeDrawer(); handleLogout(); }}
        className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-950/30 transition-all text-left mt-8 border-t border-slate-800 pt-4"
        type="button"
      >
        <ArrowChevronRight className="size-5 text-red-400" />
        <span>Logout</span>
      </button>
    </nav>
  );

  return (
    <>
      {/* 📱 Mobile Top Bar Header */}
      <div className="md:hidden w-full bg-neutral text-white px-5 py-4 flex justify-between items-center shadow-md border-b border-slate-800 shrink-0">
        <h2 className="text-xl font-bold tracking-tight">
          Bloody <span className="text-xs bg-red-600 px-2 py-0.5 rounded-full ml-1 uppercase">{userRole}</span>
        </h2>
        {/* Toggle state manually on button press */}
        <Button onClick={() => setIsMobileOpen(true)} variant="flat" className="bg-slate-800 text-white min-w-0 p-3">
          <Bars className="size-5" />
        </Button>
      </div>

      {/* 🖥️ Desktop Permanent Left Panel */}
      <aside className="hidden md:flex flex-col w-64 bg-neutral text-white p-5 space-y-6 shrink-0 border-r border-slate-800 min-h-screen sticky top-0">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Bloody</h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
            Portal: <span className="text-red-500">{userRole}</span>
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavigationLinks />
        </div>
      </aside>

      {/* 📱 Mobile Slide-Out Drawer Panel */}
      <Drawer 
        isOpen={isMobileOpen} 
        onClose={() => setIsMobileOpen(false)} 
        placement="left" 
        size="sm" 
        className="bg-neutral text-white"
      >
        <Drawer.Content className="bg-neutral border-r border-slate-800">
          <Drawer.Header className="border-b border-slate-800 py-5">
            <div>
              <Drawer.Heading className="text-xl font-bold text-white">Navigation</Drawer.Heading>
              <p className="text-xs text-red-500 uppercase font-bold mt-0.5">{userRole} Dashboard</p>
            </div>
          </Drawer.Header>
          <Drawer.Body className="py-4">
            {/* Closes mobile overlay view on option click */}
            <NavigationLinks closeDrawer={() => setIsMobileOpen(false)} />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer>
    </>
  );
}