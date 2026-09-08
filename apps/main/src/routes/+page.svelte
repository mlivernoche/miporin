<script lang="ts">
    import { getPath } from "./data.remote";
    import { page } from "$app/state";
    import InputGroup from "$lib/components/ui/input-group/input-group.svelte";
    import InputGroupInput from "$lib/components/ui/input-group/input-group-input.svelte";
    import InputGroupAddon from "$lib/components/ui/input-group/input-group-addon.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import ArrowUpIcon from "phosphor-svelte/lib/ArrowUpIcon";
    import FolderIcon from "phosphor-svelte/lib/FolderIcon";

    const location = $derived(page.url.searchParams.get("location"));
    const pathQuery = $derived(getPath({ location }));
</script>

<InputGroup>
    <InputGroupInput readonly value={location} />
    {#await pathQuery then path}
        {#if path}
            <InputGroupAddon>
                <Button href={`/?location=${path.parent}`}>
                    <ArrowUpIcon />
                </Button>
            </InputGroupAddon>
        {/if}
    {/await}
</InputGroup>

{#await pathQuery then path}
    {#if path}
        {#if path.children.length > 0}
            <div
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 justify-items-center gap-3"
            >
                {#each path.children as child}
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
        {:else}
            <div class="flex flex-col h-dvh">
                <div class="flex flex-1 min-h-0 w-full justify-center">
                    <img
                        class="min-w-0 h-full object-contain"
                        src="/images?location={path.location}"
                        alt={path.location}
                    />
                </div>
            </div>
        {/if}
    {:else}
        <p>Location not found.</p>
    {/if}
{/await}
