/**
 * Safely check if code is running in browser environment
 */
export const isBrowser = typeof window !== "undefined";

/**
 * Safely access window object
 */
export function getWindow(): Window | undefined {
  return isBrowser ? window : undefined;
}

/**
 * Safely access document object
 */
export function getDocument(): Document | undefined {
  return isBrowser ? document : undefined;
}

/**
 * Safely access localStorage
 */
export function getLocalStorage(): Storage | undefined {
  if (!isBrowser) return undefined;
  try {
    return window.localStorage;
  } catch (e) {
    console.error("localStorage not available:", e);
    return undefined;
  }
}

/**
 * Safely access sessionStorage
 */
export function getSessionStorage(): Storage | undefined {
  if (!isBrowser) return undefined;
  try {
    return window.sessionStorage;
  } catch (e) {
    console.error("sessionStorage not available:", e);
    return undefined;
  }
}