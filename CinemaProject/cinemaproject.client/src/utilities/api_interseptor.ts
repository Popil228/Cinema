import { tokenStorage } from '../api/authApi';
import { handleHttpStatus } from './apiUtils';
import { UnauthorizedError, HttpError } from '../errors/httpErrors';

// Global fetch interceptor to handle token expiration and map HTTP statuses to typed errors
export function setupApiInterceptor(onTokenExpired: () => void) {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    let [resource, config] = args as [RequestInfo, RequestInit | undefined];

    const token = tokenStorage.getToken();
    const user = tokenStorage.getUser();

    // check expiration if user was logged in
    if (token && user && tokenStorage.isTokenExpired()) {
      onTokenExpired();
      return Promise.reject(new UnauthorizedError('Token expired'));
    }

    // attach Authorization header if token present and config.headers is writable
    if (token) {
      const headers = new Headers(config?.headers as HeadersInit);
      if (!headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      config = { ...(config || {}), headers };
    }

    const response = await originalFetch(resource, config);

    try {
      // Convert common HTTP statuses to typed errors
      handleHttpStatus(response);
    } catch (err) {
      // If unauthorized and user was logged in trigger token expired flow
      if (err instanceof UnauthorizedError && user) {
        onTokenExpired();
      }
      // rethrow typed error so callers can handle it
      if (err instanceof HttpError || err instanceof Error) throw err;
      throw new Error('Unknown HTTP error');
    }

    return response;
  };
}
