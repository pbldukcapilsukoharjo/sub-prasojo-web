import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  onPageHover?: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageHover,
  className = '',
}: PaginationProps) {
  
  const generatePages = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const showingStart = itemsPerPage && totalItems ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const showingEnd = itemsPerPage && totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-xs font-medium text-text-secondary">
        {totalItems && itemsPerPage ? (
          <>Menampilkan {showingStart}-{showingEnd} dari {totalItems} data</>
        ) : null}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          onMouseEnter={() => onPageHover && onPageHover(currentPage - 1)}
          disabled={currentPage <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-full text-text-secondary hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent disabled:active:bg-transparent transition-colors"
        >
          <i className="ri-arrow-left-s-line text-lg"></i>
        </button>
        
        {generatePages().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-xs font-medium text-text-secondary">
                ...
              </span>
            );
          }
          
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              onMouseEnter={() => onPageHover && onPageHover(page as number)}
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
          onMouseEnter={() => onPageHover && onPageHover(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-full text-text-secondary hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent disabled:active:bg-transparent transition-colors"
        >
          <i className="ri-arrow-right-s-line text-lg"></i>
        </button>
      </div>
    </div>
  );
}
