<script lang="ts">
    import { getPathLoader } from "$lib/path-loader/path-loader.svelte";
    import InputGroup from "$lib/components/ui/input-group/input-group.svelte";
    import InputGroupInput from "$lib/components/ui/input-group/input-group-input.svelte";
    import InputGroupAddon from "$lib/components/ui/input-group/input-group-addon.svelte";
    import ArrowUpIcon from "phosphor-svelte/lib/ArrowUpIcon";
    import HouseIcon from "phosphor-svelte/lib/HouseIcon";
    import Button from "$lib/components/ui/button/button.svelte";
    import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";

    const pathLoader = getPathLoader();
</script>

<InputGroup>
    <InputGroupInput readonly value={pathLoader.location} />
    <InputGroupAddon>
        <ButtonGroup>
            {#await pathLoader.home then home}
                <Button href={`/?location=${home}`}>
                    <HouseIcon />
                </Button>
            {/await}
            {#if pathLoader.paths.current}
                <Button href={`/?location=${pathLoader.paths.current.parent}`}>
                    <ArrowUpIcon />
                </Button>
            {/if}
        </ButtonGroup>
    </InputGroupAddon>
</InputGroup>
