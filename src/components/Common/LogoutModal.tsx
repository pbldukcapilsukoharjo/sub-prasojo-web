import React from 'react';
import Button from './Button';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />
      
      <div className="bg-surface rounded-3xl w-full max-w-[400px] p-8 relative z-10 shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 rounded-full bg-[#fce8e8] flex items-center justify-center mb-6">
          <i className="ri-logout-box-r-line text-[#8B0000] text-3xl"></i>
        </div>
        
        <h2 className="text-[22px] font-bold text-text-primary mb-4">Konfirmasi Keluar</h2>
        
        <p className="text-center text-sm font-medium text-text-secondary leading-relaxed mb-8 px-2">
          Apakah Anda yakin ingin keluar dari sistem <span className="text-[#8B0000] font-bold">PRASOJO</span>? Sesi Anda akan diakhiri segera setelah ini.
        </p>
        
        <div className="flex w-full gap-4 mb-6">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-full border border-gray-300 text-text-secondary font-bold text-sm hover:bg-background transition-colors"
          >
            BATAL
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-full border-2 border-[#8B0000] bg-[#8B0000] text-white font-bold text-sm hover:bg-[#6b0000] transition-colors"
          >
            KELUAR
          </button>
        </div>
      </div>
    </div>
  );
}
