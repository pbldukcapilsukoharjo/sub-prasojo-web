import axiosInstance from "@/lib/axios";
import { ApiBaseResponse } from "./auth.service";

export interface KpiGlobalParams {
  id_kecamatan?: string;
  periode_bulan?: number;
  start_date?: string;
  end_date?: string;
  id_operator?: number;
  pelapor?: string;
}

export interface KpiGlobalData {
  total_ajuan: number;
  total_selesai: number;
  tingkat_selesai: number;
  rata_rata_durasi: number;
}

export interface OperatorPeringkatParams {
  page?: number;
  limit?: number;
  search?: string;
  id_kecamatan?: string;
  periode_bulan?: number;
  sort?: string;
  start_date?: string;
  end_date?: string;
  id_operator?: number;
  pelapor?: string;
}

export interface OperatorItem {
  id: number;
  peringkat: number;
  operator: string;
  desa: string;
  kecamatan: string;
  jumlah_ajuan: number;
}

export interface PeringkatOperatorData {
  list: OperatorItem[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_page: number;
  };
}

export interface OperatorKpiParams {
  tahun: number;
  periode_bulan?: number;
  id_layanan?: number | string;
  pelapor?: string;
}

export interface OperatorKpiData {
  id: number;
  nama: string;
  total_ajuan: number;
  total_selesai: number;
  tingkat_selesai: number;
  layanan_perbulan: {
    [key: string]: number;
  };
}

export interface OperatorRiwayatParams {
  page?: number;
  limit?: number;
  tahun: number;
  periode_bulan?: number;
  id_layanan?: number | string;
  search?: string;
  pelapor?: string;
}

export interface RiwayatItem {
  id: number;
  no_regis: string;
  pemohon: string;
  kode_ajuan: string;
  desa: string;
  tanggal: string;
  waktu: string;
  status: string;
}

export interface OperatorRiwayatData {
  list: RiwayatItem[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_page: number;
  };
}

const buildQueryParams = (params?: Record<string, any>) => {
  const query: Record<string, any> = {};
  if (!params) return query;

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      query[key] = value;
    }
  });

  return query;
};

export const operatorService = {
  async getKpiGlobal(params?: KpiGlobalParams): Promise<ApiBaseResponse<KpiGlobalData>> {
    const response = await axiosInstance.get<ApiBaseResponse<KpiGlobalData>>("/operator/kpi-global", {
      params: buildQueryParams(params),
    });
    return response.data;
  },

  async getPeringkatOperator(params?: OperatorPeringkatParams): Promise<ApiBaseResponse<PeringkatOperatorData>> {
    const response = await axiosInstance.get<ApiBaseResponse<PeringkatOperatorData>>("/operator/peringkat", {
      params: buildQueryParams(params),
    });
    return response.data;
  },

  async getOperatorKpi(id: number, params: OperatorKpiParams): Promise<ApiBaseResponse<OperatorKpiData>> {
    const response = await axiosInstance.get<ApiBaseResponse<OperatorKpiData>>(`/operator/${id}/kpi`, {
      params: buildQueryParams(params),
    });
    return response.data;
  },

  async getOperatorRiwayat(id: number, params: OperatorRiwayatParams): Promise<ApiBaseResponse<OperatorRiwayatData>> {
    const response = await axiosInstance.get<ApiBaseResponse<OperatorRiwayatData>>(`/operator/${id}/riwayat`, {
      params: buildQueryParams(params),
    });
    return response.data;
  },

  async getExportPeringkat(params?: OperatorPeringkatParams): Promise<ApiBaseResponse<any>> {
    const response = await axiosInstance.get<ApiBaseResponse<any>>("/operator/export", {
      params: buildQueryParams(params),
    });
    return response.data;
  }
};
