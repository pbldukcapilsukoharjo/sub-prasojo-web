'use client';

import React, { ReactNode } from 'react';
import Button from '@/components/Common/Button';

interface FilterCardProps {
  children: ReactNode;
  onReset: () => void;
  onApply: () => void;
}

/**
 * Reusable filter card wrapper that matches Dashboard filter style.
 * - Children: form inputs (max 4 per row via grid on parent)
 * - Right side: vertical Reset / Apply buttons separated by a divider
 */
export default function FilterCard({ children, onReset, onApply }: FilterCardProps) {
  return (
    <div className="card shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">

        {/* Left Side: Inputs (grid layout handled by the parent via children) */}
        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          {children}
        </div>

        {/* Vertical divider (desktop) / Horizontal divider (mobile) */}
        <div className="hidden lg:block w-[1px] bg-gray-200 self-stretch my-1"></div>
        <div className="block lg:hidden h-[1px] bg-gray-200 w-full my-2"></div>

        {/* Right Side: Buttons — vertical, justify-start */}
        <div className="flex flex-col justify-start gap-2.5 min-w-[180px] lg:pl-2">
          <Button
            variant="secondary"
            onClick={onReset}
            className="w-full h-[44px] uppercase tracking-wider font-bold text-xs"
          >
            RESET FILTER
          </Button>
          <Button
            variant="primary"
            onClick={onApply}
            className="w-full h-[44px] uppercase tracking-wider font-bold text-xs"
          >
            TERAPKAN FILTER
          </Button>
        </div>

      </div>
    </div>
  );
}
