'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import { ChartDataItem } from '@/services/pengajuan.service';

interface AjuanChartsProps {
  chartStatus?: ChartDataItem[];
  chartLayanan?: ChartDataItem[];
  isLoading?: boolean;
}

export default function AjuanCharts({ chartStatus = [], chartLayanan = [], isLoading = false }: AjuanChartsProps) {
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
    labels: chartStatus.map(item => item.label),
    colors: chartStatus.map(item => {
      const l = item.label.toUpperCase();
      if (l.includes('BELUM')) return '#F59E0B'; // yellow/amber
      if (l.includes('SETUJU')) return '#10B981'; // green
      if (l.includes('TOLAK')) return '#EF4444'; // red
      if (l.includes('SELESAI') || l.includes('PROSES')) return '#3B82F6'; // blue
      return '#6B7280';
    }),
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
  const pieSeries = chartStatus.map(item => item.value);

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
      categories: chartLayanan.map(item => item.label),
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
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
      padding: { left: 16, right: 16, top: 0, bottom: 28 },
    },
    colors: ['var(--color-primary)'],
    fill: {
      type: 'solid',
      opacity: 1,
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
      data: chartLayanan.map(item => item.value),
    },
  ];

  if (!mounted || isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card shadow-sm border border-border flex items-center justify-center min-h-[380px] bg-surface">
          <div className="flex flex-col items-center justify-center gap-3">
             <i className="ri-loader-4-line text-3xl animate-spin text-primary"></i>
             <span className="font-bold text-text-secondary animate-pulse text-sm">Memuat Grafik...</span>
          </div>
        </div>
        <div className="card shadow-sm border border-border flex items-center justify-center min-h-[380px] bg-surface">
          <div className="flex flex-col items-center justify-center gap-3">
             <i className="ri-loader-4-line text-3xl animate-spin text-primary"></i>
             <span className="font-bold text-text-secondary animate-pulse text-sm">Memuat Grafik...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart Card */}
      <div className="card shadow-sm border border-border flex flex-col p-0 overflow-hidden bg-surface">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-border">
          <h3 className="text-sm font-bold text-text-primary">Persentase Distribusi Status</h3>
          <p className="text-[11px] text-text-secondary font-medium mt-0.5">
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
      <div className="card shadow-sm border border-border flex flex-col p-0 overflow-hidden bg-surface">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-border">
          <h3 className="text-sm font-bold text-text-primary">Jumlah per Jenis Layanan</h3>
          <p className="text-[11px] text-text-secondary font-medium mt-0.5">
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
              <span className="text-[11px] font-semibold text-text-secondary">Volume Pengajuan (Juni)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
