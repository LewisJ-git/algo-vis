<script lang="ts">
	import Pause from '$lib/assets/icons/Pause.svelte';
	import Play from '$lib/assets/icons/Play.svelte';
	import { DataArray } from '$lib/state/DataArray.svelte';
	import { LayoutType } from '$lib/state/LayoutType.svelte';
	import { PlotParams } from '$lib/state/PlotParams.svelte';
	import { slide } from 'svelte/transition';
	let layoutContext = LayoutType.get();
	let dataContext = DataArray.get();
	let plotContext = PlotParams.get();

	function toggle() {
		dataContext.toggle();
		if (dataContext.running) {
			dataContext.startAlgo(
				plotContext.canAnimate(dataContext.getSize()),
				plotContext.animationSpeed
			);
		}
	}
</script>

<div class="border-box container">
	<div>
		<p>{layoutContext.method.charAt(0) + layoutContext.method.slice(1).toLowerCase()}ing</p>
		<p>Type: {layoutContext.type}</p>
	</div>
	{#if dataContext.inProcess}
		<div class="controller" transition:slide|global={{ duration: 200 }}>
			{#if dataContext.running}
				<button onclick={toggle}><Pause /></button>
				<p>Pause</p>
			{:else}
				<button onclick={toggle}><Play /></button>
				<p>Play</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.controller {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
	}
</style>
