'use client';

import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  let title = 'Dashboard';
  let subtitle = '';
  let badgeCount = 0;

  if (pathname.includes('/lembar-kerja')) {
    title = 'Lembar Kerja';
    subtitle = 'Daftar ajuan yang belum diproses dan membutuhkan verifikasi';
    badgeCount = 123;
  } else if (pathname.includes('/ajuan')) {
    title = 'Ajuan';
    subtitle = 'Daftar semua ajuan';
  } else if (pathname.includes('/produk')) {
    title = 'Produk Layanan';
    subtitle = 'Produk hasil dari pengajuan';
  }

  return (
    <header className="h-[90px] flex items-center justify-between px-8 bg-white border-b border-gray-100 flex-shrink-0">
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {badgeCount > 0 && (
            <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full border border-gray-200">
              {badgeCount} pending
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-6">
        <button className="text-gray-500 hover:text-gray-700 transition-colors relative">
          <i className="ri-notification-3-line text-2xl"></i>
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">Admin Prasojo system</p>
            <p className="text-[10px] font-bold text-gray-500 tracking-wider">ADMINISTRATOR</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-gray-200">
            {/* Avatar placeholder */}
            <img src="https://ui-avatars.com/api/?name=Admin+Prasojo&background=0D8ABC&color=fff" alt="User Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}
