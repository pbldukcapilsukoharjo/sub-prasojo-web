import React from 'react';

interface TimelineStep {
  label: string;
  date: string;
  time: string;
  status: 'completed' | 'current' | 'pending';
  colorClass: string;
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    noRegis: string;
    namaLengkap: string;
    nik: string;
    jenisLayanan: string;
    kecamatan: string;
    timeline: TimelineStep[];
  } | null;
}

export default function DetailModal({ isOpen, onClose, data }: DetailModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Modal overlay without blur */}
      <div 
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />
      
      <div className="bg-white rounded-2xl w-full max-w-[600px] p-6 lg:p-8 relative z-10 shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200 m-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
              <i className="ri-user-line text-xl text-gray-600"></i>
            </div>
            <h2 className="text-[18px] font-bold text-gray-900">
              Detail Pemohon :{data.noRegis}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-900 hover:bg-gray-100 rounded-lg p-1.5 transition-colors self-start"
          >
            <i className="ri-close-line text-xl font-bold"></i>
          </button>
        </div>

        {/* Info Card */}
        <div className="border border-gray-200 rounded-[16px] p-6 mb-8">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-[10px] font-bold text-gray-900 mb-2">Nama Lengkap</p>
              <p className="text-sm font-bold text-gray-900">{data.namaLengkap}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-900 mb-2">NIK</p>
              <p className="text-sm font-bold text-gray-900">{data.nik}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-900 mb-2">Jenis Layanan</p>
              <p className="text-sm font-bold text-gray-900">{data.jenisLayanan}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-900 mb-2">Kecamatan</p>
              <p className="text-sm font-bold text-gray-900">{data.kecamatan}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-gray-900"></div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              TIMELINE STATUS
            </h3>
          </div>

          <div className="flex items-start">
            {data.timeline.map((step, idx) => {
              const isLast = idx === data.timeline.length - 1;
              let dotColor = 'bg-gray-800';
              let textColor = 'text-gray-900';
              let lineColor = 'bg-gray-800';
              let bgColor = 'bg-gray-50';

              if (step.colorClass === 'blue') {
                dotColor = 'bg-blue-500';
                textColor = 'text-blue-500';
                lineColor = 'bg-blue-500';
                bgColor = 'bg-blue-50/50';
              } else if (step.colorClass === 'green') {
                dotColor = 'bg-green-500';
                textColor = 'text-green-500';
                lineColor = 'bg-green-500';
                bgColor = 'bg-green-50/50';
              } else if (step.colorClass === 'gray') {
                dotColor = 'bg-gray-500';
                textColor = 'text-gray-500';
                lineColor = 'bg-gray-500';
                bgColor = 'bg-gray-100/50';
              }

              return (
                <div key={idx} className="flex-1 relative">
                  {/* Line */}
                  {!isLast && (
                    <div className={`absolute top-[5px] left-[5px] right-[-5px] h-[2px] ${lineColor}`}></div>
                  )}
                  {/* Dot */}
                  <div className={`relative w-3 h-3 rounded-full ${dotColor} mb-2 z-10`}></div>
                  {/* Content Box */}
                  <div className={`mr-2 p-3 ${bgColor} border-l-[3px] border-transparent mt-2 rounded-r-md min-h-[70px]`}>
                    <p className={`text-xs font-bold ${textColor} mb-1`}>{step.label}</p>
                    <p className="text-[10px] font-semibold text-gray-500 leading-tight">
                      {step.time},<br/>{step.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
