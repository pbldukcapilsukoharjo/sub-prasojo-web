import React from 'react';

interface StatCardProps {
  title: string;
  value: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  icon?: string;
  iconBg?: string;
  iconColor?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg = '#fdf2f2',
  iconColor = 'text-primary',
  className = '',
  children
}: StatCardProps) {
  return (
    <div className={`card shadow-sm border border-gray-100 p-5 flex flex-col gap-4 bg-white ${className}`}>
      {/* Top: label + icon */}
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-bold text-gray-500 tracking-wider uppercase leading-snug pt-0.5">
          {title}
        </span>
        {icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: iconBg }}
          >
            <i className={`${icon} text-xl ${iconColor}`}></i>
          </div>
        )}
      </div>

      {/* Value + subtitle */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-end gap-2">
          {typeof value === 'string' || typeof value === 'number' ? (
             <p className="text-3xl font-bold font-manrope text-gray-900 leading-none">
               {value}
             </p>
          ) : (
            value
          )}
        </div>
        {subtitle && (
          <div className="text-[11px] text-gray-400 font-medium">
            {subtitle}
          </div>
        )}
      </div>
      
      {/* Custom children for things like progress bars */}
      {children}
    </div>
  );
}
