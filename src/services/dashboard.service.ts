import axiosInstance from "@/lib/axios";
import { ApiBaseResponse } from "./auth.service";

export interface DashboardFilterParams {
  id_layanan?: number;
  id_kecamatan?: number;
  periode_bulan?: number;
  start_date?: string;
  end_date?: string;
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
  belum_diverifikasi: number;
  diverifikasi: number;
  ditolak: number;
  diproses: number;
  selesai: number;
  disetujui: number;
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
  const query: Record<string, any> = {};
  if (!params) return query;

  if (params.id_layanan) query.id_layanan = params.id_layanan;
  if (params.id_kecamatan) query.id_kecamatan = params.id_kecamatan;
  if (params.periode_bulan) query.periode_bulan = params.periode_bulan;
  if (params.start_date) query.start_date = params.start_date;
  if (params.end_date) query.end_date = params.end_date;

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
