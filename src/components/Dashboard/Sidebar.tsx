'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { pengajuanService } from '@/services/pengajuan.service';
import { operatorService } from '@/services/operator.service';
import { wilayahService } from '@/services/wilayah.service';
import { slaService } from '@/services/sla.service';
import { ulasanService } from '@/services/ulasan.service';

export default function Sidebar({ onClose, onLogout }: { onClose?: () => void; onLogout?: () => void }) {
  const pathname = usePathname();

  const queryClient = useQueryClient();

  const handlePrefetch = (path: string) => {
    switch (path) {
      case '/admin/ajuan':
        queryClient.prefetchQuery({ queryKey: ['ajuan', { page: 1, per_page: 10 }], queryFn: () => pengajuanService.getAjuan({ page: 1, per_page: 10 }) });
        break;
      case '/admin/lembar-kerja':
        queryClient.prefetchQuery({ queryKey: ['lembarKerja', { page: 1, per_page: 10 }], queryFn: () => pengajuanService.getLembarKerja({ page: 1, per_page: 10 }) });
        break;
      case '/admin/produk':
        queryClient.prefetchQuery({ queryKey: ['produk', { page: 1, per_page: 10 }], queryFn: () => pengajuanService.getProduk({ page: 1, per_page: 10 }) });
        break;
      case '/admin/peringkat-operator':
        queryClient.prefetchQuery({ queryKey: ['peringkatOperatorList', { page: 1, limit: 10, sort: 'newest' }], queryFn: () => operatorService.getPeringkatOperator({ page: 1, limit: 10, sort: 'newest' }) });
        break;
      case '/admin/distribusi-wilayah':
        queryClient.prefetchQuery({ queryKey: ['wilayah', { page: 1 }], queryFn: () => wilayahService.getDistribusiWilayah({ page: 1 }) });
        break;
      case '/admin/sla-monitoring':
        queryClient.prefetchQuery({ queryKey: ['slaList', { page: 1, sort_by: 'newest' }], queryFn: () => slaService.getSla({ page: 1, sort_by: 'newest' }) });
        break;
      case '/admin/ulasan':
        queryClient.prefetchQuery({ queryKey: ['ulasanList', { page: 1, sort_by: 'newest' }], queryFn: () => ulasanService.getUlasan({ page: 1, sort_by: 'newest' }) });
        break;
    }
  };

  const menuItems = [
    { name: 'DASHBOARD', path: '/admin/dashboard', icon: 'ri-dashboard-line' },
    { name: 'LEMBAR KERJA', path: '/admin/lembar-kerja', icon: 'ri-file-list-3-line' },
    { name: 'AJUAN', path: '/admin/ajuan', icon: 'ri-error-warning-line' },
    { name: 'PRODUK', path: '/admin/produk', icon: 'ri-folder-open-line' },
    { name: 'PERINGKAT OPERATOR', path: '/admin/peringkat-operator', icon: 'ri-user-star-line' },
    { name: 'DISTRIBUSI WILAYAH', path: '/admin/distribusi-wilayah', icon: 'ri-map-pin-line' },
    { name: 'SLA MONITORING', path: '/admin/sla-monitoring', icon: 'ri-time-line' },
    { name: 'ULASAN', path: '/admin/ulasan', icon: 'ri-star-line' },
  ];

  return (
    <aside className="w-[260px] flex-shrink-0 bg-primary dark:bg-surface text-white dark:text-text-primary flex flex-col h-full shadow-xl lg:shadow-none">
      {/* Logo Area */}
      <div className="p-6 pb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/dukcapil-skh.png"
            alt="Logo Dukcapil"
            width={52}
            height={52}
            className="object-contain brightness-0 invert opacity-90 dark:opacity-80"
            priority
          />
          <div>
            <h1 className="text-xl font-bold tracking-wider leading-tight">PRASOJO</h1>
            <p className="text-[9px] font-semibold tracking-widest text-white/80 dark:text-text-secondary">MONITORING SYSTEM</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-white/80 hover:text-white dark:text-text-secondary dark:hover:text-text-primary p-1">
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
              onMouseEnter={() => handlePrefetch(item.path)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] font-semibold text-xs transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-br from-white to-gray-50 text-primary shadow-[0_6px_16px_rgba(0,0,0,0.15)] ring-1 ring-black/5 dark:from-primary dark:to-[#5a0000] dark:text-white dark:ring-white/10 dark:shadow-[0_6px_16px_rgba(0,0,0,0.25)]' 
                  : 'text-white/80 hover:bg-white/10 hover:text-white dark:text-text-secondary dark:hover:bg-neutral/50 dark:hover:text-text-primary'
              }`}
            >
              <i className={`${item.icon} text-base font-normal`}></i>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-white/20 flex flex-col justify-start">
        <Link 
          href="/admin/setting-tema" 
          onClick={onClose} 
          className={`flex items-center gap-2.5 px-3 py-2.5 w-full text-left font-semibold text-xs rounded-[12px] transition-colors ${
            pathname.startsWith('/admin/setting-tema')
              ? 'bg-surface text-primary dark:bg-primary dark:text-white' 
              : 'text-white hover:bg-surface/10 dark:text-text-secondary dark:hover:bg-neutral/50 dark:hover:text-text-primary'
          }`}
        >
          <i className="ri-paint-brush-line text-base font-normal"></i>
          SETTING TEMA
        </Link>
      </div>
      <div className="px-4 pb-4 pt-3 bg-black/20 dark:bg-black/40">
         <div className="px-3 py-1 mb-1">
            <p className="text-[10px] font-bold tracking-wider text-white dark:text-text-secondary">ADMIN PRASOJO SYSTEM</p>
         </div>
         <button 
          onClick={onLogout}
          className="flex items-center gap-2.5 px-3 py-2 w-full text-left font-medium text-xs text-white hover:bg-surface/10 dark:text-text-secondary dark:hover:bg-neutral/50 dark:hover:text-text-primary rounded-[12px] transition-colors"
         >
          <i className="ri-logout-box-r-line text-base font-normal"></i>
          Logout
        </button>
      </div>
    </aside>
  );
}
