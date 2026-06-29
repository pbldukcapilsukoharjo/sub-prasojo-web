import axiosInstance from "@/lib/axios";

export interface ApiBaseResponse<T = any> {
  status: boolean;
  code: number;
  message: string;
  data: T;
}

export interface RegisterPayload {
  fullname: string;
  email: string;
  password?: string;
  password_confirmation?: string;
}

export interface RegisterData {
  fullname: string;
  email: string;
  updated_at: string;
  created_at: string;
  deleted_at: string | null;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface AuthTokenData {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

export interface UserProfile {
  id: number;
  fullname?: string;
  email: string;
  created_at: string;
  [key: string]: any;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password?: string;
  password_confirmation?: string;
}

export type RegisterResponse = ApiBaseResponse<RegisterData | null>;
export type LoginResponse = ApiBaseResponse<AuthTokenData | null>;
export type GeneralResponse = ApiBaseResponse<any>;
export type ProfileResponse = ApiBaseResponse<UserProfile | null>;

export const authService = {
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const response = await axiosInstance.post<RegisterResponse>("/auth/register", payload);
    return response.data;
  },

  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>("/auth/login", payload);
    return response.data;
  },

  async refreshToken(): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>("/auth/refresh");
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

  async forgotPassword(payload: ForgotPasswordPayload): Promise<GeneralResponse> {
    const response = await axiosInstance.post<GeneralResponse>("/auth/forgot-password", payload);
    return response.data;
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<GeneralResponse> {
    const response = await axiosInstance.post<GeneralResponse>("/auth/reset-password", payload);
    return response.data;
  },

  async resendVerification(): Promise<GeneralResponse> {
    const response = await axiosInstance.post<GeneralResponse>("/email/resend");
    return response.data;
  },

  async checkEmailVerify(): Promise<GeneralResponse> {
    const response = await axiosInstance.get<GeneralResponse>("/email/verify");
    return response.data;
  },
};
