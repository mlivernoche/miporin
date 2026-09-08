import { openAsBlob } from "node:fs";
import { error, type RequestHandler } from "@sveltejs/kit";
import { isImage } from "$lib/image-loader";

export const GET: RequestHandler = async ({ url }) => {
  const image = await isImage(url.searchParams.get("location"));

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
