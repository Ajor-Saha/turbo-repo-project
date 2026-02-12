import axios, { AxiosError } from 'axios';
import type { 
  EncryptResponse, 
  FetchResponse, 
  DecryptResponse,
  ApiError 
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Error handler
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    return axiosError.response?.data?.message || error.message || 'Network error';
  }
  return error instanceof Error ? error.message : 'Unknown error';
};

// API Methods
export const encryptTransaction = async (
  partyId: string,
  payload: Record<string, unknown>
): Promise<EncryptResponse> => {
  const response = await apiClient.post<EncryptResponse>('/tx/encrypt', {
    partyId,
    payload,
  });
  return response.data;
};

export const fetchTransaction = async (id: string): Promise<FetchResponse> => {
  const response = await apiClient.get<FetchResponse>(`/tx/${id}`);
  return response.data;
};

export const decryptTransaction = async (id: string): Promise<DecryptResponse> => {
  const response = await apiClient.post<DecryptResponse>(`/tx/${id}/decrypt`);
  return response.data;
};
