export type Path = {
  location: string;
  parent: string;
} & (
  | {
      type: "directory";
      thumbnail: Extract<Path, { type: "image" }> | null | undefined;
      children: Path[];
    }
  | {
      type: "image";
      name: string;
    }
);

export function getPathLink(path: Path) {
  switch (path.type) {
    case "directory":
      return `/?location=${path.location}`;
    case "image":
      return `/?location=${path.location}&name=${path.name}`;
  }
}
