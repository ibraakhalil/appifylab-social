import { mkdirSync } from "node:fs";
import { extname, resolve } from "node:path";

import { badRequest } from "@/lib/errors";

const MAX_POST_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const postImagesDirectory = resolve(process.cwd(), "public", "posts");

const imageExtensionsByMimeType = new Map<string, string>([
  ["image/gif", ".gif"],
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

const allowedImageExtensions = new Set(imageExtensionsByMimeType.values());

mkdirSync(postImagesDirectory, { recursive: true });

const resolveImageExtension = (file: File) => {
  const mimeType = file.type.toLowerCase();

  if (mimeType) {
    const extension = imageExtensionsByMimeType.get(mimeType);

    if (!extension) {
      throw badRequest("Only JPG, PNG, WEBP, and GIF images are allowed.");
    }

    return extension;
  }

  const extension = extname(file.name).toLowerCase();

  if (!allowedImageExtensions.has(extension)) {
    throw badRequest("Only JPG, PNG, WEBP, and GIF images are allowed.");
  }

  return extension;
};

export const storePostImage = async (file: File, requestUrl: string) => {
  if (!file.size) {
    throw badRequest("Uploaded image cannot be empty.");
  }

  if (file.size > MAX_POST_IMAGE_SIZE_BYTES) {
    throw badRequest("Image size must be 5 MB or smaller.");
  }

  const extension = resolveImageExtension(file);
  const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`;
  const filePath = resolve(postImagesDirectory, filename);
  const imagePath = `/public/posts/${filename}`;

  await Bun.write(filePath, file);

  return new URL(imagePath, requestUrl).toString();
};
