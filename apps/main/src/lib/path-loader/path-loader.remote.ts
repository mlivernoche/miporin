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

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

async function ReadDirectory(location: string): Promise<Path[]> {
  const children = (await fs.readdir(location)).toSorted((x, y) => collator.compare(x, y));
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

const location = v.optional(
  v.object({
    location: v.nullable(v.string()),
  }),
);

export const getPath = query(location, async (params): Promise<Path | null> => {
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

  const first = tree.children[0];
  const last = tree.children[tree.children.length - 1];
  let left: Path | undefined = undefined;
  let right: Path | undefined = undefined;
  let i = 0;
  const total = tree.children.length;

  for (; i < total; i++) {
    const curr = tree.children[i];

    if (curr.location === location) {
      left = tree.children[i - 1];
      right = tree.children[i + 1];
      break;
    }
  }

  return {
    position: {
      spot: i + 1,
      total,
    },
    first,
    last,
    left,
    right,
  };
});
