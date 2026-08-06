import axiosInstance from "@/lib/axios";
import { ApiBaseResponse } from "./auth.service";

export interface FilterItem {
  id: string | number;
  name: string;
}

export type FilterResponse = ApiBaseResponse<FilterItem[]>;

export const filterService = {
  async getLayanan(): Promise<FilterResponse> {
    const response = await axiosInstance.get<FilterResponse>("/filter/layanan");
    return response.data;
  },

  async getKecamatan(): Promise<FilterResponse> {
    const response = await axiosInstance.get<FilterResponse>("/filter/kecamatan");
    return response.data;
  },

  async getPelapor(): Promise<FilterResponse> {
    const response = await axiosInstance.get<FilterResponse>("/filter/pelapor");
    return response.data;
  },

  async getStatus(): Promise<FilterResponse> {
    const response = await axiosInstance.get<FilterResponse>("/filter/status");
    return response.data;
  },

  async getJenisAjuan(): Promise<FilterResponse> {
    const response = await axiosInstance.get<FilterResponse>("/filter/jenis-ajuan");
    return response.data;
  },

  async getJalur(): Promise<FilterResponse> {
    const response = await axiosInstance.get<FilterResponse>("/filter/jalur");
    return response.data;
  },

  async getOperator(): Promise<FilterResponse> {
    const response = await axiosInstance.get<any>("/operator/peringkat", {
      params: { page: 1, limit: 100 },
    });
    // Transform from { id, operator } to { id, name } format expected by filter hooks
    const list = response.data?.data?.list || [];
    return {
      ...response.data,
      data: list.map((item: any) => ({ id: item.id, name: item.operator })),
    };
  }
};
