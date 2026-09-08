<script lang="ts">
    import { page } from "$app/state";
    import {
        PathLoader,
        setPathLoader,
    } from "$lib/path-loader/path-loader.svelte";
    import DirectoryGallery from "$lib/path-loader/DirectoryGallery.svelte";
    import DisplayImage from "$lib/path-loader/DisplayImage.svelte";
    import NavigationBar from "$lib/path-loader/NavigationBar.svelte";

    const pathLoader = new PathLoader(() => page.url);
    setPathLoader(pathLoader);
</script>

<nav>
    <NavigationBar />
</nav>

<main>
    {#if pathLoader.paths.current?.content.type === "directory"}
        <DirectoryGallery />
    {:else if pathLoader.paths.current?.content.type === "image"}
        <DisplayImage />
    {:else if pathLoader.paths.error}
        <p>{pathLoader.paths.error.message}</p>
    {/if}
</main>
