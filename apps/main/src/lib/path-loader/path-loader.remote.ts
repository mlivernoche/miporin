import * as v from "valibot";
import { query } from "$app/server";
import fs from "node:fs/promises";
import path from "node:path";
import { isImage } from "$lib/image-loader";

export type Path = {
  location: string;
  parent: string;
  content:
    | {
        type: "directory";
        thumbnail: string | null | undefined;
        children: Path[];
      }
    | {
        type: "image";
      };
};

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

async function findThumbnail(dirLocation: string): Promise<string | undefined> {
  try {
    const files = await fs.readdir(dirLocation);
    for (const file of files) {
      const fullPath = path.join(dirLocation, file);
      const img = await isImage(fullPath);
      if (img) return img.location;
    }
  } catch {
    // Directory unreadable or no permission
  }
  return undefined;
}

async function ReadDirectory(location: string, depth = 0): Promise<Path[]> {
  let files: string[];
  try {
    files = await fs.readdir(location);
  } catch (err) {
    console.warn(`Cannot read directory "${location}":`, err);
    return [];
  }

  const children = files.toSorted((x, y) => collator.compare(x, y));
  const tree = await Promise.all(
    children.map(async (child) => {
      try {
        return await BuildFileTree(path.join(location, child), depth + 1);
      } catch {
        return null;
      }
    }),
  );
  return tree.filter((tree): tree is Path => !!tree);
}

async function BuildFileTree(location: string, depth = 0): Promise<Path | null> {
  const stats = await fs.stat(location);
  const parent = path.dirname(location);

  if (stats.isDirectory()) {
    let children: Path[] = [];
    let thumbnail: string | null | undefined = undefined;

    if (depth === 0) {
      children = await ReadDirectory(location, depth);
      thumbnail = children.find((child) => child.content.type === "image")?.location;
    } else {
      thumbnail = await findThumbnail(location);
    }

    return {
      location,
      parent,
      content: {
        type: "directory",
        children,
        thumbnail,
      },
    };
  }

  const file = await isImage(location);

  if (file) {
    return {
      location,
      parent,
      content: {
        type: "image",
      },
    };
  }

  return null;
}

async function getDefaultLocation(): Promise<string> {
  if (process.env.MEDIA_DIR) return process.env.MEDIA_DIR;
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  if (process.env.DEFAULT_LOCATION) return process.env.DEFAULT_LOCATION;

  try {
    const stat = await fs.stat("/share");
    if (stat.isDirectory()) return "/share";
  } catch {
    // /share is not mounted
  }

  return process.cwd();
}

const location = v.optional(
  v.object({
    location: v.nullable(v.string()),
  }),
);

export const getPath = query(location, async (params): Promise<Path | null> => {
  const defaultLocation = await getDefaultLocation();
  const location = params?.location || defaultLocation;

  try {
    return await BuildFileTree(location, 0);
  } catch (err) {
    console.error(`Error loading path "${location}":`, err);
    return null;
  }
});

export type Navigation = {
  position?: {
    spot: number;
    total: number;
  };
  first?: Path;
  last?: Path;
  left?: Path;
  right?: Path;
};

export const getNavigation = query(location, async (params): Promise<Navigation> => {
  const location = params?.location;

  if (!location) {
    return {};
  }

  const stats = await fs.stat(location);

  if (!stats.isFile()) {
    return {};
  }

  const tree = await BuildFileTree(path.dirname(location));

  if (!tree) {
    return {};
  }

  if (tree.content.type === "image") {
    return {};
  }

  const first = tree.content.children[0];
  const last = tree.content.children[tree.content.children.length - 1];
  let left: Path | undefined = undefined;
  let right: Path | undefined = undefined;
  let spot = 1;
  const total = tree.content.children.filter((child) => child.content.type === "image").length;
  let locationFound = false;

  for (let i = 0; i < tree.content.children.length; i++) {
    const curr = tree.content.children[i];

    if (curr.location === location) {
      locationFound = true;
    } else if (curr.content.type == "image") {
      if (!locationFound) {
        spot++;
        left = curr;
      }

      if (locationFound && !right) {
        right = curr;
      }
    }

    if (left && right) {
      break;
    }
  }

  return {
    position: {
      spot,
      total,
    },
    first,
    last,
    left,
    right,
  };
});
