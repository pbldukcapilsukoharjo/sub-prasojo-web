import React, { useState, useRef, useEffect } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  label?: string;
  options: SelectOption[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  placeholder?: string;
  icon?: string;
  disabled?: boolean;
  wrapperClassName?: string;
  className?: string;
}

export default function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Pilih...',
  icon,
  disabled = false,
  wrapperClassName = '',
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`} ref={dropdownRef}>
      {label && <label className={`text-[10px] font-bold tracking-wider uppercase ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <i className={`${icon} ${disabled ? 'text-gray-300' : 'text-gray-400'} text-lg`}></i>
          </div>
        )}
        <div
          className={`w-full text-sm rounded-[30px] border h-[44px] flex items-center justify-between transition-all select-none
            ${disabled ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[var(--surface-secondary)] border-[#E5E7EB] text-gray-900 cursor-pointer hover:border-gray-300'}
            ${isOpen ? 'ring-2 ring-primary border-primary' : ''}
            ${icon ? 'pl-11' : 'pl-5'} pr-4 ${className}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className="truncate">{selectedOption ? selectedOption.label : <span className="text-gray-400">{placeholder}</span>}</span>
          <i className={`ri-arrow-down-s-line text-xl transition-transform ${isOpen ? 'rotate-180 text-primary' : 'text-gray-400'}`}></i>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 rounded-[16px] shadow-lg z-[100] py-2 max-h-[250px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-gray-50 flex items-center justify-between
                  ${option.value === value ? 'text-primary font-bold bg-primary/5' : 'text-gray-700 font-medium'}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
                {option.value === value && <i className="ri-check-line text-primary text-lg"></i>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
