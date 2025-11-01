import { http } from './http';
import type { Admin, LoginResponse } from '../types/auth';

export async function login(email: string, password: string) {
    return http<LoginResponse>('/auth/login', {
        method: 'POST',
        body: {email, password},
    });
}


export function me() {
  return http<{ admin: Admin; csrf: string }>('/auth/me');
}

export async function logout() {
    return http<{ok: true}>('/auth/logout', { method: 'POST' });
}