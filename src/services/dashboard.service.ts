import axiosInstance from "@/lib/axios";
import { ApiBaseResponse } from "./auth.service";

export interface DashboardFilterParams {
  serviceType?: string;
  district?: string;
  period?: string;
  startDate?: string;
  endDate?: string;
}

export interface KpiData {
  total_pengajuan: number;
  total_selesai: number;
  total_ditolak: number;
  rata_rata_kepuasan: number;
  ajuan_bulanan: Array<{
    label: string;
    belum_diverifikasi: number;
    diverifikasi: number;
    diproses: number;
    disetujui: number;
    ditolak: number;
    selesai: number;
  }>;
  distribusi_wilayah: Array<{
    id: number;
    label: string;
    value: number;
  }>;
}

export interface ChartTrendItem {
  tanggal: string;
  total_ajuan: number;
  selesai: number;
}

export interface TopWilayahItem {
  id_kecamatan: number;
  nama_kecamatan: string;
  total: number;
}

export type DashboardKpiResponse = ApiBaseResponse<KpiData>;
export type DashboardChartTrendResponse = ApiBaseResponse<ChartTrendItem[]>;
export type DashboardTopWilayahResponse = ApiBaseResponse<TopWilayahItem[]>;

// Helper to clean up empty filter params
const buildQueryParams = (params?: DashboardFilterParams) => {
  const query: Record<string, string> = {};
  if (!params) return query;

  if (params.serviceType && params.serviceType !== 'all') query.serviceType = params.serviceType;
  if (params.district && params.district !== 'all') query.district = params.district;
  if (params.period) query.period = params.period;
  if (params.startDate) query.startDate = params.startDate;
  if (params.endDate) query.endDate = params.endDate;

  return query;
};

export const dashboardService = {
  async getDashboardKpi(params?: DashboardFilterParams): Promise<DashboardKpiResponse> {
    const response = await axiosInstance.get<DashboardKpiResponse>("/dashboard/kpi", {
      params: buildQueryParams(params)
    });
    return response.data;
  },

  async getDashboardChartTrend(params?: DashboardFilterParams): Promise<DashboardChartTrendResponse> {
    const response = await axiosInstance.get<DashboardChartTrendResponse>("/dashboard/chart-trend", {
      params: buildQueryParams(params)
    });
    return response.data;
  },

  async getDashboardTopWilayah(params?: DashboardFilterParams): Promise<DashboardTopWilayahResponse> {
    const response = await axiosInstance.get<DashboardTopWilayahResponse>("/dashboard/top-wilayah", {
      params: buildQueryParams(params)
    });
    return response.data;
  },
};
