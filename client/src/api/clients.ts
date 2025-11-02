import { http } from "./http";

export type Client = {
    id: number;
    name: string;
    email?: string;
    note?: string;
    created_at: string;
}

export type PaginatedClients = {
    data: Client[];
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export function listClients(page = 1, limit = 20) {
    return http<PaginatedClients>(`/clients?page=${page}&limit=${limit}`);
}

export function createClient(payload: { name: string; email?: string; note?: string }) {
  return http<Client>("/clients", {
    method: "POST",
    body: payload,
  });
}


export function updateClient(id: number, payload: { name: string, email?: string, note?: string }) {
    return http(`/clients/${id}`, {
        method: 'PUT',
        body: payload,
    });
}

export function deleteClient(id: number) {
    return http(`/clients/${id}`, {
        method: 'DELETE',
    });
}
