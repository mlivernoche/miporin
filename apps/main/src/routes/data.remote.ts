import * as v from "valibot";
import { query } from "$app/server";
import fs from "node:fs/promises";
import path from "node:path";
import { isImage } from "$lib/image-loader";

export type Path = {
  location: string;
  parent: string;
  children: Path[];
  thumbnail: string | null | undefined;
};

async function ReadDirectory(location: string): Promise<Path[]> {
  const children = await fs.readdir(location);
  const tree = await Promise.all(
    children.map((child) => BuildFileTree(path.join(location, child))),
  );
  return tree.filter((tree) => !!tree);
}

async function BuildFileTree(location: string): Promise<Path | null> {
  const stats = await fs.stat(location);
  const parent = path.dirname(location);

  if (stats.isDirectory()) {
    const children = await ReadDirectory(location);
    const thumbnail = children.find((child) => child.thumbnail !== null)?.thumbnail;

    return {
      location,
      parent,
      children,
      thumbnail,
    };
  }

  const file = await isImage(location);

  if (file) {
    return {
      location,
      parent,
      children: [],
      thumbnail: location,
    };
  }

  return null;
}

export const getPath = query(
  v.optional(
    v.object({
      location: v.nullable(v.string()),
    }),
  ),
  async (params): Promise<Path | null> => {
    const location = params?.location ?? process.cwd();

    try {
      return BuildFileTree(location);
    } catch {
      return {
        location,
        parent: location,
        children: [],
        thumbnail: null,
      };
    }
  },
);
