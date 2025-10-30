import {http} from './http';
import type { ReportSummary } from '../types/reports';

export function getSummary(params?: { client_id?:number; from?: string; to?: string; page?: number; limit?: number;}) {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
    });
    return http<ReportSummary>(`/reports/summary${query.toString() ? `?${query}` : ''}`);
}
