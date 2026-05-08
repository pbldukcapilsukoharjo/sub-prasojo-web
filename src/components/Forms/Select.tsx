import React, { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  icon?: string;
  wrapperClassName?: string;
}

export default function Select({ label, options, icon, wrapperClassName = '', className = '', ...props }: SelectProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && <label className="text-[10px] font-bold text-gray-700 tracking-wider uppercase">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <i className={`${icon} text-gray-400 text-lg`}></i>
          </div>
        )}
        <select
          className={`w-full bg-[var(--surface-secondary)] text-gray-900 text-sm rounded-[30px] border border-[#E5E7EB] h-[44px] focus:ring-2 focus:ring-primary focus:outline-none appearance-none transition-all cursor-pointer ${
            icon ? 'pl-11' : 'pl-5'
          } pr-11 ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
          <i className="ri-arrow-down-s-line text-gray-400 text-xl"></i>
        </div>
      </div>
    </div>
  );
}
