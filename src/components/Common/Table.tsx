import React from 'react';

export interface Column {
  key: string;
  header: string;
  render?: (row: any, index?: any) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
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
      <table className="w-full min-w-[1000px] border-collapse">
        <thead>
          <tr className="bg-[#D1D5DB] bg-opacity-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-4 px-6 text-[10px] font-bold text-text-secondary tracking-wider uppercase whitespace-nowrap ${
                  col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              onClick={() => onRowClick && onRowClick(row)}
              className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-gray-100 even:bg-background' : 'hover:bg-gray-100 even:bg-background'}`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-5 px-6 text-xs font-semibold text-text-primary whitespace-nowrap ${
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
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
