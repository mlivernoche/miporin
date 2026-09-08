<script lang="ts">
    import { getPathLoader } from "$lib/path-loader/path-loader.svelte";
    import FolderIcon from "phosphor-svelte/lib/FolderIcon";

    const pathLoader = getPathLoader();
</script>

{#if pathLoader.paths.current}
    <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 justify-items-center gap-3"
    >
        {#each pathLoader.paths.current.children as child}
            <a
                href="/?location={child.location}"
                class="w-full hover:opacity-50 hover:cursor-pointer"
            >
                {#if child.thumbnail}
                    <img
                        src="/images?location={child.thumbnail}"
                        alt={child.location}
                    />
                {:else}
                    <FolderIcon class="w-full h-full" />
                {/if}
                <p class="truncate text-left [direction:rtl]">
                    &#x200E;{child.location}
                </p>
            </a>
        {/each}
    </div>
{/if}
