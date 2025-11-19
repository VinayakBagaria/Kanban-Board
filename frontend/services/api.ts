const API_BASE_URL = "http://localhost:8000/api";

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options });
  const json = await response.json();
  return json;
}
