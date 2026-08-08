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
  pelapor?: string;
}

export interface UlasanItem {
  id_review: number;
  tanggal: string;
  no_reg: string;
  layanan: string;
  rating: number;
  komentar: string;
}

export interface UlasanListResponse extends ApiBaseResponse<UlasanItem[]> {
  meta?: {
    page: number;
    per_page: number;
    total: number;
    total_page: number;
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
  async getUlasan(params?: UlasanParams): Promise<UlasanListResponse> {
    const response = await axiosInstance.get<UlasanListResponse>("/ulasan", {
      params: buildQueryParams(params),
    });
    return response.data;
  },

  async getUlasanKpi(params?: Omit<UlasanParams, 'page' | 'sort_by'>): Promise<ApiBaseResponse<UlasanKpiData>> {
    const response = await axiosInstance.get<ApiBaseResponse<UlasanKpiData>>("/ulasan/kpi", {
      params: buildQueryParams(params),
    });
    return response.data;
  },

  async exportUlasan(params?: Omit<UlasanParams, 'page' | 'sort_by'>): Promise<void> {
    const response = await axiosInstance.get("/ulasan/export", {
      params: buildQueryParams(params),
      responseType: 'blob',
    });
    
    // Check if the response is actually JSON instead of a blob file
    if (response.data && response.data.type === 'application/json') {
       const text = await response.data.text();
       const json = JSON.parse(text);
       if (json.status) {
         // Maybe it's just a success message without a file
         return;
       }
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `export_ulasan_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
