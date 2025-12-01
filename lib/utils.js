/**
 * Production-ready utility functions
 */

/**
 * Get the base URL for API calls
 * Works in both development and production (Vercel, Netlify, custom servers, etc.)
 */
export async function getBaseUrl() {
  // Browser runtime always has the correct origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Prefer explicit environment variables
  const explicitEnvUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.NEXTAUTH_URL;

  if (explicitEnvUrl) {
    return explicitEnvUrl;
  }

  // Platform provided envs
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.URL) {
    return process.env.URL.startsWith('http')
      ? process.env.URL
      : `https://${process.env.URL}`;
  }

  // Derive from the incoming request (SSR/Route handlers)
  try {
    // IMPORTANT: In Next.js 14, headers() is async
    const headers = await import('next/headers');
    const headerList = await headers.headers();
    
    const host =
      headerList.get('x-forwarded-host') ||
      headerList.get('host');

    if (host) {
      const protocol = headerList.get('x-forwarded-proto') || 'https';
      return `${protocol}://${host}`;
    }
  } catch (error) {
    // headers() throws outside of a request context (e.g., during build)
    console.warn('Could not get headers:', error.message);
  }

  // Fallback for local development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // Production fallback - caller should provide explicit base URL to avoid relative fetches
  return '';
}

/**
 * Build API URL
 */
export async function getApiUrl(endpoint = '') {
  const baseUrl = await getBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (!baseUrl) {
    return cleanEndpoint;
  }

  try {
    return new URL(cleanEndpoint, baseUrl).toString();
  } catch (error) {
    // Fallback to string concatenation if URL construction fails
    return `${baseUrl.replace(/\/$/, '')}${cleanEndpoint}`;
  }
}

/**
 * Check if running on Vercel
 */
export function isVercel() {
  return process.env.VERCEL === '1';
}

/**
 * Check if running in production
 */
export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Logger utility - replaces console.log/error for production
 */
export const logger = {
  log: (...args) => {
    if (!isProduction()) {
      console.log(...args);
    }
  },
  error: (...args) => {
    // Always log errors, but format them properly
    console.error('[ERROR]', ...args);
  },
  warn: (...args) => {
    if (!isProduction()) {
      console.warn('[WARN]', ...args);
    }
  },
  info: (...args) => {
    if (!isProduction()) {
      console.info('[INFO]', ...args);
    }
  },
};

/**
 * Validate environment variables
 */
export function validateEnv() {
  const required = ['MONGODB_URI'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Sanitize filename for safe storage
 */
export function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-z0-9.-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

/**
 * Format error response
 */
export function formatErrorResponse(error, statusCode = 500) {
  const isDev = !isProduction();
  
  return {
    error: error.message || 'An error occurred',
    ...(isDev && { details: error.stack }),
    timestamp: new Date().toISOString(),
  };
}