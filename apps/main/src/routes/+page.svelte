<script lang="ts">
    import DirectoryGallery from "$lib/path-loader/DirectoryGallery.svelte";
    import DisplayImage from "$lib/path-loader/DisplayImage.svelte";
    import { getPathLoader } from "$lib/path-loader/path-loader.svelte";

    const pathLoader = getPathLoader();
</script>

{#if pathLoader.paths.current?.content.type === "directory"}
    <DirectoryGallery />
{:else if pathLoader.paths.current?.content.type === "image"}
    <DisplayImage />
{:else if pathLoader.paths.error}
    <p>{pathLoader.paths.error.message}</p>
{/if}
