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

export interface LembarKerjaItem {
  id: number;
  no_reg: string;
  kode_ajuan: number | string;
  kode_produk: number | string | null;
  layanan: string;
  jalur: string;
  pelapor: string;
  status: string;
  tanggal: string;
  kecamatan: string;
}

export interface AjuanListItem {
  id: number;
  no_regis: string;
  nama: string;
  nik: string;
  jenis_ajuan: string;
  kecamatan: string;
  kode_layanan: string;
  kode_produk: string | null;
  jalur: string;
  pelapor: string;
  status: string;
  tanggal: string;
  tanggal_parse: string;
}

export interface ProdukItem {
  id: number;
  no_reg: string;
  layanan: string;
  kecamatan: string;
  pelapor: string;
  status: string;
  created_at: string;
  nama_identitas_produk: string;
  nomor: string;
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
  data: LembarKerjaItem[];
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
  data: AjuanListItem[];
  meta: MetaPagination;
}


// --- AJUAN CHART ---
export interface ChartDataItem {
  label: string;
  value: number;
}

export interface ChartAjuanData {
  chart_status: ChartDataItem[];
  chart_layanan: ChartDataItem[];
}

export type ChartAjuanResponse = ApiBaseResponse<ChartAjuanData>;

export interface ChartAjuanParams {
  start_date?: string;
  end_date?: string;
  periode_bulan?: string | number;
  id_kecamatan?: string | number;
  kecamatan?: string | number;
  id_layanan?: string;
  layanan?: string;
  id_jenis_ajuan?: string | number;
  jalur?: string;
  id_pelapor?: string;
  pelapor?: string;
  status?: string;
  search?: string;
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
  pelapor?: string;
}

export interface PengajuanProdukResponse {
  status: boolean;
  code: number;
  message: string;
  data: ProdukItem[];
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

export interface ProdukDetailData {
  id: number;
  no_regis: string;
  nama: string;
  nik: string;
  jenis_layanan: string;
  kecamatan: string;
  tanggal_ajuan: string;
  tanggal_ajuan_parse: string;
  kode_ajuan: string;
  nomor: string;
  nama_identitas: string;
  nama_identitas_produk: string;
  status: string;
  tanggal: string;
  tanggal_parse: string;
  data_ajuan: Record<string, string>;
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

  async getChartAjuan(params?: ChartAjuanParams): Promise<ChartAjuanResponse> {
    const query: Record<string, any> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== 'all') {
          query[key] = value;
        }
      });
    }
    const response = await axiosInstance.get<ChartAjuanResponse>("/pengajuan/ajuan/chart", {
      params: query,
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

  async getProdukDetail(id: number): Promise<ApiBaseResponse<ProdukDetailData>> {
    const response = await axiosInstance.get<ApiBaseResponse<ProdukDetailData>>(`/pengajuan/produk/${id}/detail`);
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
