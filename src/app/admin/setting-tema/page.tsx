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
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Page Header */}
      <div className="card shadow-sm border border-border p-6 lg:p-8 flex flex-col text-center items-center justify-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <i className="ri-paint-brush-line text-3xl"></i>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">Pengaturan Tema</h1>
        <p className="text-sm text-text-secondary font-medium">
          Sesuaikan warna utama dan mode tampilan sistem sesuai dengan preferensi visual Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Mode Tampilan Card */}
        <div className="card shadow-sm border border-border p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-primary rounded-full"></div>
            <h3 className="text-base font-bold text-text-primary">Mode Tampilan</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Light Mode Preview */}
            <button 
              onClick={() => { setTheme('light'); toast.success('Mode Terang diaktifkan'); }}
              className={`flex flex-col gap-4 p-4 rounded-2xl border-2 transition-all group ${
                theme === 'light' ? 'border-primary bg-primary/5' : 'border-neutral hover:border-gray-300 bg-surface'
              }`}
            >
              <div className="w-full aspect-[4/3] bg-white rounded-xl border border-gray-200 p-4 flex flex-col shadow-sm">
                <div className="flex flex-col gap-3 mt-1">
                  <div className="w-full h-1.5 bg-gray-200 rounded-full"></div>
                  <div className="w-11/12 h-1.5 bg-gray-200 rounded-full"></div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full"></div>
                  <div className="w-3/5 h-1.5 bg-gray-200 rounded-full"></div>
                </div>
                <div className="mt-auto flex justify-end">
                  <div className="w-1/3 h-5 bg-primary rounded-md opacity-90"></div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 font-bold text-sm text-text-primary w-full">
                <i className="ri-sun-line text-lg"></i>
                Terang
              </div>
            </button>

            {/* Dark Mode Preview */}
            <button 
              onClick={() => { setTheme('dark'); toast.success('Mode Gelap diaktifkan'); }}
              className={`flex flex-col gap-4 p-4 rounded-2xl border-2 transition-all group ${
                theme === 'dark' ? 'border-primary bg-primary/5' : 'border-neutral hover:border-gray-300 bg-surface'
              }`}
            >
              <div className="w-full aspect-[4/3] bg-[#1e293b] rounded-xl border border-slate-700 p-4 flex flex-col shadow-sm">
                <div className="flex flex-col gap-3 mt-1">
                  <div className="w-full h-1.5 bg-slate-600 rounded-full"></div>
                  <div className="w-11/12 h-1.5 bg-slate-600 rounded-full"></div>
                  <div className="w-full h-1.5 bg-slate-600 rounded-full"></div>
                  <div className="w-3/5 h-1.5 bg-slate-600 rounded-full"></div>
                </div>
                <div className="mt-auto flex justify-end">
                  <div className="w-1/3 h-5 bg-primary rounded-md opacity-90"></div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 font-bold text-sm text-text-primary w-full">
                <i className="ri-moon-line text-lg"></i>
                Gelap
              </div>
            </button>

            {/* System Mode Preview */}
            <button 
              onClick={() => { setTheme('system'); toast.success('Mengikuti pengaturan sistem'); }}
              className={`flex flex-col gap-4 p-4 rounded-2xl border-2 transition-all group ${
                theme === 'system' ? 'border-primary bg-primary/5' : 'border-neutral hover:border-gray-300 bg-surface'
              }`}
            >
              <div className="w-full aspect-[4/3] rounded-xl border border-gray-200 flex overflow-hidden shadow-sm">
                <div className="w-1/2 h-full bg-white p-3 flex flex-col border-r border-gray-200">
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="w-full h-1.5 bg-gray-200 rounded-full"></div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="mt-auto flex justify-start">
                    <div className="w-3/4 h-4 bg-primary rounded-md opacity-90"></div>
                  </div>
                </div>
                <div className="w-1/2 h-full bg-[#1e293b] p-3 flex flex-col">
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="w-full h-1.5 bg-slate-600 rounded-full"></div>
                    <div className="w-full h-1.5 bg-slate-600 rounded-full"></div>
                  </div>
                  <div className="mt-auto flex justify-end">
                    <div className="w-3/4 h-4 bg-primary rounded-md opacity-90"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 font-bold text-sm text-text-primary w-full">
                <i className="ri-computer-line text-lg"></i>
                Sistem
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preset Colors Card */}
          <div className="card shadow-sm border border-border p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 bg-primary rounded-full"></div>
              <h3 className="text-base font-bold text-text-primary">Pilihan Warna Standar</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => handleColorChange(color.hex)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    primaryColor === color.hex 
                      ? 'border-primary bg-primary/5 shadow-md scale-105' 
                      : 'border-neutral hover:border-gray-300 hover:bg-background'
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-full shadow-inner mb-2"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-[10px] font-bold text-text-secondary tracking-wider uppercase text-center">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Picker Card */}
          <div className="card shadow-sm border border-border p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 bg-primary rounded-full"></div>
              <h3 className="text-base font-bold text-text-primary">Warna Kustom</h3>
            </div>
            
            <div className="flex items-center gap-6 p-6 bg-background rounded-xl border border-neutral w-full flex-1">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-inner border-4 border-white flex-shrink-0">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="absolute inset-[-10px] w-[150%] h-[150%] cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-text-secondary tracking-[0.12em] uppercase">
                  Kode Hex
                </span>
                <code className="px-3 sm:px-4 py-2 sm:py-2.5 bg-surface rounded-xl border border-neutral font-mono text-text-primary font-bold shadow-sm text-sm">
                  {primaryColor.toUpperCase()}
                </code>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
