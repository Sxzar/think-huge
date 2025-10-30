const API = import.meta.env.VITE_API_URL as string;

let csrfToken: string | null = null;
export const setCsrf = (token: string | null) => { csrfToken = token;};

type HttpOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: unknown;
    headers?: Record<string, string>;
}

const needsCsrf = (method?: string) => method && !['GET', 'HEAD', 'OPTIONS'].includes(method);

export async function http<T>(path: string, opts: HttpOptions = {}): Promise<T>  {
    const method = (opts.method || 'GET').toUpperCase();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(opts.headers || {}),
    };

    if (needsCsrf(method) && csrfToken) headers['X-CSRF-Token'] = csrfToken;

    const res = await fetch(`${API}${path}`, {
        method,
        headers,
        credentials: 'include',
        body: opts.body ? JSON.stringify(opts.body) : undefined,
    });

    const data = await res.json().catch(() => ({}));
    if(!res.ok) {
        const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
        throw new Error(msg);
    }
    return data as T;
}
