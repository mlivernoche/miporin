import { createContext } from "svelte";
import { getDefaultLocation, getNavigation, getPath } from "./path-loader.remote";
import { resource } from "runed";

export class PathLoader {
  #getUrl: () => URL;

  location = $derived.by(() => this.#getUrl().searchParams.get("location"));
  name = $derived.by(() => this.#getUrl().searchParams.get("name"));
  paths = resource([() => this.location, () => this.name], async (params) => {
    const [location, name] = params;
    console.log(params);

    if (location) {
      const result = await getPath({ location, name });
      console.log(result);
      return result;
    }
  });
  neighbors = resource([() => this.location, () => this.name], async (params) => {
    const [location, name] = params;

    if (location) {
      return await getNavigation({ location, name });
    }
  });
  get home() {
    return getDefaultLocation();
  }

  constructor(getUrl: () => URL) {
    this.#getUrl = getUrl;
  }
}

export const [getPathLoader, setPathLoader, hasPathLoader] = createContext<PathLoader>();
