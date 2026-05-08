'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'DASHBOARD', path: '/admin/dashboard', icon: 'ri-dashboard-line' },
    { name: 'LEMBAR KERJA', path: '/admin/lembar-kerja', icon: 'ri-file-list-3-line' },
    { name: 'AJUAN', path: '/admin/ajuan', icon: 'ri-error-warning-line' },
    { name: 'PRODUK', path: '/admin/produk', icon: 'ri-folder-open-line' },
  ];

  return (
    <aside className="w-[260px] flex-shrink-0 bg-primary text-white flex flex-col h-full">
      {/* Logo Area */}
      <div className="p-6 pb-8">
        <h1 className="text-2xl font-bold tracking-wider leading-tight">PRASOJO</h1>
        <p className="text-[10px] font-semibold tracking-widest text-white/80">MONITORING SYSTEM</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-[12px] font-semibold text-sm transition-colors ${
                isActive 
                  ? 'bg-white text-primary' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <i className={`${item.icon} text-lg font-normal`}></i>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/20">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-left font-semibold text-sm hover:bg-white/10 rounded-[12px] transition-colors">
          <i className="ri-paint-brush-line text-lg font-normal"></i>
          SETTING TEMA
        </button>
      </div>
      <div className="px-4 pb-6 pt-2 bg-[#700000]">
         <div className="px-4 py-2">
            <p className="text-[11px] font-bold tracking-wider text-white">ADMIN PRASOJO SYSTEM</p>
         </div>
         <button className="flex items-center gap-3 px-4 py-2 w-full text-left font-medium text-sm hover:bg-white/10 rounded-[12px] transition-colors">
          <i className="ri-logout-box-r-line text-lg font-normal"></i>
          Logout
        </button>
      </div>
    </aside>
  );
}
