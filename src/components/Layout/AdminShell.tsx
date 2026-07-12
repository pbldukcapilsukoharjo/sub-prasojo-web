'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Dashboard/Sidebar';
import Navbar from '@/components/Dashboard/Navbar';
import MainScroll from '@/components/Dashboard/MainScroll';
import { useAuth } from '@/providers/auth-provider';

// Lazy load LogoutModal
const LogoutModal = dynamic(() => import('@/components/Common/LogoutModal'), { ssr: false });

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background relative">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar container */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-10 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} onLogout={() => setIsLogoutModalOpen(true)} />
      </div>

      {/* Main content wrapper */}
      <div className="flex flex-1 flex-col min-w-0 w-full h-screen overflow-hidden lg:relative lg:z-20">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <MainScroll>
          {children}
        </MainScroll>
      </div>

      {/* Global Floating Logout Modal */}
      {isLogoutModalOpen && (
        <LogoutModal 
          isOpen={isLogoutModalOpen} 
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={async () => {
            setIsLogoutModalOpen(false);
            await logout();
          }}
        />
      )}
    </div>
  );
}
