/**
 * Persistent Visual Asset Storage & Editable Asset Resolver
 * Complies with Phase 7E Specification (Items 6, 7, 8, 10).
 * 
 * Normalises temporary AI provider URLs and data URIs into persistent,
 * validated, and authenticated project assets for sequential editing and provenance.
 */

import { validateAndExtractImagePayload, isSafeRemoteHost } from "@/lib/security/image-security";

export interface PersistedVisualAsset {
  assetId: string;
  assetUrl: string;
  mimeType: string;
  byteSize: number;
  version: number;
  prompt: string;
  projectId?: string;
  sourceVersion?: number;
  sourceAssetId?: string;
  branchId?: string;
  timestamp: string;
  buffer?: Buffer;
}

export interface PersistImageOptions {
  imagePayload: string | Buffer;
  mimeType?: string;
  version: number;
  prompt: string;
  projectId?: string;
  sourceVersion?: number;
  sourceAssetId?: string;
  branchId?: string;
}

export interface ResolvedEditableAsset {
  isValid: boolean;
  imageBuffer?: Buffer;
  base64Data?: string;
  dataUri?: string;
  mimeType?: string;
  fileSize?: number;
  error?: string;
}

// Global In-Memory Asset Cache (persists across API invocations in runtime process)
const inMemoryAssetRegistry = new Map<string, PersistedVisualAsset>();

/**
 * Normalises and stores any AI-generated image (data URI, HTTPS URL, or Buffer)
 * into a persistent internal project asset.
 */
