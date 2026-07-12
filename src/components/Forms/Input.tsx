import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  wrapperClassName?: string;
}

export default function Input({ label, icon, wrapperClassName = '', className = '', ...props }: InputProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && <label className="text-[10px] font-bold text-text-secondary tracking-wider uppercase">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <i className={`${icon} text-text-secondary text-lg`}></i>
          </div>
        )}
        <input
          className={`w-full bg-[var(--surface-secondary)] text-text-primary text-sm rounded-[30px] border border-[#E5E7EB] h-[44px] focus:ring-2 focus:ring-primary focus:outline-none transition-all ${
            icon ? 'pl-11' : 'pl-5'
          } pr-5 ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}
