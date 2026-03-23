<script lang="ts">
	import '../styles/global.css';
	import favicon from '$lib/assets/icons/favicon.svg';
	import Nav from '$lib/components/Nav.svelte';
	import { DataArray } from '$lib/state/DataArray.svelte';
	import { LayoutType } from '$lib/state/LayoutType.svelte';
	import ArrayController from '$lib/components/ArrayController.svelte';

	let { children } = $props();

	new DataArray();
	new LayoutType();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="layout">
	<div class="header">
		<h1>&lt; Algorithm Visualizer &gt;</h1>
		<Nav />
	</div>
	<div class="container controller">
		<ArrayController />
	</div>
</div>

<div class="container display">{@render children()}</div>

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
	.container {
		box-sizing: border-box;
		width: 100%;
		padding: 1rem 2rem;
		border: 3px solid var(--foreground-dark);
	}
	.controller {
		flex: 0 1 550px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1.5rem;
	}
	.display {
		margin-top: 1rem;
		height: 600px;
		display: flex;
		flex-direction: row;
		justify-items: stretch;
	}
	@media screen and (max-width: 1024px) {
		.layout {
			flex-direction: column;
		}
		.header {
			width: 100%;
		}
		.container {
			box-sizing: border-box;
			width: 100%;
			flex: 1 1 500px;
			padding: 1rem 2rem;
			border: 3px solid var(--foreground-dark);
		}
	}
</style>
