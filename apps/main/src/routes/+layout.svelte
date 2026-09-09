<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import {
		PathLoader,
		setPathLoader,
	} from "$lib/path-loader/path-loader.svelte";
	import { page } from "$app/state";
	import NavigationBar from "$lib/path-loader/NavigationBar.svelte";

	let { children } = $props();

	const pathLoader = new PathLoader(() => page.url);
	setPathLoader(pathLoader);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<nav>
	<NavigationBar />
</nav>

<main>
	{@render children()}
</main>