export async function persistGeneratedImageAsset(options: PersistImageOptions): Promise<PersistedVisualAsset> {
  const assetId = "vis-asset-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);
  const timestamp = new Date().toISOString();
  let imageBuffer: Buffer;
  let resolvedMime = options.mimeType || "image/png";

  // 1. Handle SVG Data URI
  if (typeof options.imagePayload === "string" && (options.imagePayload.startsWith("data:image/svg+xml") || options.imagePayload.includes("<svg"))) {
    const svgString = options.imagePayload.startsWith("data:image/svg+xml;utf8,")
      ? decodeURIComponent(options.imagePayload.replace("data:image/svg+xml;utf8,", ""))
      : options.imagePayload;
    
    imageBuffer = Buffer.from(svgString, "utf8");
    resolvedMime = "image/svg+xml";
    const assetUrl = "/api/assets/visuals/" + assetId;

    const persisted: PersistedVisualAsset = {
      assetId,
      assetUrl,
      mimeType: resolvedMime,
      byteSize: imageBuffer.length,
      version: options.version,
      prompt: options.prompt,
      projectId: options.projectId,
      sourceVersion: options.sourceVersion,
      sourceAssetId: options.sourceAssetId,
      branchId: options.branchId,
      timestamp,
      buffer: imageBuffer,
    };

    inMemoryAssetRegistry.set(assetId, persisted);
    await writeAssetToDisk(assetId, "svg", imageBuffer);
    return persisted;
  }

  // 2. Handle Base64 Data URI
  if (typeof options.imagePayload === "string" && options.imagePayload.startsWith("data:image/")) {
    const validated = validateAndExtractImagePayload(options.imagePayload);
    if (!validated.isValid) {
      throw new Error("Cannot persist invalid image payload: " + validated.error);
    }
    imageBuffer = Buffer.from(validated.base64Data, "base64");
    resolvedMime = validated.mimeType;
  } else if (Buffer.isBuffer(options.imagePayload)) {
    imageBuffer = options.imagePayload;
  } else if (typeof options.imagePayload === "string" && options.imagePayload.startsWith("http")) {
    // 3. Handle Remote Ephemeral HTTPS URL (e.g. from DALL-E / OpenAI temporary storage)
    const parsed = new URL(options.imagePayload);
    if (!isSafeRemoteHost(parsed.hostname)) {
      throw new Error("SSRF Security Violation: Cannot persist asset from unsafe host: " + parsed.hostname);
    }

    const res = await fetch(options.imagePayload, {
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      throw new Error("Failed to download remote provider visual asset: HTTP " + res.status);
    }

    const arrayBuf = await res.arrayBuffer();
    imageBuffer = Buffer.from(arrayBuf);
    const contentType = res.headers.get("content-type") || "image/png";
    resolvedMime = contentType.split(";")[0].trim();
  } else {
    throw new Error("Unsupported image payload format for asset persistence");
  }

  // Validate byte size limit (15MB)
  if (imageBuffer.length > 15 * 1024 * 1024) {
    throw new Error("Asset size exceeds maximum limit of 15MB");
  }

  const ext = resolvedMime.includes("jpeg") || resolvedMime.includes("jpg")
    ? "jpg"
    : resolvedMime.includes("webp")
    ? "webp"
    : "png";

  const assetUrl = "/uploads/generated/" + assetId + "." + ext;

  const persisted: PersistedVisualAsset = {
    assetId,
    assetUrl,
    mimeType: resolvedMime,
    byteSize: imageBuffer.length,
    version: options.version,
    prompt: options.prompt,
    projectId: options.projectId,
    sourceVersion: options.sourceVersion,
    sourceAssetId: options.sourceAssetId,
    branchId: options.branchId,
    timestamp,
    buffer: imageBuffer,
  };

  inMemoryAssetRegistry.set(assetId, persisted);
  await writeAssetToDisk(assetId, ext, imageBuffer);

  return persisted;
}

/**
 * Resolves any image asset (Data URI, internal storage path, or /api/assets/... URL)
 * into validated image bytes for sequential AI image-to-image editing.
 * Rejects arbitrary untrusted external URLs (SSRF protection).
 */
export async function resolveEditableImageAsset(imageUrlOrDataUri: string): Promise<ResolvedEditableAsset> {
  if (!imageUrlOrDataUri || typeof imageUrlOrDataUri !== "string") {
    return { isValid: false, error: "Empty or invalid image source identifier" };
  }

  const trimmed = imageUrlOrDataUri.trim();

  // 1. Data URI Input
  if (trimmed.startsWith("data:image/")) {
    const validated = validateAndExtractImagePayload(trimmed);
    if (!validated.isValid) {
      return { isValid: false, error: validated.error };
    }
    const buf = Buffer.from(validated.base64Data, "base64");
    return {
      isValid: true,
      imageBuffer: buf,
      base64Data: validated.base64Data,
      dataUri: trimmed,
      mimeType: validated.mimeType,
      fileSize: buf.length,
    };
  }

  // 2. Check In-Memory Asset Cache
  for (const [id, asset] of Array.from(inMemoryAssetRegistry.entries())) {
    if (trimmed.includes(id) || trimmed === asset.assetUrl) {
      if (asset.buffer) {
        const b64 = asset.buffer.toString("base64");
        return {
          isValid: true,
          imageBuffer: asset.buffer,
          base64Data: b64,
          dataUri: "data:" + asset.mimeType + ";base64," + b64,
          mimeType: asset.mimeType,
          fileSize: asset.byteSize,
        };
      }
    }
  }

  // 3. Check Disk Storage (e.g. /uploads/generated/...)
  if (trimmed.startsWith("/uploads/") || trimmed.startsWith("uploads/")) {
    try {
      if (typeof window === "undefined") {
        const fsPromises = eval("require")("fs/promises");
        const pathModule = eval("require")("path");
        const filePath = pathModule.join(process.cwd(), "public", trimmed.startsWith("/") ? trimmed.slice(1) : trimmed);
        const fileBytes = await fsPromises.readFile(filePath);
        const mime = trimmed.endsWith(".png") ? "image/png" : trimmed.endsWith(".webp") ? "image/webp" : "image/jpeg";
        const b64 = fileBytes.toString("base64");
        return {
          isValid: true,
          imageBuffer: fileBytes,
          base64Data: b64,
          dataUri: "data:" + mime + ";base64," + b64,
          mimeType: mime,
          fileSize: fileBytes.length,
        };
      }
    } catch (err) {
      // Continue
    }
  }

  // 4. Remote URLs: Validate against SSRF and extract bytes
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const parsed = new URL(trimmed);
      if (!isSafeRemoteHost(parsed.hostname)) {
        return { isValid: false, error: "SSRF Violation: Forbidden host: " + parsed.hostname };
      }

      const res = await fetch(trimmed, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) {
        return { isValid: false, error: "Failed to fetch image: HTTP " + res.status };
      }

      const contentType = (res.headers.get("content-type") || "image/png").split(";")[0].trim();
      const arrayBuf = await res.arrayBuffer();
      const buf = Buffer.from(arrayBuf);
      const b64 = buf.toString("base64");

      return {
        isValid: true,
        imageBuffer: buf,
        base64Data: b64,
        dataUri: "data:" + contentType + ";base64," + b64,
        mimeType: contentType,
        fileSize: buf.length,
      };
    } catch (err) {
      return { isValid: false, error: "Error resolving remote asset: " + (err as Error).message };
    }
  }

  return { isValid: false, error: "Could not resolve image bytes from supplied source identifier" };
}

/**
 * Retrieves an in-memory or persisted visual asset by ID
 */
export function getPersistedAsset(assetId: string): PersistedVisualAsset | undefined {
  return inMemoryAssetRegistry.get(assetId);
}

/**
 * Helper to write asset to public/uploads/generated
 */
async function writeAssetToDisk(assetId: string, ext: string, buffer: Buffer): Promise<void> {
  if (typeof window !== "undefined") return;
  try {
    const fsPromises = eval("require")("fs/promises");
    const pathModule = eval("require")("path");
    const uploadDir = pathModule.join(process.cwd(), "public", "uploads", "generated");
    await fsPromises.mkdir(uploadDir, { recursive: true });
    const fullPath = pathModule.join(uploadDir, assetId + "." + ext);
    await fsPromises.writeFile(fullPath, buffer);
  } catch (err) {
    console.warn("[Visual Asset Store] Disk write skipped or failed (in-memory cache preserved):", err);
  }
}
