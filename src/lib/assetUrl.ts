// Resolve image URLs that may be local /src/assets paths or external URLs
const localAssets = import.meta.glob('/src/assets/*', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

export function resolveImageUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/src/assets/')) {
    return localAssets[url] ?? url;
  }
  return url;
}