import { createContext } from "svelte";
import { getNavigation, getPath } from "./path-loader.remote";
import { resource } from "runed";

export class PathLoader {
  #getUrl: () => URL;

  location = $derived.by(() => this.#getUrl().searchParams.get("location"));
  paths = resource(
    () => this.location,
    async (location) => getPath({ location }),
  );
  neighbors = resource(
    () => this.location,
    async (location) => getNavigation({ location }),
  );

  constructor(getUrl: () => URL) {
    this.#getUrl = getUrl;
  }
}

export const [getPathLoader, setPathLoader, hasPathLoader] = createContext<PathLoader>();
