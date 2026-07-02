import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = '',
}: PaginationProps) {
  
  const generatePages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const showingStart = itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const showingEnd = itemsPerPage && totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-xs font-medium text-text-secondary">
        {totalItems && itemsPerPage ? (
          <>Menampilkan {showingStart}-{showingEnd} dari {totalItems} operator</>
        ) : null}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-full text-text-secondary hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent disabled:active:bg-transparent transition-colors"
        >
          <i className="ri-arrow-left-s-line text-lg"></i>
        </button>
        
        {generatePages().map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${
                isActive
                  ? 'bg-primary hover:bg-primary-hover active:bg-primary-active text-white'
                  : 'text-text-secondary hover:bg-gray-100 active:bg-gray-200'
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-full text-text-secondary hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent disabled:active:bg-transparent transition-colors"
        >
          <i className="ri-arrow-right-s-line text-lg"></i>
        </button>
      </div>
    </div>
  );
}
