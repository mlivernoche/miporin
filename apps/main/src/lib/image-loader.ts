import fs from "node:fs/promises";
import path from "node:path";

export const ALLOWED_MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export type Image = {
  location: string;
  mimeType: string;
};

export async function isImage(location: string | null): Promise<Image | null> {
  if (!location) {
    return null;
  }

  const safeFilename = path.basename(location);
  const ext = path.extname(safeFilename).toLowerCase();

  const mimeType = ALLOWED_MIME_TYPES[ext];
  if (!mimeType) {
    return null;
  }

  const stats = await fs.stat(location);
  if (!stats.isFile()) {
    return null;
  }

  return {
    location,
    mimeType,
  };
}
