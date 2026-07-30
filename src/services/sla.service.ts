import axiosInstance from "@/lib/axios";
import { ApiBaseResponse } from "./auth.service";

export interface SlaParams {
  max_sla_minutes?: number;
  page?: number;
  search?: string;
  id_kecamatan?: string | number;
  operator_id?: string | number;
  sort_by?: string;
  id_layanan?: string | number;
  periode_bulan?: number;
  start_date?: string;
  end_date?: string;
}

export interface SlaKpiParams {
  max_sla_minutes?: number;
  id_kecamatan?: string | number;
  operator_id?: string | number;
  id_layanan?: string | number;
  periode_bulan?: number;
  start_date?: string;
  end_date?: string;
}

export interface SlaRincianItem {
  id: number;
  jenis_layanan: string;
  jumlah_ajuan: number;
  rata_rata_waktu: string;
}

export interface SlaListResponse {
  success?: boolean;
  status?: boolean;
  code: number;
  message: string;
  data: SlaRincianItem[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_page: number;
  };
}

export interface SlaKpiData {
  rata_rata_global_text: string;
  capaian_sla_persen: number;
  target_sla: number;
  jumlah_ajuan: number;
}

export interface OperationalHour {
  id: number;
  hari_kode: number;
  hari_nama: string;
  jam_buka: string;
  jam_tutup: string;
  is_libur: boolean;
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
  async getSla(params?: SlaParams): Promise<SlaListResponse> {
    const response = await axiosInstance.get<SlaListResponse>("/sla", {
      params: buildQueryParams(params),
    });
    return response.data;
  },

  async getSlaKpi(params?: SlaKpiParams): Promise<ApiBaseResponse<SlaKpiData>> {
    const response = await axiosInstance.get<ApiBaseResponse<SlaKpiData>>("/sla/kpi", {
      params: buildQueryParams(params),
    });
    return response.data;
  },

  async exportSla(params?: SlaParams): Promise<void> {
    const response = await axiosInstance.get("/sla/export", {
      params: buildQueryParams(params),
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `export_sla_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  async updateSlaTarget(payload: { sla_target_value: number, sla_target_unit: string }): Promise<ApiBaseResponse<any>> {
    const response = await axiosInstance.put("/sla/target", payload);
    return response.data;
  },

  async getSlaTarget(): Promise<ApiBaseResponse<{ sla_target_value: number, sla_target_unit: string }>> {
    const response = await axiosInstance.get("/sla/target");
    return response.data;
  },

  async recalculateSla(): Promise<ApiBaseResponse<any>> {
    const response = await axiosInstance.post("/sla/recalculate");
    return response.data;
  },

  async getOperationalHours(): Promise<ApiBaseResponse<OperationalHour[]>> {
    const response = await axiosInstance.get("/operational-hours");
    return response.data;
  },

  async updateOperationalHour(id: number, payload: { is_libur: boolean, jam_buka: string, jam_tutup: string }): Promise<ApiBaseResponse<OperationalHour>> {
    const response = await axiosInstance.put(`/operational-hours/${id}`, payload);
    return response.data;
  }
};
