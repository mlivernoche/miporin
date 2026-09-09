<script lang="ts">
    import { getPathLoader } from "$lib/path-loader/path-loader.svelte";
    import ImageComponent from "./ImageComponent.svelte";
    import { getPathLink } from "./types";

    const pathLoader = getPathLoader();
</script>

{#if pathLoader.paths.current?.type === "directory"}
    <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 justify-items-center gap-3"
    >
        {#each pathLoader.paths.current.children as child (child.key)}
            <a
                href={getPathLink(child)}
                class="w-full hover:opacity-50 hover:cursor-pointer"
            >
                <ImageComponent path={child} />
                {#if child.type === "directory"}
                    <p class="truncate text-left [direction:rtl]">
                        &#x200E;{child.location}
                    </p>
                {:else if child.type === "image"}
                    <p class="truncate text-left [direction:rtl]">
                        &#x200E;{child.name}
                    </p>
                {/if}
            </a>
        {/each}
    </div>
{/if}
