import React, { useState, useEffect, useMemo } from 'react';
import Button from '@/components/Common/Button';
import Input from '@/components/Forms/Input';
import CustomSelect from '@/components/Forms/CustomSelect';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { slaService, OperationalHour } from '@/services/sla.service';
import { handleApiError } from '@/lib/api-error';
import toast from 'react-hot-toast';

interface SlaConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlaTarget?: number;
}

interface JamKerjaState {
  id: number;
  hari_kode: number;
  day: string;
  isActive: boolean;
  open: string;
  close: string;
}

export default function SlaConfigModal({ isOpen, onClose, currentSlaTarget = 6 }: SlaConfigModalProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('jam_kerja');

  const [jamKerja, setJamKerja] = useState<JamKerjaState[]>([]);
  const [targetSla, setTargetSla] = useState(currentSlaTarget);
  const [targetSlaUnit, setTargetSlaUnit] = useState('jam');
  const [isSaving, setIsSaving] = useState(false);

  // Custom Holiday State (UI Only for now)
  const [customHolidays, setCustomHolidays] = useState<{ id: string, date: string, description: string }[]>([
    { id: '1', date: '2026-08-17', description: 'Hari Kemerdekaan RI' }
  ]);
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayDesc, setNewHolidayDesc] = useState('');

  // Fetch Operational Hours
  const { data: opHoursRes, isLoading: isOpHoursLoading } = useQuery({
    queryKey: ['operationalHours'],
    queryFn: () => slaService.getOperationalHours(),
    enabled: isOpen,
  });

  useEffect(() => {
    if (opHoursRes?.data) {
      const mapped = opHoursRes.data.map(item => {
        // Handle times like "08:00:00" to "08:00"
        const openTime = item.jam_buka ? item.jam_buka.substring(0, 5) : '08:00';
        const closeTime = item.jam_tutup ? item.jam_tutup.substring(0, 5) : '16:00';
        return {
          id: item.id,
          hari_kode: item.hari_kode,
          day: item.hari_nama,
          isActive: !item.is_libur,
          open: openTime,
          close: closeTime,
        };
      });
      setJamKerja(mapped);
    }
  }, [opHoursRes]);

  // Fetch SLA Target
  const { data: slaTargetRes, isLoading: isSlaTargetLoading, isSuccess: isSlaTargetSuccess } = useQuery({
    queryKey: ['slaTarget'],
    queryFn: () => slaService.getSlaTarget(),
    enabled: isOpen,
    staleTime: Infinity,
  });

  // Sync target SLA
  useEffect(() => {
    if (isOpen) {
      if (isSlaTargetSuccess && slaTargetRes?.data) {
        setTargetSla(slaTargetRes.data.sla_target_value);
        setTargetSlaUnit(slaTargetRes.data.sla_target_unit);
      } else if (!isSlaTargetSuccess) {
        setTargetSla(currentSlaTarget);
      }
    }
  }, [isOpen, currentSlaTarget, isSlaTargetSuccess, slaTargetRes]);

  // Stop body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'jam_kerja', label: <span className="flex items-center gap-2"><i className="ri-time-line text-lg"></i> Jam Kerja</span> },
    { id: 'hari_libur', label: <span className="flex items-center gap-2"><i className="ri-calendar-event-line text-lg"></i> Hari Libur</span> },
    { id: 'target_sla', label: <span className="flex items-center gap-2"><i className="ri-focus-2-line text-lg"></i> Target SLA</span> },
  ];

  const calculateDuration = (open: string, close: string) => {
    if (!open || !close) return '0j 0m';
    const [openH, openM] = open.split(':').map(Number);
    const [closeH, closeM] = close.split(':').map(Number);
    let diffM = (closeH * 60 + closeM) - (openH * 60 + openM);
    if (diffM < 0) diffM = 0;
    const h = Math.floor(diffM / 60);
    const m = diffM % 60;
    return `${h}j ${m}m`;
  };

  const handleToggleDay = (index: number) => {
    const newJamKerja = [...jamKerja];
    newJamKerja[index].isActive = !newJamKerja[index].isActive;
    setJamKerja(newJamKerja);
  };

  const handleTimeChange = (index: number, field: 'open' | 'close', value: string) => {
    const newJamKerja = [...jamKerja];
    newJamKerja[index][field] = value;
    setJamKerja(newJamKerja);
  };



  const handleSave = async () => {
    try {
      setIsSaving(true);
      let successMessage = 'Konfigurasi berhasil disimpan.';
      
      // Update Target SLA
      const targetRes = await slaService.updateSlaTarget({
        sla_target_value: targetSla,
        sla_target_unit: targetSlaUnit
      });
      
      if (targetRes && (targetRes as any).message) {
        successMessage = (targetRes as any).message;
      }

      // Update Operational Hours (only those that changed)
      if (opHoursRes?.data) {
        const promises = [];
        for (const current of jamKerja) {
          const original = opHoursRes.data.find(o => o.id === current.id);
          if (original) {
            const originalOpen = original.jam_buka ? original.jam_buka.substring(0, 5) : '08:00';
            const originalClose = original.jam_tutup ? original.jam_tutup.substring(0, 5) : '16:00';
            
            // Check if changed
            if (
              original.is_libur === current.isActive || 
              originalOpen !== current.open || 
              originalClose !== current.close
            ) {
              const formatTime = (timeStr: string) => {
                if (!timeStr) return "00:00:00";
                const parts = timeStr.split(':');
                const h = (parts[0] || '00').padStart(2, '0');
                const m = (parts[1] || '00').padStart(2, '0');
                const s = (parts[2] || '00').padStart(2, '0');
                return `${h}:${m}:${s}`;
              };

              promises.push(
                slaService.updateOperationalHour(current.id, {
                  is_libur: !current.isActive,
                  jam_buka: formatTime(current.open),
                  jam_tutup: formatTime(current.close)
                }).then(res => {
                  if (res && (res as any).message) {
                    successMessage = (res as any).message;
                  }
                  return res;
                })
              );
            }
          }
        }
        await Promise.all(promises);
      }

      // Recalculate SLA
      await slaService.recalculateSla();
      
      queryClient.invalidateQueries({ queryKey: ['operationalHours'] });
      queryClient.invalidateQueries({ queryKey: ['slaKpi'] });
      queryClient.invalidateQueries({ queryKey: ['slaList'] });
      queryClient.invalidateQueries({ queryKey: ['slaTarget'] });

      toast.success(successMessage);
      onClose();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-surface rounded-2xl w-full max-w-[700px] shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Konfigurasi Jam Layanan & SLA</h2>
            <p className="text-sm text-text-secondary mt-1">Atur jam operasional, hari libur, dan target waktu SLA</p>
          </div>
          <button 
            onClick={onClose}
            disabled={isSaving}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-text-secondary transition-colors cursor-pointer disabled:opacity-50"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 flex items-center gap-8 border-b border-border">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 text-sm font-bold transition-colors relative ${
                  isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-md"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          {((isOpHoursLoading && activeTab !== 'target_sla') || (isSlaTargetLoading && activeTab === 'target_sla')) ? (
            <div className="flex items-center justify-center py-10">
              <i className="ri-loader-4-line animate-spin text-3xl text-primary"></i>
            </div>
          ) : (
            <>
              {activeTab === 'jam_kerja' && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                  <p className="text-sm text-text-secondary mb-2">
                    Centang hari yang aktif dan atur jam buka-tutup layanan. Pengajuan di luar jam ini dihitung SLA mulai hari kerja berikutnya.
                  </p>
                  <div className="flex flex-col gap-3">
                    {jamKerja.map((day, idx) => (
                      <div key={day.day} className={`flex items-center justify-between p-4 rounded-xl border ${day.isActive ? 'border-primary/20 bg-primary/5' : 'border-border bg-gray-50/50 opacity-60'} transition-all`}>
                        <div className="flex items-center gap-4 w-32">
                          <div 
                            className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer border ${day.isActive ? 'bg-primary border-primary text-white' : 'border-neutral bg-white'}`}
                            onClick={() => handleToggleDay(idx)}
                          >
                            {day.isActive && <i className="ri-check-line text-sm"></i>}
                          </div>
                          <span className={`font-bold ${day.isActive ? 'text-text-primary' : 'text-text-secondary'}`}>{day.day}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-sm text-text-secondary w-10">Buka</span>
                          <input 
                            type="time" 
                            value={day.open} 
                            onChange={(e) => handleTimeChange(idx, 'open', e.target.value)}
                            disabled={!day.isActive}
                            className="border border-border rounded-lg px-3 py-1.5 text-sm font-semibold bg-white w-[110px] outline-none focus:border-primary disabled:opacity-50" 
                          />
                          <span className="text-sm text-text-secondary text-center w-8">—</span>
                          <span className="text-sm text-text-secondary w-10">Tutup</span>
                          <input 
                            type="time" 
                            value={day.close} 
                            onChange={(e) => handleTimeChange(idx, 'close', e.target.value)}
                            disabled={!day.isActive}
                            className="border border-border rounded-lg px-3 py-1.5 text-sm font-semibold bg-white w-[110px] outline-none focus:border-primary disabled:opacity-50" 
                          />
                        </div>

                        <div className="text-sm text-text-secondary font-medium w-16 text-right">
                          {calculateDuration(day.open, day.close)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'hari_libur' && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                  <p className="text-sm text-text-secondary mb-2">
                    Tambahkan hari libur operasional (non-aktif). Hari libur tidak dihitung dalam kalkulasi SLA.
                  </p>
                  
                  <div className="bg-gray-50 p-5 rounded-xl border border-border flex flex-col gap-4">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Tetapkan Hari Libur</span>
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <Input
                          label="Tanggal"
                          type="date"
                          value={newHolidayDate}
                          onChange={(e) => setNewHolidayDate(e.target.value)}
                        />
                      </div>
                      <div className="flex-[2]">
                        <Input
                          label="Keterangan"
                          type="text"
                          placeholder="Contoh: Libur Nasional"
                          value={newHolidayDesc}
                          onChange={(e) => setNewHolidayDesc(e.target.value)}
                        />
                      </div>
                      <Button 
                        variant="primary" 
                        className="!h-[46px]" 
                        icon="ri-add-line" 
                        iconPosition="left" 
                        onClick={() => {
                          if (newHolidayDate && newHolidayDesc) {
                            setCustomHolidays([...customHolidays, { id: Date.now().toString(), date: newHolidayDate, description: newHolidayDesc }]);
                            setNewHolidayDate('');
                            setNewHolidayDesc('');
                          }
                        }} 
                        disabled={!newHolidayDate || !newHolidayDesc}
                      >
                        Tambah
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mt-2">
                    {customHolidays.length > 0 ? (
                      customHolidays.map((holiday) => (
                        <div key={holiday.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-white hover:border-gray-300 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-danger/10 text-danger flex flex-col items-center justify-center">
                              <span className="text-sm font-bold leading-none">{new Date(holiday.date).getDate()}</span>
                              <span className="text-[10px] uppercase font-semibold mt-0.5">{new Date(holiday.date).toLocaleString('id-ID', { month: 'short' })}</span>
                            </div>
                            <div>
                              <div className="font-bold text-text-primary text-base">{holiday.description}</div>
                              <div className="text-xs text-text-secondary mt-0.5">
                                {new Date(holiday.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setCustomHolidays(customHolidays.filter(h => h.id !== holiday.id));
                            }}
                            className="w-9 h-9 rounded flex items-center justify-center text-gray-400 hover:text-danger hover:bg-danger/10 transition-colors opacity-0 group-hover:opacity-100"
                            title="Hapus hari libur"
                          >
                            <i className="ri-delete-bin-line text-lg"></i>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-text-secondary text-sm border border-dashed border-border rounded-xl">
                        Belum ada hari libur yang ditetapkan
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'target_sla' && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                  <p className="text-sm text-text-secondary mb-2">
                    Target SLA adalah batas waktu maksimal penyelesaian pelayanan yang ditetapkan sebagai acuan pengukuran kinerja.
                  </p>
                  
                  <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20 flex flex-col items-center justify-center gap-6 mt-2">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <i className="ri-focus-2-line text-2xl"></i>
                      </div>
                      <span className="font-bold text-primary">Target Waktu SLA</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-primary">&lt;</span>
                      <div className="w-24">
                        <input 
                          type="number" 
                          value={targetSla}
                          onChange={(e) => setTargetSla(Number(e.target.value))}
                          className="w-full text-center text-3xl font-bold text-primary bg-white border-2 border-primary rounded-xl p-2 outline-none"
                        />
                      </div>
                      <div className="w-32">
                        <CustomSelect 
                          options={[
                            { label: 'Jam', value: 'jam' },
                            { label: 'Hari', value: 'hari' }
                          ]}
                          value={targetSlaUnit}
                          onChange={(val) => setTargetSlaUnit(String(val))}
                          className="!h-[52px] font-bold text-lg border-2 border-primary"
                        />
                      </div>
                    </div>

                    <p className="text-sm text-text-secondary text-center mt-2">
                      Setiap layanan harus diselesaikan dalam waktu kurang dari <strong className="text-primary">{targetSla} {targetSlaUnit}</strong> sejak pengajuan diterima.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5 border border-border mt-4 flex flex-col gap-3">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Referensi Standar</span>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-secondary font-medium">Standar Layanan Nasional</span>
                      <span className="font-bold text-text-primary">6 jam</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-secondary font-medium">Pelayanan Administrasi Kependudukan</span>
                      <span className="font-bold text-text-primary">1 hari kerja</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text-secondary font-medium">Dokumen Kependudukan Khusus</span>
                      <span className="font-bold text-text-primary">14 hari kerja</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-border flex justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving || isOpHoursLoading || isSlaTargetLoading}>
            {isSaving ? <i className="ri-loader-4-line animate-spin"></i> : 'Simpan Konfigurasi'}
          </Button>
        </div>
      </div>
    </div>
  );
}
