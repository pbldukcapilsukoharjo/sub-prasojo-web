import axiosInstance from "@/lib/axios";
import { ApiBaseResponse } from "./auth.service";

export interface Holiday {
  id: number;
  tanggal: string;
  keterangan: string;
  created_at?: string;
  updated_at?: string;
}

export interface HolidayListParams {
  tahun?: number | string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface HolidayListResponse {
  status: boolean;
  code: number;
  message: string;
  data: Holiday[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_page: number;
  };
}

export interface HolidayPayload {
  tanggal: string;
  keterangan: string;
}

export interface AddHolidayPayload {
  holidays: HolidayPayload[];
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

export const holidayService = {
  async getHolidays(params?: HolidayListParams): Promise<HolidayListResponse> {
    const response = await axiosInstance.get<HolidayListResponse>("/holidays", {
      params: buildQueryParams(params),
    });
    return response.data;
  },

  async addHolidays(payload: AddHolidayPayload): Promise<ApiBaseResponse<Holiday[]>> {
    const response = await axiosInstance.post<ApiBaseResponse<Holiday[]>>("/holidays", payload);
    return response.data;
  },

  async updateHoliday(id: number, payload: HolidayPayload): Promise<ApiBaseResponse<Holiday>> {
    const response = await axiosInstance.put<ApiBaseResponse<Holiday>>(`/holidays/${id}`, payload);
    return response.data;
  },

  async deleteHoliday(id: number): Promise<ApiBaseResponse<null>> {
    const response = await axiosInstance.delete<ApiBaseResponse<null>>(`/holidays/${id}`);
    return response.data;
  },

  async downloadTemplate(): Promise<void> {
    const response = await axiosInstance.get("/holidays/template", {
      responseType: "blob",
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `template_import_hari_libur.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  async importHolidays(file: File): Promise<ApiBaseResponse<{ total_imported: number, holidays: Holiday[] }>> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post<ApiBaseResponse<{ total_imported: number, holidays: Holiday[] }>>("/holidays/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async bulkDeleteHolidays(ids: number[]): Promise<ApiBaseResponse<{ count: number }>> {
    const response = await axiosInstance.delete<ApiBaseResponse<{ count: number }>>("/holidays/bulk", {
      data: { ids },
    });
    return response.data;
  },
};
