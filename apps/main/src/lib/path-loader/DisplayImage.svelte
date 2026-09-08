<script lang="ts">
    import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { getPathLoader } from "$lib/path-loader/path-loader.svelte";
    import CaretDoubleLeftIcon from "phosphor-svelte/lib/CaretDoubleLeftIcon";
    import CaretDoubleRightIcon from "phosphor-svelte/lib/CaretDoubleRightIcon";
    import CaretLeftIcon from "phosphor-svelte/lib/CaretLeftIcon";
    import CaretRightIcon from "phosphor-svelte/lib/CaretRightIcon";

    const pathLoader = getPathLoader();
</script>

<div class="flex flex-col h-dvh">
    {#if pathLoader.neighbors.current}
        <ButtonGroup class="mx-auto">
            {#if pathLoader.neighbors.current.first?.location}
                <Button
                    href={`/?location=${pathLoader.neighbors.current.first?.location}`}
                >
                    <CaretDoubleLeftIcon />
                </Button>
            {:else}
                <Button disabled>
                    <CaretDoubleLeftIcon />
                </Button>
            {/if}
            {#if pathLoader.neighbors.current.left?.location}
                <Button
                    href={`/?location=${pathLoader.neighbors.current.left?.location}`}
                >
                    <CaretLeftIcon />
                </Button>
            {:else}
                <Button disabled>
                    <CaretLeftIcon />
                </Button>
            {/if}
            {#if pathLoader.neighbors.current.position}
                <Button>
                    {pathLoader.neighbors.current.position.spot} / {pathLoader
                        .neighbors.current.position.total}
                </Button>
            {/if}
            {#if pathLoader.neighbors.current.right?.location}
                <Button
                    href={`/?location=${pathLoader.neighbors.current.right?.location}`}
                >
                    <CaretRightIcon />
                </Button>
            {:else}
                <Button disabled>
                    <CaretRightIcon />
                </Button>
            {/if}
            {#if pathLoader.neighbors.current.last?.location}
                <Button
                    href={`/?location=${pathLoader.neighbors.current.last?.location}`}
                >
                    <CaretDoubleRightIcon />
                </Button>
            {:else}
                <Button disabled>
                    <CaretDoubleRightIcon />
                </Button>
            {/if}
        </ButtonGroup>
    {/if}

    {#if pathLoader.paths.current}
        <div class="flex flex-1 min-h-0 w-full justify-center">
            {#if pathLoader.neighbors.current?.left}
                <img
                    class="min-w-0 h-full object-contain hidden lg:inline"
                    src="/images?location={pathLoader.neighbors.current.left
                        .location}"
                    alt={pathLoader.neighbors.current.left.location}
                />
            {/if}
            <img
                class="min-w-0 h-full object-contain"
                src="/images?location={pathLoader.paths.current.location}"
                alt={pathLoader.paths.current.location}
            />
            {#if pathLoader.neighbors.current?.right}
                <img
                    class="min-w-0 h-full object-contain hidden 2xl:inline"
                    src="/images?location={pathLoader.neighbors.current.right
                        .location}"
                    alt={pathLoader.neighbors.current.right.location}
                />
            {/if}
        </div>
    {/if}
</div>
