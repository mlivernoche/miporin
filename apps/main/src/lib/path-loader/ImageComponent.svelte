<script lang="ts">
    import type { Path } from "./types";
    import type { HTMLImgAttributes } from "svelte/elements";
    import type { WithElementRef } from "$lib/utils";
    import FolderIcon from "phosphor-svelte/lib/FolderIcon";

    type Props = {
        path: Path;
    } & WithElementRef<Omit<HTMLImgAttributes, "src" | "alt" | "loading">>;

    let { path, ...props }: Props = $props();
</script>

{#if path.type === "directory"}
    {#if path.thumbnail}
        <img
            loading="lazy"
            src="/images?location={path.thumbnail.location}&name={path.thumbnail
                .name}"
            alt="/images?location={path.thumbnail.location}&name={path.thumbnail
                .name}"
            {...props}
        />
    {:else}
        <FolderIcon class="w-full h-full" />
    {/if}
{:else if path.type === "image"}
    <img
        loading="lazy"
        src="/images?location={path.location}&name={path.name}"
        alt="/images?location={path.location}&name={path.name}"
        {...props}
    />
{/if}
