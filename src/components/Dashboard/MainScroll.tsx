'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function MainScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [pathname]);

  return (
    <main ref={mainRef} className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F9FAFB] p-6">
      {children}
    </main>
  );
}
