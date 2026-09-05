import axios from "axios";

interface ApiErrorBody {
  message?: string;
  meta?: {
    fieldErrors?: Record<string, string>;
  };
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const fieldErrors = error.response?.data.meta?.fieldErrors;
    const fieldErrorMessage = fieldErrors ? Object.values(fieldErrors).join(" ") : undefined;

    if (fieldErrorMessage) return fieldErrorMessage;
    if (error.response?.data.message) return error.response.data.message;
    if (!error.response) return "Không thể kết nối đến máy chủ. Vui lòng thử lại.";
  }

  return error instanceof Error ? error.message : fallback;
}
