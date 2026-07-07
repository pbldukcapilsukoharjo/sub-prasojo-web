import axiosInstance from "@/lib/axios";
import { ApiBaseResponse } from "./auth.service";

export interface SlaParams {
  page?: number;
  search?: string;
  id_kecamatan?: number;
  sort_by?: string;
  id_layanan?: number;
  periode_bulan?: number;
  start_date?: string;
  end_date?: string;
}

export interface SlaKpiParams {
  id_kecamatan?: number;
  id_layanan?: number;
  periode_bulan?: number;
  start_date?: string;
  end_date?: string;
}

export interface SlaRincianItem {
  id: number;
  jenis_layanan: string;
  jumlah_ajuan: number;
  rata_rata_waktu: number;
}

export interface SlaData {
  rata_rata_waktu_proses: number;
  pencapaian_sla: number;
  target_sla: number;
  jumlah_ajuan: number;
  daftar_rincian: {
    list: SlaRincianItem[];
    meta: {
      page: number;
      per_page: number;
      total: number;
      total_page: number;
    };
  };
}

export interface SlaKpiData {
  rata_rata_global_text: string;
  capaian_sla_persen: number;
  target_sla: number;
  jumlah_ajuan: number;
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

export const slaService = {
  async getSla(params?: SlaParams): Promise<ApiBaseResponse<SlaData>> {
    const response = await axiosInstance.get<any>("/sla", {
      params: buildQueryParams(params),
    });
    
    // Map 'success' to 'status' to maintain compatibility with ApiBaseResponse
    if (response.data.success !== undefined && response.data.status === undefined) {
      response.data.status = response.data.success;
    }
    
    return response.data;
  },

  async getSlaKpi(params?: SlaKpiParams): Promise<ApiBaseResponse<SlaKpiData>> {
    const response = await axiosInstance.get<ApiBaseResponse<SlaKpiData>>("/sla/kpi", {
      params: buildQueryParams(params),
    });
    return response.data;
  },

  async exportSla(): Promise<void> {
    const response = await axiosInstance.get("/sla/export", {
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `export_sla_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
