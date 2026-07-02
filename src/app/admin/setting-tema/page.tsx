'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTheme } from 'next-themes';

const PRESET_COLORS = [
  { name: 'Red (Prasojo)', hex: '#800000' },
  { name: 'Blue', hex: '#004e89' },
  { name: 'Green', hex: '#0b6e4f' },
  { name: 'Purple', hex: '#560bad' },
  { name: 'Orange', hex: '#e85d04' },
  { name: 'Teal', hex: '#006d77' },
  { name: 'Indigo', hex: '#312e81' },
  { name: 'Emerald', hex: '#064e3b' },
];

export default function SettingTemaPage() {
  const [primaryColor, setPrimaryColor] = useState('#800000');
  const [isClient, setIsClient] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem('theme-hex');
    if (savedTheme) {
      setPrimaryColor(savedTheme);
    }
  }, []);

  const handleColorChange = (hex: string) => {
    setPrimaryColor(hex);
    document.documentElement.style.setProperty('--color-primary', hex);
    localStorage.setItem('theme-hex', hex);
    
    // Dispatch a custom event so other components can instantly update
    window.dispatchEvent(new Event('theme-changed'));
    
    toast.success('Warna tema berhasil diperbarui!');
  };

  if (!isClient) return null;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Pengaturan Tema</h2>
        <p className="text-text-secondary">Sesuaikan warna utama website dan mode tampilan sesuai dengan preferensi Anda.</p>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-border p-6 md:p-8 space-y-8">
        
        {/* Mode Tampilan (Light / Dark) */}
        <section>
          <h3 className="text-lg font-semibold mb-4 text-text-primary">Mode Tampilan</h3>
          <div className="flex gap-4">
            <button 
              onClick={() => { setTheme('light'); toast.success('Mode Terang diaktifkan'); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all ${
                theme === 'light' ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm' : 'border-neutral bg-surface text-text-secondary hover:bg-background'
              }`}
            >
              <i className="ri-sun-line text-lg"></i>
              Terang (Light)
            </button>
            <button 
              onClick={() => { setTheme('dark'); toast.success('Mode Gelap diaktifkan'); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all ${
                theme === 'dark' ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm' : 'border-neutral bg-surface text-text-secondary hover:bg-background'
              }`}
            >
              <i className="ri-moon-line text-lg"></i>
              Gelap (Dark)
            </button>
            <button 
              onClick={() => { setTheme('system'); toast.success('Mengikuti pengaturan sistem'); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all ${
                theme === 'system' ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm' : 'border-neutral bg-surface text-text-secondary hover:bg-background'
              }`}
            >
              <i className="ri-computer-line text-lg"></i>
              Sistem
            </button>
          </div>
        </section>

        <hr className="border-border" />

        {/* Preset Colors */}
        <section>
          <h3 className="text-lg font-semibold mb-4 text-text-primary">Pilihan Warna Standar</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRESET_COLORS.map((color) => (
              <button
                key={color.hex}
                onClick={() => handleColorChange(color.hex)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  primaryColor === color.hex 
                    ? 'border-primary bg-primary/5 shadow-md scale-105' 
                    : 'border-border hover:border-gray-300 hover:bg-background'
                }`}
              >
                <div 
                  className="w-12 h-12 rounded-full shadow-inner mb-3"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm font-medium text-text-secondary">{color.name}</span>
              </button>
            ))}
          </div>
        </section>

        <hr className="border-border" />

        {/* Custom Color Picker */}
        <section>
          <h3 className="text-lg font-semibold mb-4 text-text-primary">Warna Kustom</h3>
          <div className="flex items-center gap-6 p-6 bg-background rounded-xl border border-border">
            <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-inner border-4 border-white">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="absolute inset-[-10px] w-[150%] h-[150%] cursor-pointer"
              />
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Kode Hex</p>
              <div className="flex items-center gap-2">
                <code className="px-3 py-2 bg-surface rounded-lg border border-neutral font-mono text-text-primary">
                  {primaryColor.toUpperCase()}
                </code>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
