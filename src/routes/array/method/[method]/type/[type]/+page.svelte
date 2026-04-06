<script lang="ts">
	import { page } from '$app/state';
	import ArrayPanel from '$lib/components/Array/ArrayPanel.svelte';
	import BarPlot from '$lib/components/canvas/BarPlot.svelte';
	import VisualizerController from '$lib/components/VisualizerController.svelte';
	import { DataArray } from '$lib/state/DataArray.svelte';
	import { LayoutType } from '$lib/state/LayoutType.svelte';
	import { algoType, dataType } from '$lib/types/enums';

	let method = $derived(page.params.method);
	let methodType: algoType = $derived(method?.toUpperCase() as algoType);
	let type = $derived(page.params.type);

	let layoutContext: LayoutType = LayoutType.get();
	let dataContext: DataArray = DataArray.get();

	layoutContext.setLayout(dataType.ARRAY);

	$effect(() => {
		layoutContext.setMethod(methodType);
		if (type) {
			layoutContext.setType(type);
			dataContext.setIterator(type);
		}
	});
</script>

<div class="container">
	<BarPlot />
	<div class="controllers">
		<ArrayPanel />
		<VisualizerController />
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		align-items: center;
		flex-wrap: wrap;
	}
	.controllers {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-self: flex-start;
		gap: 1rem;
	}
</style>
