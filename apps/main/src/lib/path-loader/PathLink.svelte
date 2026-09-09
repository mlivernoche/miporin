<script lang="ts">
    import type { Snippet } from "svelte";
    import type { Path } from "./types";
    import type { ClassValue } from "svelte/elements";

    interface Props {
        class?: ClassValue;
        path: Path;
        children: Snippet;
    }

    let { class: className, path, children }: Props = $props();
</script>

{#if path.type === "directory"}
    <a href="/?location={path.location}" class={className}>
        {@render children()}
    </a>
{:else if path.type === "image"}
    <a href="/?location={path.location}&name={path.name}" class={className}>
        {@render children()}
    </a>
{/if}
