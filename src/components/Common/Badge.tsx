import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'pending' | 'success' | 'warning' | 'danger' | 'default' | 'outline-warning';
  className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  let variantClass = '';

  switch (variant) {
    case 'pending':
    case 'default':
      variantClass = 'bg-gray-100 text-gray-500 border-gray-200';
      break;
    case 'outline-warning':
      variantClass = 'bg-transparent text-[#D97706] border-[#D97706]';
      break;
    case 'success':
      variantClass = 'bg-green-100 text-green-700 border-green-200';
      break;
    case 'warning':
      variantClass = 'bg-yellow-100 text-yellow-700 border-yellow-200';
      break;
    case 'danger':
      variantClass = 'bg-red-100 text-red-700 border-red-200';
      break;
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${variantClass} ${className}`}>
      {children}
    </span>
  );
}
