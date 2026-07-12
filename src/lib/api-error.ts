import toast from "react-hot-toast";

export interface ApiErrorPayload {
  status?: boolean;
  code?: number;
  message?: string;
  data?: Record<string, string[]> | any;
}

export function parseApiError(error: any): { message: string; fieldErrors?: Record<string, string[]> } {
  if (error?.response?.data) {
    const data: ApiErrorPayload = error.response.data;
    const message = data.message || "Terjadi kesalahan pada server.";
    
    let fieldErrors: Record<string, string[]> | undefined;
    if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
      fieldErrors = data.data;
    }
    
    return { message, fieldErrors };
  }
  
  if (error?.message === "Network Error") {
    return { message: "Tidak dapat terhubung ke server. Periksa koneksi internet Anda." };
  }

  return { message: error?.message || "Terjadi kesalahan yang tidak diketahui." };
}

export function handleApiError(error: any, setError?: (field: any, error: { type: string; message: string }) => void) {
  const { message, fieldErrors } = parseApiError(error);

  if (fieldErrors && setError) {
    let firstFieldErrorHandled = false;
    Object.entries(fieldErrors).forEach(([field, messages]) => {
      if (messages && messages.length > 0) {
        setError(field, { type: "server", message: messages[0] });
        if (!firstFieldErrorHandled) {
          toast.error(messages[0]);
          firstFieldErrorHandled = true;
        }
      }
    });
    if (!firstFieldErrorHandled && message) {
      toast.error(message);
    }
  } else {
    toast.error(message);
  }
}
