import React from 'react';

export interface Column {
  key: string;
  header: string;
  render?: (row: any, index?: any) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  fixed?: boolean;
  left?: number | string;
  minWidth?: number | string;
  width?: number | string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  className?: string;
  onRowClick?: (row: any) => void;
}

export default function Table({ columns, data, className = '', onRowClick }: TableProps) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full min-w-max border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-[#1e1e2d] border-b border-gray-200 dark:border-white/10">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  position: col.fixed ? 'sticky' : undefined,
                  left: col.fixed ? (col.left || 0) : undefined,
                  minWidth: col.minWidth,
                  width: col.width,
                  zIndex: col.fixed ? 20 : undefined,
                }}
                className={`py-4 px-6 text-[10px] font-bold text-text-secondary tracking-wider uppercase whitespace-nowrap ${
                  col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                } ${col.fixed ? 'bg-gray-100 dark:bg-[#1e1e2d] outline outline-1 outline-gray-200 dark:outline-white/10' : ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-white/10">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              onClick={() => onRowClick && onRowClick(row)}
              className={`bg-white dark:bg-[#151521] transition-colors ${onRowClick ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10' : 'hover:bg-gray-100 dark:hover:bg-white/10'} even:bg-gray-50 dark:even:bg-[#1a1a27]`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    position: col.fixed ? 'sticky' : undefined,
                    left: col.fixed ? (col.left || 0) : undefined,
                    minWidth: col.minWidth,
                    width: col.width,
                    zIndex: col.fixed ? 10 : undefined,
                  }}
                  className={`py-5 px-6 text-xs font-semibold text-text-primary whitespace-nowrap ${
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                  } ${col.fixed ? 'bg-inherit outline outline-1 outline-gray-200/50 dark:outline-white/5' : ''}`}
                >
                  {col.render ? col.render(row, rowIndex) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
