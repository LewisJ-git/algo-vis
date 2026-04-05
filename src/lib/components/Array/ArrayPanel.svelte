<script lang="ts">
	import { page } from '$app/state';
	import Pause from '$lib/assets/icons/Pause.svelte';
	import Play from '$lib/assets/icons/Play.svelte';
	import Reset from '$lib/assets/icons/Reset.svelte';
	import { DataArray } from '$lib/state/DataArray.svelte';
	import { LayoutType } from '$lib/state/LayoutType.svelte';
	import { PlotParams } from '$lib/state/PlotParams.svelte';
	let layoutContext = LayoutType.get();
	let dataContext = DataArray.get();
	let plotContext = PlotParams.get();

	let executeType = $derived(layoutContext.getMethod());

	const toggle = () => {
		if (dataContext.status == 'PENDING') {
			dataContext.execute(
				executeType,
				plotContext.canAnimate(dataContext.getSize()),
				plotContext.animationSpeed,
				page.params.type
			);
		} else {
			dataContext.toggle();
			if (dataContext.status == 'RUNNING') {
				dataContext.startAlgo(
					plotContext.canAnimate(dataContext.getSize()),
					plotContext.animationSpeed
				);
			}
		}
	};

	const reset = () => {
		dataContext.reset();
		if (page.params.type) {
			dataContext.setIterator(page.params.type);
		}
	};
</script>

<div class="border-box container">
	<div>
		<p>{layoutContext.method.charAt(0) + layoutContext.method.slice(1).toLowerCase()}ing</p>
		<p>Type: {layoutContext.type}</p>
	</div>
	<div class="controller">
		{#if dataContext.status == 'RUNNING'}
			<button onclick={toggle}><Pause /></button>
			<p>Pause</p>
		{:else if dataContext.status == 'DONE'}
			<div class="controller">
				<button onclick={reset}><Reset /></button>
				<p>Reset</p>
			</div>
		{:else}
			<button onclick={toggle}><Play /></button>
			<p>Play</p>
		{/if}
	</div>
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
