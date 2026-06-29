import axiosInstance from "@/lib/axios";
import { ApiBaseResponse } from "./auth.service";

export interface UlasanParams {
  page?: number;
  search?: string;
  sort_by?: string;
  start_date?: string;
  end_date?: string;
  rating?: number | string;
  layanan_kode?: string;
}

export interface UlasanItem {
  id: number;
  nama: string;
  layanan: string;
  rating: number;
  ulasan: string;
  tanggal: string;
  waktu: string;
}

export interface UlasanData {
  rata_rata_ulasan: number;
  total_ulasan: number;
  total_rating: {
    [key: string]: number;
  };
  daftar_ulasan: {
    list: UlasanItem[];
    meta: {
      page: number;
      per_page: number;
      total: number;
      total_page: number;
    };
  };
}

export interface UlasanKpiData {
  rata_rata_bintang: number;
  distribusi: {
    bintang_5: number;
    bintang_4: number;
    bintang_3: number;
    bintang_2: number;
    bintang_1: number;
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

export const ulasanService = {
  async getUlasan(params?: UlasanParams): Promise<ApiBaseResponse<UlasanData>> {
    const response = await axiosInstance.get<ApiBaseResponse<UlasanData>>("/ulasan", {
      params: buildQueryParams(params),
    });
    return response.data;
  },

  async getUlasanKpi(params?: Omit<UlasanParams, 'page' | 'sort_by'>): Promise<ApiBaseResponse<UlasanKpiData>> {
    const response = await axiosInstance.get<ApiBaseResponse<UlasanKpiData>>("/ulasan/kpi", {
      params: buildQueryParams(params),
    });
    return response.data;
  }
};
