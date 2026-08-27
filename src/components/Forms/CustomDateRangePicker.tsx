import React, { useState, useRef, useEffect } from 'react';

interface CustomDateRangePickerProps {
  label?: string;
  startDate: string; // Format: YYYY-MM-DD
  endDate: string; // Format: YYYY-MM-DD
  onChange: (start: string, end: string) => void;
  disabled?: boolean;
  placeholder?: string;
  wrapperClassName?: string;
}

export default function CustomDateRangePicker({
  label,
  startDate,
  endDate,
  onChange,
  disabled = false,
  placeholder = 'Pilih Rentang Tanggal',
  wrapperClassName = '',
}: CustomDateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calendar view state (Month: 0-11, Year)
  const [viewYear, setViewYear] = useState(() => {
    const d = startDate ? new Date(startDate) : new Date();
    return d.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const d = startDate ? new Date(startDate) : new Date();
    return d.getMonth();
  });

  // Temporary selection states
  const [tempStart, setTempStart] = useState<string>(startDate);
  const [tempEnd, setTempEnd] = useState<string>(endDate);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<'month' | 'year' | null>(null);

  // Synchronize when the picker opens
  useEffect(() => {
    if (isOpen) {
      setTempStart(startDate);
      setTempEnd(endDate);
      const initialDate = startDate ? new Date(startDate) : new Date();
      setViewYear(initialDate.getFullYear());
      setViewMonth(initialDate.getMonth());
    }
  }, [isOpen, startDate, endDate]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format date display (DD/MM/YYYY)
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  // Format date for preview (e.g. 12 Nov 2026)
  const formatPreviewDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    const monthIndex = parseInt(m, 10) - 1;
    return `${parseInt(d, 10)} ${months[monthIndex]} ${y}`;
  };

  const getDisplayText = () => {
    if (startDate && endDate) {
      return `${formatDateDisplay(startDate)} - ${formatDateDisplay(endDate)}`;
    }
    return placeholder;
  };

  // Month navigation helpers
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // Sunday = 0

  // Generate day items for calendar grid
  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  const handleDayClick = (day: number) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${viewYear}-${formattedMonth}-${formattedDay}`;

    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(dateStr);
      setTempEnd('');
    } else {
      // tempStart exists, tempEnd does not
      if (dateStr < tempStart) {
        setTempStart(dateStr);
        setTempEnd('');
      } else {
        setTempEnd(dateStr);
      }
    }
  };

  const isDateSelected = (dateStr: string) => {
    return tempStart === dateStr || tempEnd === dateStr;
  };

  const isDateInRange = (dateStr: string) => {
    if (tempStart && tempEnd) {
      return dateStr > tempStart && dateStr < tempEnd;
    }
    if (tempStart && hoveredDate && !tempEnd) {
      return dateStr > tempStart && dateStr <= hoveredDate;
    }
    return false;
  };

  const handleApply = () => {
    if (tempStart && tempEnd) {
      onChange(tempStart, tempEnd);
    } else if (tempStart) {
      onChange(tempStart, tempStart);
    } else {
      onChange('', '');
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempStart('');
    setTempEnd('');
    onChange('', '');
    setIsOpen(false);
  };

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`} ref={dropdownRef}>
      {label && (
        <label className={`text-[10px] font-bold tracking-wider uppercase ${disabled ? 'text-text-secondary' : 'text-text-secondary'}`}>
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className={`w-full text-sm rounded-[30px] border h-[44px] flex items-center justify-between transition-all select-none
            ${disabled ? 'bg-gray-100 text-text-secondary cursor-not-allowed' : 'bg-[var(--surface-secondary)] text-text-primary cursor-pointer hover:border-gray-300'}
            ${isOpen ? 'bg-surface' : ''}
            ${isOpen || startDate || endDate ? 'ring-2 ring-primary border-primary' : (disabled ? 'border-neutral' : 'border-[#E5E7EB]')}
            pl-11 pr-4`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i className={`ri-calendar-line ${disabled ? 'text-gray-300' : 'text-text-secondary'} text-lg`}></i>
          </div>
          <span className="truncate text-xs font-semibold">
            {startDate || endDate ? (
              getDisplayText()
            ) : (
              <span className="text-text-secondary font-medium">{placeholder}</span>
            )}
          </span>
          <i className={`ri-arrow-down-s-line text-xl transition-transform ${isOpen ? 'rotate-180 text-primary' : 'text-text-secondary'}`}></i>
        </div>

        {/* Calendar Dropdown */}
        {isOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 lg:right-0 lg:left-auto w-[320px] bg-surface border border-border rounded-[16px] shadow-lg z-[100] p-4 animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* Real-time Preview Section */}
            <div className="bg-background border border-border rounded-xl p-2.5 mb-3 flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Preview Tanggal</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary">
                <i className="ri-calendar-check-line text-primary text-base"></i>
                {tempStart ? (
                  <span className="truncate">
                    {formatPreviewDate(tempStart)}
                    <span className="mx-1.5 text-text-secondary font-medium"> s/d </span>
                    {tempEnd ? (
                      formatPreviewDate(tempEnd)
                    ) : (
                      <span className="text-primary animate-pulse font-semibold">Pilih Tanggal Akhir...</span>
                    )}
                  </span>
                ) : (
                  <span className="text-text-secondary font-medium">Pilih tanggal awal...</span>
                )}
              </div>
            </div>

            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary/5 hover:text-primary transition-colors text-text-secondary cursor-pointer"
              >
                <i className="ri-arrow-left-s-line text-lg"></i>
              </button>
              <div className="flex items-center gap-1 relative">
                {openDropdown && (
                  <div className="fixed inset-0 z-[100]" onClick={() => setOpenDropdown(null)} />
                )}
                
                {/* Month Picker */}
                <div className="relative z-[101]">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === 'month' ? null : 'month')}
                    className="text-sm font-bold text-text-primary hover:bg-gray-100 rounded px-2 py-1 flex items-center gap-1"
                  >
                    {monthNames[viewMonth]}
                    <i className={`ri-arrow-down-s-line text-text-secondary transition-transform ${openDropdown === 'month' ? 'rotate-180 text-primary' : ''}`}></i>
                  </button>
                  {openDropdown === 'month' && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-36 max-h-[250px] overflow-y-auto bg-surface border border-border rounded-xl shadow-lg py-1 custom-scrollbar">
                      {monthNames.map((month, idx) => (
                        <div
                          key={month}
                          className={`px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-background ${
                            viewMonth === idx ? 'text-primary font-bold bg-primary/5' : 'text-text-secondary font-medium'
                          }`}
                          onClick={() => {
                            setViewMonth(idx);
                            setOpenDropdown(null);
                          }}
                        >
                          {month}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Year Picker */}
                <div className="relative z-[101]">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}
                    className="text-sm font-bold text-text-primary hover:bg-gray-100 rounded px-2 py-1 flex items-center gap-1"
                  >
                    {viewYear}
                    <i className={`ri-arrow-down-s-line text-text-secondary transition-transform ${openDropdown === 'year' ? 'rotate-180 text-primary' : ''}`}></i>
                  </button>
                  {openDropdown === 'year' && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-24 max-h-[250px] overflow-y-auto bg-surface border border-border rounded-xl shadow-lg py-1 custom-scrollbar">
                      {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - 25 + i).map((year) => (
                        <div
                          key={year}
                          className={`px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-background text-center ${
                            viewYear === year ? 'text-primary font-bold bg-primary/5' : 'text-text-secondary font-medium'
                          }`}
                          onClick={() => {
                            setViewYear(year);
                            setOpenDropdown(null);
                          }}
                        >
                          {year}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary/5 hover:text-primary transition-colors text-text-secondary cursor-pointer"
              >
                <i className="ri-arrow-right-s-line text-lg"></i>
              </button>
            </div>

            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                <span key={day} className="text-[10px] font-bold text-text-secondary uppercase">
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {daysArray.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square"></div>;
                }

                const formattedMonth = String(viewMonth + 1).padStart(2, '0');
                const formattedDay = String(day).padStart(2, '0');
                const dateStr = `${viewYear}-${formattedMonth}-${formattedDay}`;

                const selected = isDateSelected(dateStr);
                const inRange = isDateInRange(dateStr);

                return (
                  <button
                    key={`day-${day}`}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    onMouseEnter={() => tempStart && !tempEnd && setHoveredDate(dateStr)}
                    onMouseLeave={() => setHoveredDate(null)}
                    className={`aspect-square text-xs font-semibold rounded-full flex items-center justify-center transition-all cursor-pointer relative
                      ${selected 
                        ? 'bg-primary text-white font-bold z-10 shadow-sm' 
                        : inRange 
                          ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                          : 'text-text-secondary hover:bg-gray-100'
                      }`}
                  >
                    {day}
                    {/* Visual range connector helper */}
                    {inRange && !selected && (
                      <span className="absolute inset-0 bg-primary/5 -z-10 rounded-none"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between border-t border-border mt-4 pt-3 gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-bold text-primary hover:text-primary-hover transition-colors px-2 py-1.5 cursor-pointer"
              >
                Hapus
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-xs font-bold text-text-secondary hover:bg-gray-100 rounded-[30px] border border-neutral px-3 py-1.5 transition-colors cursor-pointer bg-surface"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-[30px] px-3 py-1.5 transition-colors cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
