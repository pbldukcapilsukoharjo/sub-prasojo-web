import React, { useEffect, useState } from 'react';
import { pengajuanService, TimelineDetail } from '@/services/pengajuan.service';
import { slaService } from '@/services/sla.service';
import { handleApiError } from '@/lib/api-error';
import toast from 'react-hot-toast';
import CustomSelect from '@/components/Forms/CustomSelect';
import { useQueryClient } from '@tanstack/react-query';

interface DetailModalProps {
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

export default function DetailModal({ isOpen, onClose, data }: DetailModalProps) {
  const [timelineData, setTimelineData] = useState<TimelineDetail[]>([]);
  const [timelineStatus, setTimelineStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const [targetSlaValue, setTargetSlaValue] = useState<number>(0);
  const [targetSlaUnit, setTargetSlaUnit] = useState<string>('jam');
  const [targetSlaMenit, setTargetSlaMenit] = useState<number>(0);
  const [isEditingSla, setIsEditingSla] = useState(false);
  const [isSavingSla, setIsSavingSla] = useState(false);
  
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen && data?.id) {
      fetchDetail(data.id);
      fetchSlaTarget(data.id);
      setIsEditingSla(false);
    } else {
      setTimelineData([]);
      setTimelineStatus('');
      setTargetSlaValue(0);
    }
  }, [isOpen, data?.id]);

  const fetchSlaTarget = async (id: number) => {
    try {
      const res = await slaService.getAjuanSlaTarget(id);
      if (res.data) {
        setTargetSlaValue(res.data.target_sla_value);
        setTargetSlaUnit(res.data.target_sla_unit);
        setTargetSlaMenit(res.data.target_sla_menit || 0);
      }
    } catch (error) {
      console.error("Failed to fetch SLA target", error);
    }
  };

  const handleSaveSla = async () => {
    if (!data?.id) return;
    setIsSavingSla(true);
    try {
      await slaService.updateAjuanSlaTarget(data.id, {
        target_sla_value: targetSlaValue,
        target_sla_unit: targetSlaUnit
      });
      toast.success('Target SLA berhasil diperbarui');
      setIsEditingSla(false);
      fetchSlaTarget(data.id); // Refresh data to get new target_sla_menit
      queryClient.invalidateQueries({ queryKey: ['ajuan'] }); // Invalidate list queries
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSavingSla(false);
    }
  };

  const fetchDetail = async (id: number) => {
    setIsLoading(true);
    try {
      const res = await pengajuanService.getPengajuanDetail(id);
      if (res.status && res.data) {
        setTimelineData(res.data.timeline || []);
        setTimelineStatus(res.data.status_saat_ini || '');
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
      {/* Modal overlay with glassmorphism backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 transition-opacity"
        onClick={onClose}
      />
      
      <div className={`bg-surface rounded-2xl w-full max-w-[680px] p-6 lg:p-8 relative z-10 shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200 m-4 max-h-[90vh] overflow-y-auto transition-opacity ${isLoading ? 'opacity-70 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-border">
              <i className="ri-user-line text-xl text-slate-600"></i>
            </div>
            <h2 className="text-[18px] font-bold text-slate-950 font-manrope">
              Detail Pemohon : {data.noRegis}
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
        <div className="border border-border rounded-[16px] p-6 mb-8 bg-surface shadow-xs">
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

        {/* Target SLA */}
        <div className="border border-border rounded-[16px] p-6 mb-8 bg-surface shadow-xs relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider flex items-center gap-2">
              <i className="ri-focus-2-line text-lg text-primary"></i>
              TARGET SLA AJUAN
            </h3>
            {!isEditingSla ? (
              <button onClick={() => setIsEditingSla(true)} className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
                <i className="ri-edit-line mr-1"></i>Ubah Target
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => setIsEditingSla(false)} className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors" disabled={isSavingSla}>
                  Batal
                </button>
                <button onClick={handleSaveSla} className="text-xs font-bold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-lg" disabled={isSavingSla}>
                  {isSavingSla ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {!isEditingSla ? (
              <div className="flex flex-col">
                <div className="text-2xl font-bold text-primary">
                  {targetSlaValue > 0 ? `${targetSlaValue} ${targetSlaUnit}` : '-'}
                </div>
                {targetSlaMenit > 0 && (
                  <span className="text-xs font-semibold text-text-secondary mt-1">Ekuivalen: {targetSlaMenit} Menit</span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 w-full sm:w-2/3">
                <input 
                  type="number"
                  value={targetSlaValue}
                  onChange={(e) => setTargetSlaValue(Number(e.target.value))}
                  className="w-20 text-center text-lg font-bold text-slate-900 bg-white border border-border rounded-lg p-2 outline-none focus:border-primary"
                />
                <div className="w-32">
                  <CustomSelect 
                    options={[
                      { label: 'Menit', value: 'menit' },
                      { label: 'Jam', value: 'jam' },
                      { label: 'Hari', value: 'hari' }
                    ]}
                    value={targetSlaUnit}
                    onChange={(val) => setTargetSlaUnit(String(val))}
                    className="!bg-white !min-h-[46px]"
                  />
                </div>
              </div>
            )}
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
