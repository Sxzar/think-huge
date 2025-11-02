import { http } from "./http";

export function addClientTransaction(
  clientId: number,
  payload: {
    type: "earning" | "expense";
    amount: number;
    occurred_at: string;
    description?: string;
  }
) {
  return http(`/clients/${clientId}/transactions`, {
    method: "POST",
    body: payload,
  });
}

export function updateTransaction(
  id: number,
  payload: {
    type?: "earning" | "expense";
    amount?: number;
    occurred_at?: string;
    description?: string;
  }
) {
  return http(`/transactions/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export function deleteTransaction(id: number) {
  return http(`/transactions/${id}`, {
    method: "DELETE",
  });
}
