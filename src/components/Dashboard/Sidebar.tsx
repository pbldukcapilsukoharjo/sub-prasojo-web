'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutModal from '@/components/Common/LogoutModal';

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuItems = [
    { name: 'DASHBOARD', path: '/admin/dashboard', icon: 'ri-dashboard-line' },
    { name: 'LEMBAR KERJA', path: '/admin/lembar-kerja', icon: 'ri-file-list-3-line' },
    { name: 'AJUAN', path: '/admin/ajuan', icon: 'ri-error-warning-line' },
    { name: 'PERINGKAT OPERATOR', path: '/admin/peringkat-operator', icon: 'ri-user-star-line' },
    { name: 'DISTRIBUSI WILAYAH', path: '/admin/distribusi-wilayah', icon: 'ri-map-pin-line' },
    { name: 'SLA MONITORING', path: '/admin/sla-monitoring', icon: 'ri-time-line' },
    { name: 'ULASAN', path: '/admin/ulasan', icon: 'ri-star-line' },
    { name: 'PRODUK', path: '/admin/produk', icon: 'ri-folder-open-line' },
  ];

  return (
    <aside className="w-[260px] flex-shrink-0 bg-primary text-white flex flex-col h-full shadow-xl lg:shadow-none">
      {/* Logo Area */}
      <div className="p-6 pb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-wider leading-tight">PRASOJO</h1>
          <p className="text-[10px] font-semibold tracking-widest text-white/80">MONITORING SYSTEM</p>
        </div>
        <button onClick={onClose} className="lg:hidden text-white/80 hover:text-white p-1">
          <i className="ri-close-line text-2xl"></i>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              href={item.path}
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] font-semibold text-xs transition-colors ${
                isActive 
                  ? 'bg-white text-primary' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <i className={`${item.icon} text-base font-normal`}></i>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-white/20">
        <button className="flex items-center gap-2.5 px-3 py-2.5 w-full text-left font-semibold text-xs hover:bg-white/10 rounded-[12px] transition-colors">
          <i className="ri-paint-brush-line text-base font-normal"></i>
          SETTING TEMA
        </button>
      </div>
      <div className="px-4 pb-4 pt-3 bg-[#700000]">
         <div className="px-3 py-1 mb-1">
            <p className="text-[10px] font-bold tracking-wider text-white">ADMIN PRASOJO SYSTEM</p>
         </div>
         <button 
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-2.5 px-3 py-2 w-full text-left font-medium text-xs hover:bg-white/10 rounded-[12px] transition-colors"
         >
          <i className="ri-logout-box-r-line text-base font-normal"></i>
          Logout
        </button>
      </div>

      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          window.location.href = '/login';
        }}
      />
    </aside>
  );
}
