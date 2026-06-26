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
    chart: {
      type: 'donut',
      fontFamily: 'Inter, sans-serif',
      animations: { enabled: true, speed: 600 },
    },
    labels: ['Diverifikasi', 'Disetujui', 'Ditolak', 'Diproses'],
    colors: ['#3B82F6', '#10B981', '#EF4444', '#6B7280'],
    stroke: {
      show: true,
      width: 2,
      colors: ['#ffffff'],
    },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '11px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              color: '#9CA3AF',
              offsetY: -6,
            },
            value: {
              show: true,
              fontSize: '24px',
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 800,
              color: '#111827',
              offsetY: 8,
              formatter: function (val: any) {
                return val;
              },
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total Ajuan',
              fontSize: '11px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              color: '#9CA3AF',
              formatter: function (w: any) {
                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '11px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold',
        colors: ['#ffffff'],
      },
      dropShadow: {
        enabled: false,
      },
      formatter: function (val: number) {
        return Math.round(val) + "%";
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '11px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      labels: {
        colors: '#4B5563',
      },
      markers: {
        width: 8,
        height: 8,
        radius: 4,
        offsetX: -3,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 6,
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
      },
      y: {
        formatter: function (val: number) {
          return val + ' ajuan';
        },
      },
    },
  };
  const pieSeries = [38, 20, 7, 35];

  const barOptions: any = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
      animations: { enabled: true, speed: 600 },
    },
    plotOptions: {
      bar: {
        columnWidth: '35%',
        borderRadius: 6,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    xaxis: {
      categories: [
        'Kartu Keluarga',
        'KTP-EL',
        'KIA',
        'Akta Kelahiran',
        'Akta Kematian',
        'Perpindahan',
        'Surket KTP',
      ],
      labels: {
        rotate: -35,
        rotateAlways: true,
        hideOverlappingLabels: false,
        style: {
          fontSize: '9px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          colors: '#9CA3AF',
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 80,
      tickAmount: 4,
      labels: {
        style: {
          fontSize: '10px',
          fontFamily: 'Inter, sans-serif',
          colors: '#9CA3AF',
        },
      },
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 4,
      padding: { left: 16, right: 16, top: 0, bottom: 0 },
    },
    colors: ['#800000'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.1,
        opacityFrom: 0.95,
        opacityTo: 0.85,
        stops: [0, 100],
      },
    },
    legend: { show: false },
    tooltip: {
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
      },
      y: {
        formatter: function (val: number) {
          return val + ' ajuan';
        },
      },
    },
  };
  const barSeries = [
    {
      name: 'Jumlah Ajuan',
      data: [70, 18, 32, 20, 42, 12, 58],
    },
  ];

  if (!mounted) {
    return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 h-[380px] bg-gray-50/50 rounded-2xl animate-pulse"></div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart Card */}
      <div className="card shadow-sm border border-gray-100 flex flex-col p-0 overflow-hidden bg-white">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Persentase Distribusi Status</h3>
          <p className="text-[11px] text-gray-400 font-medium mt-0.5">
            Proporsi berkas berdasarkan status ajuan saat ini
          </p>
        </div>
        {/* Chart Area */}
        <div className="p-6 flex-1 flex items-center justify-center min-h-[300px]">
          <div className="w-full">
            <Chart options={pieOptions} series={pieSeries} type="donut" width="100%" height={280} />
          </div>
        </div>
      </div>

      {/* Bar Chart Card */}
      <div className="card shadow-sm border border-gray-100 flex flex-col p-0 overflow-hidden bg-white">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Jumlah per Jenis Layanan</h3>
          <p className="text-[11px] text-gray-400 font-medium mt-0.5">
            Distribusi volume pengajuan untuk setiap jenis layanan
          </p>
        </div>
        {/* Chart Area */}
        <div className="p-6 flex-1 flex flex-col justify-between min-h-[300px]">
          <div className="w-full">
            <Chart options={barOptions} series={barSeries} type="bar" width="100%" height={300} />
          </div>
          {/* Custom Indicator */}
          <div className="flex items-center justify-center gap-4 border-t border-gray-50 mt-auto">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0"></span>
              <span className="text-[11px] font-semibold text-gray-500">Volume Pengajuan (Juni)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
