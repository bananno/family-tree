// TODO: clean up the remaining occurences of API_URL.
// TODO: update everything to the catchPlease version, then remove catchPlease.
const API_URL = 'http://localhost:9000';

export default async function api(path, options = {}) {
  if (!options.catchPlease) {
    console.warn('Update api() usage with catchPlease');
  }

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const fetchOptions = {
    headers,
    ...options,
  };

  const fullPath = path.startsWith('/')
    ? `${API_URL}${path}`
    : `${API_URL}/${path}`;

  if (!options.catchPlease) {
    return fetch(fullPath, fetchOptions);
  }

  let response;

  try {
    response = await fetch(fullPath, fetchOptions);
  } catch (error) {
    return { error };
  }

  // Parse JSON is optional. If it fails, return the response as is.
  try {
    const result = await response.json();
    return { result, error: result?.error };
  } catch (error) {
    return { result: response };
  }
}
