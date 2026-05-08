import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}: ButtonProps) {
  let variantClass = 'btn-primary';
  if (variant === 'secondary') variantClass = 'btn-secondary';
  else if (variant === 'ghost') variantClass = 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 shadow-none border-transparent';
  else if (variant === 'outline') variantClass = 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100';
  
  // Handling sizing
  let sizeClass = 'px-6 py-3 text-sm';
  if (size === 'sm') sizeClass = 'px-4 py-2 text-xs';
  if (size === 'lg') sizeClass = 'px-8 py-4 text-base';

  return (
    <button 
      className={`btn ${variantClass} ${sizeClass} ${className} flex items-center justify-center gap-2`}
      {...props}
    >
      {icon && iconPosition === 'left' && <i className={`${icon} text-lg leading-none`}></i>}
      {children}
      {icon && iconPosition === 'right' && <i className={`${icon} text-lg leading-none`}></i>}
    </button>
  );
}
