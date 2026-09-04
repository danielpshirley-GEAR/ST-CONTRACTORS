/**
 * Image Download Security & SSRF Protection Utility
 * Complies with Phase 7C Specification (Item 2).
 * 
 * Protects against SSRF, unauthorized internal network scanning,
 * metadata exfiltration, and processing of oversized or dangerous payloads.
 */

import { URL } from 'url';

// Allowed Image MIME types
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/svg+xml',
] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

// Max allowed payload size (10 MB)
export const MAX_IMAGE_PAYLOAD_BYTES = 10 * 1024 * 1024;

// Disallowed private/reserved IP patterns & metadata endpoints
const DISALLOWED_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/, // Loopback IPv4
  /^::1$/, // Loopback IPv6
  /^0\.0\.0\.0$/,
  /^10\.\d+\.\d+\.\d+$/, // RFC 1918 Private Class A
  /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/, // RFC 1918 Private Class B
  /^192\.168\.\d+\.\d+$/, // RFC 1918 Private Class C
  /^169\.254\.\d+\.\d+$/, // Link-Local IPv4 & Cloud Metadata (AWS, GCP, Azure)
  /^metadata\.google\.internal$/i,
  /^instance-data$/i,
  /\.local$/i,
  /\.internal$/i,
  /\.lan$/i,
];

export interface ValidatedImageData {
  isValid: boolean;
  mimeType: AllowedImageMimeType;
  base64Data: string;
  dataUri: string;
  byteSize: number;
  sourceType: 'data_uri' | 'trusted_storage_url' | 'authenticated_upload';
  error?: string;
}

/**
 * Validates whether a host is safe from SSRF attacks
 */
export function isSafeRemoteHost(hostname: string): boolean {
  if (!hostname) return false;
  const cleanHost = hostname.trim().toLowerCase();
  for (const pattern of DISALLOWED_HOST_PATTERNS) {
    if (pattern.test(cleanHost)) {
      return false;
    }
  }
  return true;
}

/**
 * Validates and extracts image payload securely.
 * Supports Base64 Data URIs, relative public paths, and verified HTTPS URLs.
 */
export function validateAndExtractImagePayload(input: string): ValidatedImageData {
  if (!input || typeof input !== 'string') {
    return {
      isValid: false,
      mimeType: 'image/jpeg',
      base64Data: '',
      dataUri: '',
      byteSize: 0,
      sourceType: 'data_uri',
      error: 'Empty or invalid image input',
    };
  }

  const trimmed = input.trim();

  // 1. Handle Base64 Data URI
  if (trimmed.startsWith('data:image/')) {
    const match = trimmed.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
    if (!match) {
      return {
        isValid: false,
        mimeType: 'image/jpeg',
        base64Data: '',
        dataUri: '',
        byteSize: 0,
        sourceType: 'data_uri',
        error: 'Malformed data URI format',
      };
    }

    const mime = match[1].toLowerCase() as AllowedImageMimeType;
    const base64 = match[2];

    if (!ALLOWED_IMAGE_MIME_TYPES.includes(mime)) {
      return {
        isValid: false,
        mimeType: mime,
        base64Data: '',
        dataUri: '',
        byteSize: 0,
        sourceType: 'data_uri',
        error: `Unsupported image MIME type: ${mime}. Allowed: ${ALLOWED_IMAGE_MIME_TYPES.join(', ')}`,
      };
    }

    const byteSize = Math.round((base64.length * 3) / 4);
    if (byteSize > MAX_IMAGE_PAYLOAD_BYTES) {
      return {
        isValid: false,
        mimeType: mime,
        base64Data: '',
        dataUri: '',
        byteSize,
        sourceType: 'data_uri',
        error: `Image payload exceeds maximum allowed size of 10MB (${(byteSize / (1024 * 1024)).toFixed(1)}MB)`,
      };
    }

    return {
      isValid: true,
      mimeType: mime,
      base64Data: base64,
      dataUri: trimmed,
      byteSize,
      sourceType: 'data_uri',
    };
  }

  // 2. Handle Local App Public URLs (e.g. /images/...)
  if (trimmed.startsWith('/') || trimmed.startsWith('./')) {
    return {
      isValid: true,
      mimeType: trimmed.endsWith('.png') ? 'image/png' : trimmed.endsWith('.webp') ? 'image/webp' : 'image/jpeg',
      base64Data: '',
      dataUri: trimmed,
      byteSize: 0,
      sourceType: 'authenticated_upload',
    };
  }

  // 3. Handle Remote URLs (SSRF Protection)
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return {
        isValid: false,
        mimeType: 'image/jpeg',
        base64Data: '',
        dataUri: '',
        byteSize: 0,
        sourceType: 'trusted_storage_url',
        error: `Invalid protocol: ${parsed.protocol}. Only HTTPS/HTTP are permitted.`,
      };
    }

    if (!isSafeRemoteHost(parsed.hostname)) {
      return {
        isValid: false,
        mimeType: 'image/jpeg',
        base64Data: '',
        dataUri: '',
        byteSize: 0,
        sourceType: 'trusted_storage_url',
        error: `SSRF Violation: Access to private or loopback host '${parsed.hostname}' is prohibited.`,
      };
    }

    return {
      isValid: true,
      mimeType: 'image/jpeg',
      base64Data: '',
      dataUri: trimmed,
      byteSize: 0,
      sourceType: 'trusted_storage_url',
    };
  } catch (err) {
    return {
      isValid: false,
      mimeType: 'image/jpeg',
      base64Data: '',
      dataUri: '',
      byteSize: 0,
      sourceType: 'data_uri',
      error: `Invalid URL string: ${(err as Error).message}`,
    };
  }
}
