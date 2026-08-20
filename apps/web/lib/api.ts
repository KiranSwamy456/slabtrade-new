const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type ApiRequestOptions = RequestInit & {
  token?: string;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as T;
}
