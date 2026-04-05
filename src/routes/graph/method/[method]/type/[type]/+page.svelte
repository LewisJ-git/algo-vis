<script lang="ts">
	import { page } from '$app/state';
	import GridPlot from '$lib/components/canvas/GridPlot.svelte';
	import DisplayPanel from '$lib/components/Graph/GraphPanel.svelte';
	import VisualizerController from '$lib/components/VisualizerController.svelte';
	import { DataGraph } from '$lib/state/DataGraph.svelte';
	import { LayoutType } from '$lib/state/LayoutType.svelte';
	import { algoType, dataType } from '$lib/types/enums';

	const type = $derived(page.params.type);
	let layoutContext: LayoutType = LayoutType.get();
	let dataContext: DataGraph = DataGraph.get();

	layoutContext.setLayout(dataType.GRAPH);
	layoutContext.setMethod(algoType.SEARCH);

	$effect(() => {
		if (type) {
			layoutContext.setType(type);
			dataContext.setIterator(type);
		}
	});
</script>

<div class="container">
	<GridPlot />
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
