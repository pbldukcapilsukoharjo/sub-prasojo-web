"use client";

import { useEffect, useState } from "react";

export function ThemeLangProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Sinkronisasi dari localStorage jika belum ter-apply dari script
    const theme = localStorage.getItem("theme-hex");
    const lang = localStorage.getItem("lang");

    if (theme) {
      document.documentElement.style.setProperty("--color-primary", theme);
    }
    
    if (lang) {
      document.documentElement.lang = lang;
    }

    // Optional: Listener untuk perubahan warna tab-to-tab, jika dibutuhkan di kemudian hari
  }, []);

  // Return children as is. mounted state determines hydration consistency if dealing with strictly client-rendered UI parts based on theme.
  return <>{children}</>;
}
