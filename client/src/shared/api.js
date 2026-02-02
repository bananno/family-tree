// TODO: clean up the remaining occurences of API_URL.
const API_URL = 'http://localhost:9000';

// Returns a promise that resolves to { result, error }.
export default async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const fetchOptions = {
    credentials: 'include',
    headers,
    ...options,
  };

  if (options.body && typeof options.body === 'object') {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const fullPath = path.startsWith('/')
    ? `${API_URL}${path}`
    : `${API_URL}/${path}`;

  let response;

  try {
    response = await fetch(fullPath, fetchOptions);
  } catch (error) {
    return { error };
  }

  if (!response.ok && response.status === 404) {
    return {
      result: response,
      notFound: true,
      // should there be an error attribute here?
    };
  }

  // Parse JSON is optional. If it fails, return the response as is.
  try {
    const result = await response.json();
    return { result, error: result?.error };
  } catch (error) {
    return { result: response };
  }
}
