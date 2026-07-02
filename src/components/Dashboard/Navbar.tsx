'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isProfileActive = pathname.includes('/profile');

  let title = 'Dashboard';
  let subtitle = '';
  let badgeCount = 0;

  if (pathname.includes('/profile')) {
    title = 'Profil';
    subtitle = 'Informasi pengguna dan pegaturan akun';
  } else if (pathname.includes('/lembar-kerja')) {
    title = 'Lembar Kerja';
    subtitle = 'Daftar ajuan yang belum diproses dan membutuhkan verifikasi';
    badgeCount = 123;
  } else if (pathname.includes('/ajuan')) {
    title = 'Ajuan';
    subtitle = 'Daftar semua ajuan';
  } else if (pathname.includes('/produk')) {
    title = 'Produk Layanan';
    subtitle = 'Produk hasil dari pengajuan';
  } else if (pathname.includes('/peringkat-operator')) {
    title = 'Peringkat Operator';
    subtitle = 'Peringkat kinerja operator berdasarkan jumlah penyelesaian dokumen';
  } else if (pathname.includes('/distribusi-wilayah')) {
    title = 'Distribusi Wilayah';
    subtitle = 'Distribusi jumlah pengajuan berdasarkan kecamatan';
  } else if (pathname.includes('/sla-monitoring')) {
    title = 'SLA Monitoring';
    subtitle = 'Monitoring kepatuhan waktu pelayanan (SLA) per jenis layanan';
  } else if (pathname.includes('/ulasan')) {
    title = 'Ulasan Layanan';
    subtitle = 'Daftar ulasan dan kepuasan masyarakat terhadap layanan';
  } else if (pathname.includes('/dashboard') || pathname === '/admin') {
    title = 'Dashboard';
    subtitle = 'Ringkasan data ajuan dan kinerja layanan';
  }

  const displayName = user?.fullname || "Operator";
  const [avatarUrl, setAvatarUrl] = useState(`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=8B0000&color=fff&size=100&bold=true`);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-hex') || '#8B0000';
    const hexColor = savedTheme.replace('#', '');
    setAvatarUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=${hexColor}&color=fff&size=100&bold=true`);
    
    // Optional: listen to storage changes if we want it to update immediately across tabs
    const handleStorageChange = () => {
      const updatedTheme = localStorage.getItem('theme-hex') || '#8B0000';
      setAvatarUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=${updatedTheme.replace('#', '')}&color=fff&size=100&bold=true`);
    };
    window.addEventListener('storage', handleStorageChange);
    // Also a custom event listener for same-page updates
    window.addEventListener('theme-changed', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('theme-changed', handleStorageChange);
    };
  }, [displayName]);

  return (
    <header className="h-[64px] lg:h-[76px] flex items-center justify-between px-4 lg:px-8 bg-surface border-b border-border flex-shrink-0 w-full shadow-sm relative z-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick} 
          className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center bg-background text-text-secondary hover:bg-gray-100 transition-colors"
          aria-label="Toggle Menu"
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <h2 className="text-lg lg:text-xl font-black text-text-primary tracking-tight">{title}</h2>
            {badgeCount > 0 && (
              <span className="hidden lg:inline-flex items-center justify-center bg-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-widest">
                {badgeCount} PENDING
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] lg:text-xs font-medium text-text-secondary mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6 h-full py-2">
        {/* User Profile Trigger */}
        <Link
          href="/admin/profile"
          className={`group flex items-center gap-3 h-full pl-4 lg:pl-6 rounded-2xl px-2 lg:px-4 transition-all duration-200 cursor-pointer ${
            isProfileActive
              ? 'bg-primary/5 ring-1 ring-primary/20'
              : 'hover:bg-background'
          }`}
        >
          <div className="text-right hidden sm:flex flex-col justify-center">
            <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1 max-w-[150px]">
              {displayName}
            </p>
            <p className="text-[10px] font-bold text-text-secondary tracking-wider">
              ADMINISTRATOR
            </p>
          </div>
          
          <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 transition-all duration-200 shadow-sm ${
            isProfileActive
              ? 'ring-2 ring-primary ring-offset-2 border-0'
              : 'border border-neutral group-hover:border-primary/50 group-hover:shadow-md'
          }`}>
            <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
          </div>
        </Link>
      </div>
    </header>
  );
}
