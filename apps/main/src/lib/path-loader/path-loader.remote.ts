import * as v from "valibot";
import { query } from "$app/server";
import type { Path } from "./types";
import { getFileLocation } from "./file-location";

const location = v.optional(
  v.object({
    location: v.string(),
    name: v.nullable(v.string()),
  }),
);

export const getDefaultLocation = query(() => {
  if (process.env.MEDIA_DIR) return process.env.MEDIA_DIR;
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  if (process.env.DEFAULT_LOCATION) return process.env.DEFAULT_LOCATION;
  return process.cwd();
});

export const getPath = query(location, async (params): Promise<Path | null> => {
  const defaultLocation = await getDefaultLocation();

  try {
    const location = await getFileLocation(params?.location || defaultLocation, params?.name);

    if (!location) {
      return null;
    }

    return await location.getPath();
  } catch (err) {
    console.error(`Error loading path "${params?.location} with ${params?.name}":`, err);
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
  if (!params?.location || !params?.name) {
    return {};
  }

  const location = await getFileLocation(params.location);

  const tree = await location?.getPath();

  console.log(tree);

  if (!tree) {
    return {};
  }

  if (tree.type !== "directory") {
    return {};
  }

  const images = tree.children.filter((child) => child.type === "image");
  const first = images[0];
  const last = images[images.length - 1];
  let left: Path | undefined = undefined;
  let right: Path | undefined = undefined;
  let spot = 1;
  const total = images.length;
  let locationFound = false;

  for (let i = 0; i < images.length; i++) {
    const curr = images[i];

    if (curr.name === params.name) {
      locationFound = true;
    } else if (curr.type == "image") {
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
