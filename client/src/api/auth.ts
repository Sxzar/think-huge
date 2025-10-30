import { http } from './http';
import type { Admin, LoginResponse } from '../types/auth';

export async function login(email: string, password: string) {
    return http<LoginResponse>('/auth/login', {
        method: 'POST',
        body: {email, password},
    });
}

export async function me() {
    return http<{admin: Admin; csrf: string}>('/auth/me', { method: 'GET' });
}

export async function logout() {
    return http<{ok: true}>('/auth/logout', { method: 'POST' });
}