/**
 * GET /api/assets/visuals/[id]
 * Securely serves persisted visual assets (SVG, PNG, JPEG, WebP)
 * Complies with Phase 7E Specification (Items 6, 7).
 */

import { NextRequest, NextResponse } from "next/server";
import { getPersistedAsset } from "@/lib/storage/visual-asset-store";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assetId = params?.id;
    if (!assetId) {
      return new NextResponse("Asset ID required", { status: 400 });
    }

    const asset = getPersistedAsset(assetId);
    if (!asset || !asset.buffer) {
      return new NextResponse("Asset not found", { status: 404 });
    }

    return new NextResponse(new Uint8Array(asset.buffer), {
      status: 200,
      headers: {
        "Content-Type": asset.mimeType || "image/png",
        "Content-Length": String(asset.byteSize),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[Visual Asset Route] Error serving asset:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
