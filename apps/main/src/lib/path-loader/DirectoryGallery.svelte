<script lang="ts">
    import { getPathLoader } from "$lib/path-loader/path-loader.svelte";
    import FolderIcon from "phosphor-svelte/lib/FolderIcon";

    const pathLoader = getPathLoader();
</script>

{#if pathLoader.paths.current?.content.type === "directory"}
    <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 justify-items-center gap-3"
    >
        {#each pathLoader.paths.current.content.children as child}
            <a
                href="/?location={child.location}"
                class="w-full hover:opacity-50 hover:cursor-pointer"
            >
                {#if child.content.type === "image"}
                    <img
                        loading="lazy"
                        src="/images?location={child.location}"
                        alt={child.location}
                    />
                {:else if child.content.type === "directory"}
                    {#if child.content.thumbnail}
                        <img
                            loading="lazy"
                            src="/images?location={child.content.thumbnail}"
                            alt={child.content.thumbnail}
                        />
                    {:else}
                        <FolderIcon class="w-full h-full" />
                    {/if}
                {/if}
                <p class="truncate text-left [direction:rtl]">
                    &#x200E;{child.location}
                </p>
            </a>
        {/each}
    </div>
{/if}
