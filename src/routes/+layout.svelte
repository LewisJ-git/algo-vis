<script lang="ts">
	import '../styles/global.css';
	import favicon from '$lib/assets/icons/favicon.svg';
	import Nav from '$lib/components/Nav/Nav.svelte';
	import { DataArray } from '$lib/state/DataArray.svelte';
	import { LayoutType } from '$lib/state/LayoutType.svelte';
	import ArrayController from '$lib/components/Array/ArrayController.svelte';
	import { dataType } from '$lib/types/enums';
	import { PlotParams } from '$lib/state/PlotParams.svelte';
	import { DataGraph } from '$lib/state/DataGraph.svelte';
	import GraphController from '$lib/components/Graph/GraphController.svelte';

	export const prerender = true;

	export const trailingSlash = 'always';

	let { children } = $props();

	new DataArray();
	new DataGraph();
	new LayoutType();
	new PlotParams();

	let layoutContext = LayoutType.get();

	let innerWidth = $state(0);

	let isMobile = $derived(innerWidth < 768);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:window bind:innerWidth />

<div class="layout">
	<div class="header appear-transition">
		<h1>&lt; Algorithm Visualizer &gt;</h1>
		<Nav />
	</div>

	{#if layoutContext.getLayout() == dataType.ARRAY}
		<div class="border-box controller appear-transition"><ArrayController /></div>
	{/if}
	{#if layoutContext.getLayout() == dataType.GRAPH}
		<div class="border-box controller appear-transition"><GraphController /></div>
	{/if}
</div>

<div class="display">{@render children()}</div>

<style>
	.layout {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 2rem;
	}
	.header {
		box-sizing: border-box;
		flex: 1 0 auto;
		overflow-x: hidden;
	}
	.controller {
		flex: 0 1 550px;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.display {
		margin-top: 1rem;
	}
	@media screen and (max-width: 1024px) {
		.layout {
			flex-direction: column;
		}
		.header {
			width: 100%;
		}
	}
</style>
