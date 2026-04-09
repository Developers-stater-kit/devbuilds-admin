import "server-only";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "your_secret_key_here";

type FetchBackendOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: HeadersInit;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export async function fetchBackend<T = any>(
  endpoint: string,
  options: FetchBackendOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    cache = "no-store",
    next,
  } = options;

  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ADMIN_API_KEY,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next,
  });

  if (!res.ok) {
    let errorMessage = `Backend request failed: ${res.status} ${res.statusText}`;

    try {
      const errorData = await res.json();
      errorMessage = errorData?.message || errorMessage;
    } catch {}

    throw new Error(errorMessage);
  }

  return res.json();
}