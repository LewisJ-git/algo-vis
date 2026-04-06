<script lang="ts">
	import {
		DataGraph,
		GraphSize,
		PlaceModes,
		type GraphType,
		type PlacementTypes
	} from '$lib/state/DataGraph.svelte';
	import { Terrain, type TerrainType } from '$lib/state/GraphAlgorithm';

	let size: GraphType = $state('small');
	let terrain: TerrainType = $state('uniform');
	let mode: PlacementTypes = $state('none');
	let dataContext: DataGraph = DataGraph.get();

	function changeTerrain(input: string) {
		terrain = input as TerrainType;
		dataContext.changeTerrain(terrain);
	}

	function changeSize(input: string) {
		size = input as TerrainType;
		dataContext.generate(size, terrain);
	}

	function changeMode(input: string) {
		mode = input as PlacementTypes;
		dataContext.setPlacementMode(mode);
	}

	function randomStart() {
		dataContext.randomStartPos();
	}

	function randomEnd() {
		dataContext.randomEndPos();
	}

	function generateData(event: SubmitEvent) {
		event.preventDefault();
		dataContext.generate(size, terrain);
	}
</script>

<form onsubmit={generateData}>
	<div class="container">
		<p>Size:</p>
		<div class="buttons-container">
			{#each Object.keys(GraphSize) as s}
				<button type="button" onclick={() => changeSize(s)} class:active={size == s}>{s}</button>
			{/each}
		</div>
	</div>
	<div class="container">
		<p>Terrain:</p>
		<div class="buttons-container">
			{#each Object.keys(Terrain) as t}
				<button type="button" onclick={() => changeTerrain(t)} class:active={terrain == t}
					>{t}</button
				>
			{/each}
		</div>
	</div>
	<button type="submit">Generate</button>
</form>

<div class="buttons-container">
	<p>Randomize:</p>
	<button onclick={() => randomStart()}>start</button>
	<button onclick={() => randomEnd()}>end</button>
</div>

<div class="container">
	<p>Placement mode:</p>
	<div class="buttons-container">
		{#each Object.keys(PlaceModes) as m}
			<button onclick={() => changeMode(m)} class:active={mode == m}>{m}</button>
		{/each}
	</div>
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.active {
		border: 3px solid var(--highlight);
		color: var(--highlight);
	}
	.container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.buttons-container {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		align-items: center;
		flex-wrap: wrap;
	}
</style>
