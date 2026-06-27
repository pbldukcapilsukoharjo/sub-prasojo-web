import React from 'react';

interface Column {
  key: string;
  header: string;
  render?: (row: any) => React.ReactNode;
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
                className={`py-4 px-6 text-[10px] font-bold text-gray-600 tracking-wider uppercase whitespace-nowrap ${
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
              className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-gray-100 even:bg-gray-50' : 'hover:bg-gray-100 even:bg-gray-50'}`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-5 px-6 text-xs font-semibold text-gray-900 whitespace-nowrap ${
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
