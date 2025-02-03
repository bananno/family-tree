// TODO: clean up the remaining occurences of API_URL
const API_URL = 'http://localhost:9000';

export default async function api(path, options = {}) {
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

  return fetch(fullPath, fetchOptions);
}
