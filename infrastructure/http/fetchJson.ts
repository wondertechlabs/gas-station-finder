export async function fetchJson<T>(
  url: string,
  init?: RequestInit,
): Promise<{ response: Response; data: T }> {
  const response = await fetch(url, init);
  const data = (await response.json()) as T;
  return { response, data };
}
