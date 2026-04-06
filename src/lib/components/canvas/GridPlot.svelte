<script lang="ts">
	import { Canvas } from 'svelte-canvas';
	import { DataGraph } from '$lib/state/DataGraph.svelte';
	import Grid from './Grid.svelte';
	import type { Coordinate } from '$lib/types/interfaces';

	let graphContext = DataGraph.get();

	let activeNode: Coordinate = $state({ x: -1, y: -1 });
	let dragMode: boolean = $state(false);
	let cellSizeState: number = $state(0);

	let width: number = 600,
		height: number = 450;

	//$inspect(activeNode);
</script>

<div class="border-box container appear-transition-delay-1">
	<Canvas {width} {height} layerEvents style="touch-action: none">
		{#each graphContext.graph as dx}
			{#each dx as node}
				<Grid
					size={{ width: graphContext.getWidth(), height: graphContext.getHeight() }}
					{node}
					{cellSizeState}
					{activeNode}
					{dragMode}
					setCellSize={(input: number) => (cellSizeState = input)}
					setActiveNode={(input: Coordinate) => (activeNode = input)}
					activateDrag={() => (dragMode = true)}
					disableDrag={() => (dragMode = false)}
				/>
			{/each}
		{/each}
	</Canvas>
</div>

<style>
	.container {
		display: flex;
		flex: 1;
		justify-content: center;
		align-items: stretch;
	}
</style>
