import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  sub: string;
  scope: string;
  iss: string;
  exp: number;
}

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('cart');
};

export const getRoleFromToken = (): string | null => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.scope;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

export const getUserIdFromToken = (): string | null => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.sub;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  // We can add logic to check if token is expired here
  return !!token;
};
