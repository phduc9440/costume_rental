export interface AuthResponse {
  result?: {
    token: string;
    authenticated: boolean;
  };
  message?: string;
}

export interface RegisterRequest {
  username?: string;
  password?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export type UserRole = 'ROLE_CUSTOMER' | 'ROLE_ADMIN' | 'ROLE_EMPLOYEE' | string;
