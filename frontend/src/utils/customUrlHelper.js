import { fetchCustomUrls } from '../services/api';

let cachedCustomUrls = [];

export const loadCustomUrlMappings = async () => {
  try {
    const res = await fetchCustomUrls();
    cachedCustomUrls = res.data || [];
    return cachedCustomUrls;
  } catch (err) {
    console.error('Error loading custom URL mappings:', err);
    return [];
  }
};

/**
 * Returns the configured active customPath for a targetUrl (e.g., '/contact' -> '/contact-us')
 * If no custom path is configured, returns default targetPath.
 */
export const getCustomPath = (targetPath) => {
  if (!targetPath) return '';
  const trimmed = targetPath.trim();
  if (trimmed === '#' || trimmed.startsWith('#')) return trimmed;
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('javascript:')
  ) {
    return trimmed;
  }

  const [path, hash] = targetPath.split('#');
  const hashSuffix = hash ? `#${hash}` : '';

  if (!cachedCustomUrls || cachedCustomUrls.length === 0) return targetPath;

  const normalizedTarget = (path || '').toLowerCase().trim();
  const match = cachedCustomUrls.find(
    (item) => item.active !== false && item.targetUrl && item.targetUrl.toLowerCase().trim() === normalizedTarget
  );

  if (!match || !match.customPath) return targetPath;

  const resolved = match.customPath.toLowerCase().trim();

  // Prevent cross-contamination: non-contact target resolving to contact customPath
  const isTargetContact = normalizedTarget.includes('contact');
  const isResolvedContact = resolved.includes('contact');
  if (!isTargetContact && isResolvedContact) {
    return path + hashSuffix;
  }

  return match.customPath + hashSuffix;
};
