import React from 'react';

interface Review {
  id: number;
  name: string;
  date: string;
  content: string;
  rating: number;
  type: string;
  jenisLayanan?: string;
  kecamatan?: string;
}

interface DetailUlasanModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
}

export default function DetailUlasanModal({ isOpen, onClose, review }: DetailUlasanModalProps) {
  if (!isOpen || !review) return null;

  // Map or fallback for fields to ensure we display what is in the image
  const displayJenisLayanan = review.jenisLayanan || review.type || 'Umum';
  const displayKecamatan = review.kecamatan || '-';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="bg-surface rounded-[24px] w-full max-w-[620px] p-8 relative z-10 shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200 m-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar Circle */}
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-border flex items-center justify-center flex-shrink-0">
              <i className="ri-user-3-line text-xl text-slate-500"></i>
            </div>
            {/* Reviewer Name */}
            <h2 className="text-xl font-bold text-slate-950 font-manrope">
              {review.name}
            </h2>
          </div>
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-slate-950 hover:bg-slate-50 rounded-full transition-all cursor-pointer border border-transparent hover:border-border"
          >
            <i className="ri-close-line text-xl font-bold"></i>
          </button>
        </div>

        {/* Separator Line */}
        <div className="border-b border-border mt-5 mb-6" />

        {/* Details Card Grid */}
        <div className="border border-border rounded-[20px] p-6 mb-6 bg-surface">
          <div className="grid grid-cols-2 gap-y-6 gap-x-6">
            {/* Jenis Layanan */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Jenis Layanan</p>
              <p className="text-sm font-bold text-slate-900">{displayJenisLayanan}</p>
            </div>
            {/* Waktu Pengiriman Ulasan */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Waktu Pengiriman Ulasan</p>
              <p className="text-sm font-bold text-slate-900">{review.date}</p>
            </div>
            {/* Rating */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Rating</p>
              <div className="flex items-center gap-1.5">
                {/* Star Icons */}
                <div className="flex gap-0.5 text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={i < review.rating ? "ri-star-fill text-sm" : "ri-star-line text-slate-200 text-sm"}
                    />
                  ))}
                </div>
                {/* Rating text */}
                <span className="text-sm font-bold text-slate-900 ml-0.5">
                  {review.rating}/5
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Isi Ulasan Section */}
        <div className="flex flex-col">
          {/* Section Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-5 bg-slate-950 rounded-full"></div>
            <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">
              ISI ULASAN
            </h3>
          </div>

          {/* Content Textarea-like Box */}
          <div className="bg-slate-50 border border-border/50 rounded-2xl p-5 text-sm text-slate-600 leading-relaxed font-medium">
            <p>{review.content}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
