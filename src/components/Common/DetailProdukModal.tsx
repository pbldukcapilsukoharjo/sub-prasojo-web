import React, { useEffect, useState } from 'react';
import { pengajuanService, TimelineDetail, ProdukDetailData } from '@/services/pengajuan.service';
import { handleApiError } from '@/lib/api-error';

interface DetailProdukModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id?: number;
    noRegis: string;
    namaLengkap: string;
    nik: string;
    jenisLayanan: string;
    kecamatan: string;
    status?: string;
    tanggal?: string;
    waktu?: string;
  } | null;
}

export default function DetailProdukModal({ isOpen, onClose, data }: DetailProdukModalProps) {
  const [timelineData, setTimelineData] = useState<TimelineDetail[]>([]);
  const [detailData, setDetailData] = useState<ProdukDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSelengkapnya, setShowSelengkapnya] = useState(false);

  useEffect(() => {
    if (isOpen && data?.id) {
      fetchDetail(data.id);
    } else {
      setTimelineData([]);
      setDetailData(null);
      setShowSelengkapnya(false);
    }
  }, [isOpen, data?.id]);

  const fetchDetail = async (id: number) => {
    setIsLoading(true);
    try {
      const res = await pengajuanService.getProdukDetail(id);
      if (res.status && res.data) {
        setTimelineData(res.data.timeline || []);
        setDetailData(res.data);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Modal overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/50 transition-opacity"
        onClick={onClose}
      />
      
      <div className={`bg-surface rounded-2xl w-full max-w-[680px] p-6 lg:p-8 relative z-10 shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200 m-4 max-h-[90vh] overflow-y-auto transition-opacity ${isLoading ? 'opacity-70 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-border">
              <i className="ri-folder-info-line text-xl text-slate-600"></i>
            </div>
            <h2 className="text-[18px] font-bold text-slate-950 font-manrope">
              Detail Produk : {data.noRegis}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-slate-900 hover:bg-slate-50 border border-transparent hover:border-border rounded-full transition-colors self-start cursor-pointer"
          >
            <i className="ri-close-line text-xl font-bold"></i>
          </button>
        </div>

        {/* Info Card */}
        <div className="border border-border rounded-[16px] p-6 mb-6 bg-surface shadow-xs">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Nama Identitas Produk</p>
              <p className="text-sm font-bold text-slate-900">{detailData?.nama_identitas_produk || data.namaLengkap}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">No. Dokumen / NIK</p>
              <p className="text-sm font-bold text-slate-900">{detailData?.nomor || data.nik}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Jenis Layanan</p>
              <p className="text-sm font-bold text-slate-900">{detailData?.jenis_layanan || data.jenisLayanan}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Kecamatan</p>
              <p className="text-sm font-bold text-slate-900">{detailData?.kecamatan || data.kecamatan}</p>
            </div>
          </div>
        </div>

        {/* Toggle Button for Data Ajuan & Dokumen */}
        {(detailData?.data_ajuan && Object.keys(detailData.data_ajuan).length > 0) && (
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setShowSelengkapnya(!showSelengkapnya)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-colors uppercase tracking-wider"
            >
              <span>{showSelengkapnya ? 'Sembunyikan Detail' : 'Lihat Selengkapnya'}</span>
              <i className={`ri-arrow-${showSelengkapnya ? 'up' : 'down'}-s-line text-lg`}></i>
            </button>
          </div>
        )}

        {/* Data Ajuan Dinamis */}
        {showSelengkapnya && detailData?.data_ajuan && Object.keys(detailData.data_ajuan).length > 0 && (
          <div className="border border-border rounded-[16px] p-6 mb-8 bg-slate-50/50 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="flex items-center gap-2 mb-4">
              <i className="ri-database-2-line text-slate-500"></i>
              <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Data Pengajuan</h3>
            </div>
            <div className="grid grid-cols-1 gap-y-4 gap-x-4">
              {Object.entries(detailData.data_ajuan).map(([key, value]) => {
                 if (typeof value === 'object' && value !== null) return null;
                 
                 const formattedKey = key.replace(/^([a-z]+)_/, '').replace(/_/g, ' ');
                 
                 let displayValue = value;
                 if (typeof value === 'string' && value.includes('T00:00:00.000000Z')) {
                    try {
                        const d = new Date(value);
                        displayValue = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
                    } catch(e){}
                 }

                 return (
                  <div key={key} className="flex flex-col border-b border-border pb-3 last:border-0 last:pb-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">{formattedKey}</p>
                    <p className="text-sm font-semibold text-slate-800 break-words">{String(displayValue) || '-'}</p>
                  </div>
                 )
              })}
            </div>
          </div>
        )}

        {/* Dokumen Ajuan */}
        {showSelengkapnya && detailData?.data_ajuan && Object.entries(detailData.data_ajuan).some(([key, val]) => key.endsWith('_dokumen') && Array.isArray(val)) && (
          <div className="border border-border rounded-[16px] p-6 mb-8 bg-surface shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="flex items-center gap-2 mb-4">
              <i className="ri-folder-2-line text-slate-500"></i>
              <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Dokumen Pengajuan</h3>
            </div>
            <div className="flex flex-col gap-6">
              {Object.entries(detailData.data_ajuan)
                .filter(([key, val]) => key.endsWith('_dokumen') && Array.isArray(val))
                .map(([key, docs]) => (
                  <div key={key} className="flex flex-col gap-4">
                    {((docs as unknown) as any[]).map((doc, idx) => (
                      <div key={idx} className="flex flex-col gap-2 border-b border-border pb-4 last:border-0 last:pb-0">
                        <p className="text-sm font-bold text-slate-800">{doc.name} {doc.require === 1 && <span className="text-red-500">*</span>}</p>
                        {doc.file && doc.file.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {doc.file.map((f: any, fIdx: number) => (
                               <a key={fIdx} href={f.url} target="_blank" rel="noopener noreferrer" className="relative group block w-24 h-24 rounded-lg overflow-hidden border border-border">
                                  {f.type === 'image' ? (
                                    <img src={f.url} alt={`file-${fIdx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                  ) : (
                                    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                      <i className="ri-file-text-line text-2xl text-slate-400"></i>
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                                     <i className="ri-external-link-line text-white opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                  </div>
                               </a>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic">Belum ada file diunggah</p>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-slate-950 rounded-full"></div>
            <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">
              TIMELINE STATUS
            </h3>
          </div>

          <div className="flex flex-col gap-0 px-2">
            {timelineData.length > 0 ? (
              timelineData.map((item, idx) => {
                const isLast = idx === timelineData.length - 1;
                let displayDate = '-';
                let displayTime = '-';
                try {
                  const dateStr = item.datetime.includes(' ') ? item.datetime.replace(' ', 'T') : item.datetime;
                  const dateObj = new Date(dateStr);
                  displayDate = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
                  displayTime = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
                } catch(e) {}
                
                const statusUpper = item.status.toUpperCase();
                let dotColor = 'bg-blue-500';
                let bgColor = 'bg-blue-50/50';
                let textColor = 'text-blue-700';
                
                if (statusUpper.includes('TOLAK') || statusUpper.includes('GAGAL')) {
                  dotColor = 'bg-red-500'; bgColor = 'bg-red-50/50'; textColor = 'text-red-700';
                } else if (statusUpper.includes('SETUJU') || statusUpper.includes('SELESAI') || statusUpper.includes('TERBIT')) {
                  dotColor = 'bg-green-500'; bgColor = 'bg-green-50/50'; textColor = 'text-green-700';
                } else if (statusUpper.includes('BELUM')) {
                  dotColor = 'bg-slate-400'; bgColor = 'bg-slate-50'; textColor = 'text-slate-600';
                }

                return (
                  <div key={idx} className="relative flex gap-5">
                    {/* Vertical Connection Line */}
                    {!isLast && (
                      <div className="absolute left-[11px] top-8 bottom-[-8px] w-[2px] bg-slate-200"></div>
                    )}
                    
                    {/* Dot */}
                    <div className="relative mt-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white border-2 border-white shadow-sm ring-1 ring-slate-100 z-10 relative">
                         <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></div>
                      </div>
                    </div>
                    
                    {/* Content Box */}
                    <div className={`flex-1 p-4 rounded-xl border border-slate-100 mb-4 ${bgColor} transition-all`}>
                      <div className="flex justify-between items-start mb-2">
                        <p className={`text-[11px] font-extrabold ${textColor} uppercase tracking-wide mt-0.5`}>
                          {item.status}
                        </p>
                        <div className="text-right flex flex-col items-end">
                           <span className="text-[11px] font-bold text-slate-700">{displayTime}</span>
                           <span className="text-[10px] text-slate-500 font-medium">{displayDate}</span>
                        </div>
                      </div>
                      {item.note && (
                        <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200/50 pt-2 mt-1">
                          {item.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 border border-dashed border-border rounded-xl bg-slate-50/50">
                 <p className="text-sm font-medium text-slate-500">
                   {isLoading ? 'Memuat timeline...' : 'Tidak ada data timeline tersedia'}
                 </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
