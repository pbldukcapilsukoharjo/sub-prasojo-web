'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DashboardChartClientProps {
  options: any;
  series: any[];
}

export default function DashboardChartClient({ options, series }: DashboardChartClientProps) {
  return (
    <div className="w-full relative px-2 pt-4 pb-2" style={{ height: 360 }}>
      {series && series.length > 0 && series[0].data.length > 0 ? (
        <Chart
          options={options}
          series={series}
          type="line"
          height={340}
          width="100%"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-text-secondary text-sm font-medium gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
            <i className="ri-line-chart-line text-xl text-gray-400"></i>
          </div>
          Belum ada data tersedia
        </div>
      )}
    </div>
  );
}
