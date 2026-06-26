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
    timeline?: TimelineStep[];
    status?: string;
    tanggal?: string;
    waktu?: string;
  } | null;
}

export default function DetailModal({ isOpen, onClose, data }: DetailModalProps) {
  if (!isOpen || !data) return null;

  // Normalize status and determine active step count
  const statusStr = data.status || '';
  const normalizedStatus = statusStr.toUpperCase();
  
  let activeCount = 1;
  if (normalizedStatus === 'DIVERIFIKASI') {
    activeCount = 2;
  } else if (normalizedStatus === 'DISETUJUI' || normalizedStatus === 'DITOLAK') {
    activeCount = 3;
  } else if (normalizedStatus === 'DIPROSES') {
    activeCount = 4;
  } else if (normalizedStatus === 'SIAP DIDOWNLOAD' || normalizedStatus === 'SELESAI') {
    activeCount = 5;
  } else {
    // Fallback to timeline length if status is not explicitly set
    if (data.timeline && data.timeline.length > 0) {
      activeCount = data.timeline.length;
    }
  }

  const isRejected = normalizedStatus === 'DITOLAK';

  // Define the 5 sequential steps
  const steps = [
    { label: 'Ajuan Dibuat', colorClass: 'gray', textColor: 'text-gray-900 border-gray-900' },
    { label: 'Diverifikasi', colorClass: 'blue', textColor: 'text-blue-500 border-blue-500' },
    { label: isRejected ? 'Ditolak' : 'Disetujui', colorClass: isRejected ? 'red' : 'green', textColor: isRejected ? 'text-red-500 border-red-500' : 'text-green-500 border-green-500' },
    { label: 'Diproses', colorClass: 'slate', textColor: 'text-slate-600 border-slate-600' },
    { label: 'Siap Didownload', colorClass: 'purple', textColor: 'text-purple-600 border-purple-600' },
  ];

  // Helper to format date and time
  const displayDate = data.tanggal || '';
  const displayTime = data.waktu ? data.waktu.replace(' WIB', '') : '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Modal overlay with glassmorphism backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      
      <div className="bg-white rounded-2xl w-full max-w-[680px] p-6 lg:p-8 relative z-10 shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200 m-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
              <i className="ri-user-line text-xl text-slate-600"></i>
            </div>
            <h2 className="text-[18px] font-bold text-slate-950 font-manrope">
              Detail Pemohon : {data.noRegis}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-full p-2 transition-colors self-start cursor-pointer"
          >
            <i className="ri-close-line text-xl font-bold"></i>
          </button>
        </div>

        {/* Info Card */}
        <div className="border border-slate-100 rounded-[16px] p-6 mb-8 bg-white shadow-xs">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Nama Lengkap</p>
              <p className="text-sm font-bold text-slate-900">{data.namaLengkap}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">NIK</p>
              <p className="text-sm font-bold text-slate-900">{data.nik}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Jenis Layanan</p>
              <p className="text-sm font-bold text-slate-900">{data.jenisLayanan}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Kecamatan</p>
              <p className="text-sm font-bold text-slate-900">{data.kecamatan}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-slate-950 rounded-full"></div>
            <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">
              TIMELINE STATUS
            </h3>
          </div>

          <div className="flex items-start">
            {steps.map((step, idx) => {
              const isActive = idx < activeCount;
              const isLast = idx === steps.length - 1;

              // Determine dot color
              let dotColor = 'bg-slate-200';
              if (isActive) {
                if (step.colorClass === 'blue') dotColor = 'bg-blue-500';
                else if (step.colorClass === 'green') dotColor = 'bg-green-500';
                else if (step.colorClass === 'red') dotColor = 'bg-red-500';
                else if (step.colorClass === 'purple') dotColor = 'bg-purple-600';
                else dotColor = 'bg-slate-950';
              }

              // Determine box background color
              let bgColor = 'bg-slate-50';
              if (isActive) {
                if (step.colorClass === 'blue') bgColor = 'bg-blue-50/50';
                else if (step.colorClass === 'green') bgColor = 'bg-green-50/50';
                else if (step.colorClass === 'red') bgColor = 'bg-red-50/50';
                else if (step.colorClass === 'purple') bgColor = 'bg-purple-50/50';
              }

              // Determine line color to the next step
              const isNextActive = idx + 1 < activeCount;
              let lineColor = 'bg-slate-100';
              if (isNextActive) {
                const nextStep = steps[idx + 1];
                if (nextStep.colorClass === 'blue') lineColor = 'bg-blue-500';
                else if (nextStep.colorClass === 'green') lineColor = 'bg-green-500';
                else if (nextStep.colorClass === 'red') lineColor = 'bg-red-500';
                else if (nextStep.colorClass === 'purple') lineColor = 'bg-purple-600';
                else lineColor = 'bg-slate-950';
              }

              return (
                <div key={idx} className="flex-1 relative">
                  {/* Connection Line */}
                  {!isLast && (
                    <div className={`absolute top-[5px] left-[5px] right-[-5px] h-[2px] ${lineColor} z-0 transition-all duration-300`}></div>
                  )}
                  
                  {/* Dot */}
                  <div className={`relative w-3 h-3 rounded-full ${dotColor} mb-2 z-10 transition-all duration-300 shadow-xs`}></div>
                  
                  {/* Content Box or Empty Space */}
                  {isActive ? (
                    <div className={`mr-2 p-3 ${bgColor} border-l-[3px] border-transparent mt-2 rounded-r-md min-h-[72px] transition-all duration-300 flex flex-col justify-center`}>
                      <p className={`text-[11px] font-extrabold ${step.textColor} mb-1 leading-tight`}>
                        {step.label}
                      </p>
                      <p className="text-[9px] font-bold text-slate-500 leading-normal">
                        {displayTime},<br/>{displayDate}
                      </p>
                    </div>
                  ) : (
                    // Space kosong for unreached steps
                    <div className="mr-2 min-h-[72px] mt-2 transition-all duration-300"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

