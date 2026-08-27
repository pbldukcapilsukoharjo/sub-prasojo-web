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
  pelapor?: string;
  jenis_ajuan?: string | number;
  jalur?: string | number;
}

export interface SlaKpiParams {
  max_sla_minutes?: number;
  search?: string;
  id_kecamatan?: string | number;
  operator_id?: string | number;
  id_layanan?: string | number;
  periode_bulan?: number;
  start_date?: string;
  end_date?: string;
  pelapor?: string;
  jenis_ajuan?: string | number;
  jalur?: string | number;
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

export interface SampleSlaItem {
  ajuan_id: number;
  no_reg: string;
  layanan_kode: string;
  jenis_layanan: string;
  pelapor_role: string;
  pelapor_nama: string;
  pelapor_channel: string;
  pelapor_display: string;
  tanggal_diterima: string;
  waktu_mulai_proses: string;
  waktu_selesai: string;
  durasi_penyelesaian_menit: number;
  durasi_penyelesaian_text: string;
  target_sla_menit: number;
  target_sla_text: string;
  status_sla: string;
  is_tepat_waktu: boolean;
}

export interface SampleSlaParams {
  kategori?: string;
  ajuan_id?: number | string;
  search?: string;
  pelapor?: string;
  id_layanan?: string | number;
  id_kecamatan?: string | number;
  operator_id?: string | number;
  start_date?: string;
  end_date?: string;
  periode_bulan?: number;
  sort_by?: string;
  page?: number;
  per_page?: number;
}

export interface SampleSlaResponse {
  success?: boolean;
  status?: boolean;
  code: number;
  message: string;
  data: SampleSlaItem[];
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
  },

  async getSlaSettings(): Promise<ApiBaseResponse<{ sla_start_status: string; sla_end_status: string }>> {
    const response = await axiosInstance.get("/sla/settings");
    return response.data;
  },

  async updateSlaSettings(payload: { sla_start_status: string; sla_end_status: string }): Promise<ApiBaseResponse<any>> {
    const response = await axiosInstance.put("/sla/settings", payload);
    return response.data;
  },

  async getAjuanSlaTarget(ajuan_id: number): Promise<ApiBaseResponse<{ target_sla_value: number; target_sla_unit: string; target_sla_menit: number }>> {
    const response = await axiosInstance.get(`/sla/ajuan/${ajuan_id}/target`);
    return response.data;
  },

  async updateAjuanSlaTarget(ajuan_id: number, payload: { target_sla_value: number; target_sla_unit: string }): Promise<ApiBaseResponse<any>> {
    const response = await axiosInstance.put(`/sla/ajuan/${ajuan_id}/target`, payload);
    return response.data;
  },

  async getSampleSla(params?: SampleSlaParams): Promise<SampleSlaResponse> {
    const response = await axiosInstance.get<SampleSlaResponse>("/sla/samples", {
      params: buildQueryParams(params),
    });
    return response.data;
  }
};
