<script lang="ts">
    import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { getPathLoader } from "$lib/path-loader/path-loader.svelte";
    import CaretDoubleLeftIcon from "phosphor-svelte/lib/CaretDoubleLeftIcon";
    import CaretDoubleRightIcon from "phosphor-svelte/lib/CaretDoubleRightIcon";
    import CaretLeftIcon from "phosphor-svelte/lib/CaretLeftIcon";
    import CaretRightIcon from "phosphor-svelte/lib/CaretRightIcon";
    import ImageComponent from "./ImageComponent.svelte";
    import { getPathLink } from "./types";

    const pathLoader = getPathLoader();
</script>

<div class="flex flex-col h-dvh">
    {#if pathLoader.neighbors.current}
        <ButtonGroup class="mx-auto">
            {#if pathLoader.neighbors.current.first?.location}
                <Button href={getPathLink(pathLoader.neighbors.current.first)}>
                    <CaretDoubleLeftIcon />
                </Button>
            {:else}
                <Button disabled>
                    <CaretDoubleLeftIcon />
                </Button>
            {/if}
            {#if pathLoader.neighbors.current.left?.location}
                <Button href={getPathLink(pathLoader.neighbors.current.left)}>
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
                <Button href={getPathLink(pathLoader.neighbors.current.right)}>
                    <CaretRightIcon />
                </Button>
            {:else}
                <Button disabled>
                    <CaretRightIcon />
                </Button>
            {/if}
            {#if pathLoader.neighbors.current.last?.location}
                <Button href={getPathLink(pathLoader.neighbors.current.last)}>
                    <CaretDoubleRightIcon />
                </Button>
            {:else}
                <Button disabled>
                    <CaretDoubleRightIcon />
                </Button>
            {/if}
        </ButtonGroup>
    {/if}

    {#if pathLoader.paths.current?.type === "image"}
        <div class="flex flex-1 min-h-0 w-full justify-center">
            {#if pathLoader.neighbors.current?.right?.type === "image"}
                <ImageComponent
                    path={pathLoader.neighbors.current.right}
                    class="min-w-0 h-full object-contain hidden 2xl:inline"
                />
            {/if}
            <ImageComponent
                path={pathLoader.paths.current}
                class="min-w-0 h-full object-contain"
            />
            {#if pathLoader.neighbors.current?.left?.type === "image"}
                <ImageComponent
                    path={pathLoader.neighbors.current.left}
                    class="min-w-0 h-full object-contain hidden lg:inline"
                />
            {/if}
        </div>
    {/if}
</div>
