<script lang="ts">
    import { page } from "$app/state";
    import InputGroup from "$lib/components/ui/input-group/input-group.svelte";
    import InputGroupInput from "$lib/components/ui/input-group/input-group-input.svelte";
    import InputGroupAddon from "$lib/components/ui/input-group/input-group-addon.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import ArrowUpIcon from "phosphor-svelte/lib/ArrowUpIcon";
    import FolderIcon from "phosphor-svelte/lib/FolderIcon";
    import {
        PathLoader,
        setPathLoader,
    } from "$lib/path-loader/path-loader.svelte";
    import DirectoryGallery from "$lib/path-loader/DirectoryGallery.svelte";
    import DisplayImage from "$lib/path-loader/DisplayImage.svelte";

    const pathLoader = new PathLoader(() => page.url);
    setPathLoader(pathLoader);
</script>

<InputGroup>
    <InputGroupInput readonly value={pathLoader.location} />
    {#if pathLoader.paths.current}
        <InputGroupAddon>
            <Button href={`/?location=${pathLoader.paths.current.parent}`}>
                <ArrowUpIcon />
            </Button>
        </InputGroupAddon>
    {/if}
</InputGroup>

{#if pathLoader.paths.current?.content.type === "directory"}
    <DirectoryGallery />
{:else if pathLoader.paths.current?.content.type === "image"}
    <DisplayImage />
{:else if pathLoader.paths.error}
    <p>{pathLoader.paths.error.message}</p>
{/if}
