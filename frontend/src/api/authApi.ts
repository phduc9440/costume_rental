import apiClient from './apiClient';
import type { AuthResponse, RegisterRequest } from '../types/auth';

export const authApi = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/member/auth/login', {
      username,
      password,
    });
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<any> => {
    const response = await apiClient.post('/member/auth/register', data);
    return response.data;
  },
};
