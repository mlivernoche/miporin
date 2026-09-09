import { openAsBlob } from "node:fs";
import { error, type RequestHandler } from "@sveltejs/kit";
import { isImage } from "$lib/image-loader";
import path from "node:path";

export const GET: RequestHandler = async ({ url }) => {
  const fullPath = path.join(
    url.searchParams.get("location") ?? "",
    url.searchParams.get("name") ?? "",
  );
  const image = await isImage(fullPath);

  if (!image) {
    throw error(404, "Image not found");
  }

  const blob = await openAsBlob(image.location, { type: image.mimeType });

  return new Response(blob, {
    headers: {
      "Content-Type": image.mimeType,
      "Cache-Control": "public, max-age=3600",
    },
  });
};
