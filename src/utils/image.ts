/**
 * Optimizes an image URL.
 * If the image is from raw.githubusercontent.com, it uses the highly reliable,
 * open-source wsrv.nl CDN to resize, compress, and serve it in next-gen webp format.
 * If the image is from Unsplash, it uses Unsplash's native URL parameters.
 */
export function getOptimizedImageUrl(url: string | undefined, width: number = 500): string {
  if (!url) return '';

  // If already optimized or is a data URI, return as-is
  if (url.startsWith('data:') || url.includes('wsrv.nl') || url.includes('weserv.nl')) {
    return url;
  }

  // Handle Unsplash images which have native optimization parameters
  if (url.includes('images.unsplash.com')) {
    // If it already has sizing parameters, respect them, otherwise append
    if (url.includes('w=') || url.includes('width=')) {
      return url;
    }
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&auto=format&fit=crop&q=75`;
  }

  // Handle raw github content or any other external images using the wsrv.nl proxy
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Clean URL to handle double slashes or spaces correctly
    const cleanUrl = url.trim();
    // We use wsrv.nl (Cloudflare-backed image cache & resize service)
    return `https://wsrv.nl/?url=${encodeURIComponent(cleanUrl)}&w=${width}&output=webp&q=80`;
  }

  return url;
}
