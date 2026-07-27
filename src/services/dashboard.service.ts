import axiosInstance from "@/lib/axios";
import { ApiBaseResponse } from "./auth.service";

export interface DashboardFilterParams {
  id_layanan?: string;
  id_kecamatan?: string;
  periode_bulan?: number;
  start_date?: string;
  end_date?: string;
}

export interface KpiData {
  total_pengajuan: number;
  total_pengajuan_trend_persen: number;
  total_selesai: number;
  total_selesai_trend_persen: number;
  total_ditolak: number;
  total_ditolak_trend_persen: number;
  rata_rata_sla_jam: number;
  rata_rata_sla_trend_persen: number;
  rata_rata_sla_text: string;
}

export interface ChartTrendItem {
  tanggal: string;
  total_ajuan: number;
  belum_diverifikasi: string | number;
  diverifikasi: string | number;
  ditolak: string | number;
  diproses: string | number;
  selesai: string | number;
  disetujui: string | number;
}

export interface TopWilayahItem {
  id_kecamatan: string;
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

  if (params.id_layanan !== undefined) query.id_layanan = params.id_layanan;
  if (params.id_kecamatan !== undefined && params.id_kecamatan !== 'all') query.id_kecamatan = params.id_kecamatan;
  if (params.periode_bulan !== undefined) query.periode_bulan = params.periode_bulan;
  if (params.start_date !== undefined) query.start_date = params.start_date;
  if (params.end_date !== undefined) query.end_date = params.end_date;

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


