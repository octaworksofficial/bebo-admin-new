// Utility to ensure image URLs are absolute in production
import { environment } from '../../../environments/environment';

/**
 * Returns an absolute image URL for /api/files/... paths in production.
 * If the URL is already absolute or not a file, returns as is.
 * 
 * @param url - The image URL to convert
 * @param domain - Optional domain override: 'www' for user-generated, 'admin' for production (default)
 */
export function getAbsoluteImageUrl(url: string | null | undefined, domain: 'www' | 'admin' = 'admin'): string | null {
  if (!url) return null;
  // If already absolute (http/https), return as is
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/api/files')) {
    const baseUrl = domain === 'www' ? 'https://www.birebiro.com' : 'https://admin.birebiro.com';
    return `${baseUrl}${url}`;
  }
  return url;
}