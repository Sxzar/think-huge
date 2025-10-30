export type Movement = {
    id: number;
    client_id: number;
    type: 'earning' | 'expense';
    amount: number;
    description: string | null;
    occurred_at: string;
    created_at: string;
}

export type ReportSummary = {
    range: {from: string | null; to: string | null};
    totals: {earnings: number; expenses: number; balance: number};
    filters: { client_id?: number };
    movements: { data: Movement[]; page: number; limit: number; total: number; pages: number};
}
