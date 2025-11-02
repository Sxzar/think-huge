import { http } from "./http";

export type AdminUser = {
  id: number;
  email: string;
  created_at: string;
};

export type PaginatedAdmins = {
  data: AdminUser[];
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export function listAdmins(page = 1, limit = 20) {
  return http<PaginatedAdmins>(`/admins?page=${page}&limit=${limit}`);
}

export function createAdmin(payload: { email: string; password: string }) {
  return http(`/admins`, {
    method: "POST",
    body: payload,
  });
}

export function updateAdmin(
  id: number,
  payload: { email: string; password?: string }
) {
  return http(`/admins/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export function deleteAdmin(id: number) {
  return http(`/admins/${id}`, {
    method: "DELETE",
  });
}
