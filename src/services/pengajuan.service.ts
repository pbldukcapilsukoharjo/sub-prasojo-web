import axiosInstance from "@/lib/axios";
import { ApiBaseResponse } from "./auth.service";

// --- LEMBAR KERJA ---
export interface PengajuanLembarKerjaParams {
  search?: string;
  kecamatan?: string;
  pelapor?: string;
  start_date?: string;
  end_date?: string;
  periode?: number | string;
  layanan?: string;
  sort?: string;
  per_page?: number;
  page?: number;
}

export interface AjuanItem {
  ajuan_id: number;
  ajuan_no_reg: string;
  ajuan_create_datetime: string;
  ajuan_status: string;
  ajuan_pelapor_role_name: string;
  ajuan_is_online: number;
  nama_identitas_produk?: string; // Untuk halaman produk
  kecamatan: {
    kecamatan_id: number;
    kecamatan_name: string;
  };
  layanan: {
    layanan_id: number;
    layanan_name: string;
  };
  pelapor?: {
    user_id: number;
    user_nik: string;
    user_nama_lengkap: string;
  };
}

export interface MetaPagination {
  page: number;
  per_page: number;
  total: number;
  total_page: number;
}

export interface ChartStatusItem {
  status: string;
  total: number;
}

export interface ChartLayananItem {
  layanan: string;
  total: number;
}

export interface PengajuanLembarKerjaResponse {
  status: boolean;
  code: number;
  message: string;
  data: AjuanItem[];
  meta: MetaPagination;
  chart_status?: ChartStatusItem[];
  chart_layanan?: ChartLayananItem[];
}


// --- AJUAN ---
export interface PengajuanAjuanParams extends PengajuanLembarKerjaParams {
  status?: string;
}

export interface PengajuanAjuanResponse {
  status: boolean;
  code: number;
  message: string;
  data: AjuanItem[];
  meta: MetaPagination;
}


// --- PRODUK ---
export interface PengajuanProdukParams {
  search?: string;
  kecamatan?: string;
  nama_identitas_produk?: string;
  start_date?: string; // Meskipun di endpoint spec tidak ditulis tegas, biasanya ada karena ada filter rentang tanggal di UI
  end_date?: string;
  periode?: number | string;
  layanan?: string;
  sort?: string;
  per_page?: number;
  page?: number;
}

export interface PengajuanProdukResponse {
  status: boolean;
  code: number;
  message: string;
  data: AjuanItem[];
  meta: MetaPagination;
}

// --- DETAIL TIMELINE ---
export interface TimelineDetail {
  status: string;
  note: string;
  datetime: string;
}

export interface PengajuanDetailData {
  ajuan_id: number;
  no_reg: string;
  status_saat_ini: string;
  timeline: TimelineDetail[];
}

const buildQueryParams = (params?: Record<string, any>) => {
  const query: Record<string, any> = {};
  if (!params) return query;

  if (params.search) query.search = params.search;
  if (params.kecamatan && params.kecamatan !== 'all') query.kecamatan = params.kecamatan;
  if (params.pelapor && params.pelapor !== 'all') query.pelapor = params.pelapor;
  if (params.nama_identitas_produk && params.nama_identitas_produk !== 'all') query.nama_identitas_produk = params.nama_identitas_produk;
  if (params.status && params.status !== 'all') query.status = params.status;
  if (params.start_date) query.start_date = params.start_date;
  if (params.end_date) query.end_date = params.end_date;
  if (params.periode) query.periode = params.periode;
  if (params.layanan && params.layanan !== 'semua') query.layanan = params.layanan;
  if (params.sort) query.sort = params.sort;
  if (params.per_page) query.per_page = params.per_page;
  if (params.page) query.page = params.page;

  return query;
};

export const pengajuanService = {
  async getLembarKerja(params?: PengajuanLembarKerjaParams): Promise<PengajuanLembarKerjaResponse> {
    const response = await axiosInstance.get<PengajuanLembarKerjaResponse>("/pengajuan/lembar-kerja", {
      params: buildQueryParams(params),
    });
    return response.data;
  },

  async getAjuan(params?: PengajuanAjuanParams): Promise<PengajuanAjuanResponse> {
    const response = await axiosInstance.get<PengajuanAjuanResponse>("/pengajuan/ajuan", {
      params: buildQueryParams(params),
    });
    return response.data;
  },

  async getProduk(params?: PengajuanProdukParams): Promise<PengajuanProdukResponse> {
    const response = await axiosInstance.get<PengajuanProdukResponse>("/pengajuan/produk", {
      params: buildQueryParams(params),
    });
    return response.data;
  },

  async getPengajuanDetail(ajuan_id: number): Promise<ApiBaseResponse<PengajuanDetailData>> {
    const response = await axiosInstance.get<ApiBaseResponse<PengajuanDetailData>>(`/pengajuan/${ajuan_id}/detail`);
    return response.data;
  },

  async exportPengajuan(status_kategori: 'lembar_kerja' | 'produk' | 'all'): Promise<void> {
    const response = await axiosInstance.get("/pengajuan/export", {
      params: { status_kategori },
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `export_${status_kategori}_${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
