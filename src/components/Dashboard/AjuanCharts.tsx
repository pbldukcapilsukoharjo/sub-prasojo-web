'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AjuanCharts() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pieOptions: any = {
    chart: { type: 'donut' },
    labels: ['Diverifikasi', 'Disetujui', 'Ditolak', 'Diproses'],
    colors: ['#3B82F6', '#10B981', '#DC2626', '#6B7280'],
    plotOptions: {
      pie: {
        donut: { size: '60%' }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return Math.round(val) + "%";
      }
    },
    legend: {
      position: 'right',
      offsetY: 0,
      height: 230,
    }
  };
  const pieSeries = [38, 20, 7, 35];

  const barOptions: any = {
    chart: {
      type: 'bar',
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 4,
      }
    },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    xaxis: {
      categories: ['Kartu\nKeluarga', 'KTP-EL', 'KIA', 'AKTA\nKELAHIRAN', 'AKTA\nKEMATIAN', 'PERPINDA-\nHAN', 'SURKET\nKTP'],
      labels: {
        style: { fontSize: '9px', fontWeight: 600 }
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
    },
    colors: ['#93C5FD'], // light blue bar
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: "vertical",
        shadeIntensity: 0.25,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0.7,
        stops: [50, 100]
      }
    },
    legend: { show: false }
  };
  const barSeries = [{
    name: 'Juni',
    data: [70, 18, 32, 20, 42, 12, 58]
  }];

  if (!mounted) return <div className="h-[280px]"></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Pie Chart */}
      <div className="card shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-sm font-bold text-gray-900">Chart persentase distribusi status</h3>
          <div className="flex-1 border-b border-gray-200"></div>
        </div>
        <div className="h-[240px] flex items-center justify-center">
          <Chart options={pieOptions} series={pieSeries} type="donut" width="100%" height="240px" />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-sm font-bold text-gray-900">Chart jumlah per Jenis Layanan</h3>
          <div className="flex-1 border-b border-gray-200"></div>
        </div>
        <div className="h-[240px]">
          <Chart options={barOptions} series={barSeries} type="bar" width="100%" height="240px" />
        </div>
        <div className="flex justify-center mt-2">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
             <span className="text-[10px] font-bold text-gray-500">Juni</span>
           </div>
        </div>
      </div>
    </div>
  );
}
