import axiosInstance from "@/lib/axios";

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface AuthResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    access_token: string;
    expires_in?: number;
  } | null;
}

export interface UserProfile {
  id: number;
  email: string;
  created_at: string;
  [key: string]: any; // Allow other properties if returned by backend
}

export interface ProfileResponse {
  status: boolean;
  code: number;
  message: string;
  data: UserProfile | null;
}

export interface GeneralResponse {
  status: boolean;
  code: number;
  message: string;
  data: any;
}

export interface RegisterPayload {
  fullname: string;
  email: string;
  password?: string;
}

export interface RegisterResponse {
  code: number;
  message: string;
  data: {
    fullname: string;
    email: string;
    updated_at: string;
    created_at: string;
    deleted_at: string | null;
  } | null;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const response = await axiosInstance.post<RegisterResponse>("/auth/register", payload);
    return response.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", payload);
    return response.data;
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>("/auth/refresh");
    return response.data;
  },

  async getProfile(): Promise<ProfileResponse> {
    const response = await axiosInstance.get<ProfileResponse>("/auth/me");
    return response.data;
  },

  async updateProfile(payload: { email?: string; password?: string }): Promise<GeneralResponse> {
    const response = await axiosInstance.put<GeneralResponse>("/auth/profile", payload);
    return response.data;
  },

  async logout(): Promise<GeneralResponse> {
    const response = await axiosInstance.post<GeneralResponse>("/auth/logout");
    return response.data;
  },
};
