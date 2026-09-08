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
    const thumbnail = children.filter((child) => child.content.type === "image").at(0)?.location;

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
  let i = 0;
  const total = tree.content.children.length;

  for (; i < total; i++) {
    const curr = tree.content.children[i];

    if (curr.location === location) {
      left = tree.content.children[i - 1];
      right = tree.content.children[i + 1];
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
