/** @internal */
export async function authenticatedPost(
  url: string,
  apiKey: string,
  data = {},
): Promise<Response> {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${apiKey}`,
  };

  return fetch(url, {
    method: 'POST',
    headers,
    mode: 'cors',
    body: JSON.stringify(data),
  });
}
