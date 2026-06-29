import axiosInstance from "@/lib/axios";
import { ApiBaseResponse } from "./auth.service";

export interface DistribusiWilayahParams {
  page?: number;
  search?: string;
  id_kecamatan?: number;
  sort_by?: string;
  periode_bulan?: number;
  start_date?: string;
  end_date?: string;
}

export interface DistribusiAjuanItem {
  id: number;
  desa: string;
  kecamatan: string;
  total_ajuan: number;
  "ktp-el": number;
  kia: number;
  akta_kelahiran: number;
  akta_kematian: number;
  perpindahan: number;
  kedatangan: number;
  update_data: number;
  rekam_jemput_bola: number;
}

export interface DistribusiWilayahData {
  total_kecamatan: number;
  total_ajuan_dokumen: number;
  rata_rata_ajuan: number;
  daftar_ajuan: {
    list: DistribusiAjuanItem[];
    meta: {
      page: number;
      per_page: number;
      total: number;
      total_page: number;
    };
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
  async getDistribusiWilayah(params?: DistribusiWilayahParams): Promise<ApiBaseResponse<DistribusiWilayahData>> {
    const response = await axiosInstance.get<ApiBaseResponse<DistribusiWilayahData>>("/wilayah/distribusi", {
      params: buildQueryParams(params),
    });
    return response.data;
  }
};
