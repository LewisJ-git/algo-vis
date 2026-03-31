<script lang="ts">
	import { page } from '$app/state';
	import BarPlot from '$lib/components/canvas/BarPlot.svelte';
	import DisplayPanel from '$lib/components/DisplayPanel.svelte';
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

	let m = $derived(layoutContext.getLayout());
	let t = $derived(layoutContext.getMethod());

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
		<DisplayPanel />
		<VisualizerController />
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		align-items: center;
	}
	.controllers {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-self: flex-start;
		gap: 1rem;
	}
</style>
