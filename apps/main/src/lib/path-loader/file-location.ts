import { type Stats } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import type { Path } from "./types";
import { isImage } from "$lib/image-loader";

export interface IFileLocation {
  location: string;
  name?: string;
  getStats: () => Promise<Stats>;
  parent: string;
  getPath: () => Promise<Path | null>;
}

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

async function ReadDirectory(location: string): Promise<Path[]> {
  const files = (await fs.readdir(location)).toSorted((x, y) => collator.compare(x, y));

  const tree = await Promise.all(
    files.map(async (child): Promise<Path | null> => {
      try {
        const file = await getFileLocation(location, child);

        if (!file) {
          return null;
        }

        return await file.getPath();
      } catch {
        return null;
      }
    }),
  );
  return tree.filter((tree): tree is Path => !!tree);
}

class DirectoryLocation implements IFileLocation {
  location: string;
  name?: string;

  constructor(location: string) {
    this.location = location;
  }

  getStats() {
    return fs.stat(this.location);
  }

  get parent() {
    return path.dirname(this.location);
  }

  async getPath(): Promise<Path | null> {
    const children: Path[] = await ReadDirectory(this.location);
    const thumbnail = children.find((child) => child.type === "image");

    const res: Path = {
      key: this.location,
      location: this.location,
      parent: this.parent,
      type: "directory",
      children,
      thumbnail,
    };

    return res;
  }
}

class FileLocation implements IFileLocation {
  name: string;
  location: string;

  constructor(location: string, name: string) {
    this.location = location;
    this.name = name;
  }

  getStats() {
    return fs.stat(path.join(this.location, this.name));
  }

  get parent() {
    return this.location;
  }

  getPath() {
    const res: Path = {
      key: path.join(this.location, this.name),
      location: this.location,
      parent: this.location,
      type: "image",
      name: this.name,
    };

    return Promise.resolve(res);
  }
}

export async function getFileLocation(
  location: string,
  name?: string | null,
): Promise<IFileLocation | null> {
  const fullPath = path.join(location, name ?? "");
  const stats = await fs.stat(fullPath);

  if (name && stats.isFile() && (await isImage(fullPath))) {
    return new FileLocation(location, name);
  } else if (stats.isDirectory()) {
    return new DirectoryLocation(fullPath);
  }

  return null;
}
