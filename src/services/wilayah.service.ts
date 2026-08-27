import axiosInstance from "@/lib/axios";
import { ApiBaseResponse } from "./auth.service";

export interface DistribusiWilayahParams {
  page?: number;
  search?: string;
  id_kecamatan?: string;
  sort_by?: string;
  periode_bulan?: number;
  start_date?: string;
  end_date?: string;
  pelapor?: string;
}

export interface DistribusiWilayahItem {
  total_ajuan: number;
  rata_rata_waktu: string;
  rasio_selesai_persen: number;
  id_kecamatan?: string;
  nama_kecamatan?: string;
  id_desa?: string;
  nama_desa?: string;
  layanan?: Record<string, number>;
}

export interface DistribusiWilayahResponse {
  status: boolean;
  code: number;
  message: string;
  data: DistribusiWilayahItem[];
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

export const wilayahService = {
  async getDistribusiWilayah(params?: DistribusiWilayahParams): Promise<DistribusiWilayahResponse> {
    const response = await axiosInstance.get<DistribusiWilayahResponse>("/wilayah/distribusi", {
      params: buildQueryParams(params),
    });
    return response.data;
  },

  async exportDistribusiWilayah(params?: DistribusiWilayahParams): Promise<void> {
    const response = await axiosInstance.get("/wilayah/export", {
      params: buildQueryParams(params),
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `export_distribusi_wilayah_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
