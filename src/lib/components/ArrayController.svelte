<script lang="ts">
	import { DataArray } from '$lib/state/DataArray.svelte';
	import { LayoutType } from '$lib/state/LayoutType.svelte';
	import { algoType } from '$lib/types/enums';
	import NumInput from './NumInput.svelte';

	let layoutContext: LayoutType = LayoutType.get();
	let dataContext: DataArray = DataArray.get();

	let executeType = $derived(layoutContext.getMethod());

	let size: number = $state(DataArray.EXAMPLE_LEN);
	let min: number = $state(DataArray.EXAMPLE_MIN);
	let max: number = $state(DataArray.EXAMPLE_MAX);
	let singleInsert: number = $state(0);
	let arrayInsert: string = $state('0,1,2,3,4');
	let searchTarget: number = $state(0);

	function generateData() {
		dataContext.generate(min, max, size);
	}

	function insertSingleData() {
		dataContext.insert(singleInsert);
	}

	function insertArrayData() {
		let inputArr = arrayInsert.split(',').map(Number).filter(Boolean);
		arrayInsert = inputArr.toString();
		dataContext.set(inputArr);
	}

	$effect(() => {
		$inspect(dataContext.data);
	});
</script>

<form onsubmit={generateData}>
	<div class="item">
		<p>Size:</p>
		<p>Range: from</p>
		<p style="text-align: right;">to</p>
	</div>
	<div class="item" style="flex: 1 1 auto">
		<NumInput name={'size'} bind:value={size} min={0} max={DataArray.MAX_LENGTH} />
		<NumInput
			name={'min'}
			bind:value={min}
			min={-DataArray.MAX_LENGTH}
			max={DataArray.MAX_LENGTH}
		/>
		<NumInput
			name={'max'}
			bind:value={max}
			min={-DataArray.MAX_LENGTH}
			max={DataArray.MAX_LENGTH}
		/>
	</div>
	<button type="submit">Generate</button>
</form>

<form style="align-items: center;" onsubmit={insertSingleData}>
	<p>Insert value:</p>
	<NumInput
		name={'singleInsert'}
		bind:value={singleInsert}
		min={-DataArray.MAX_LENGTH}
		max={DataArray.MAX_LENGTH}
	/>
	<button type="submit">Insert</button>
</form>

<form style="align-items: center;" onsubmit={insertArrayData}>
	<p>Insert array:</p>
	<input name={'arrayInsert'} bind:value={arrayInsert} />
	<button type="submit">Insert</button>
</form>

<form class="buttons-container">
	<button>{executeType}</button>
	{#if executeType == algoType.SEARCH}
		<NumInput
			name={'search'}
			bind:value={searchTarget}
			min={-DataArray.MAX_LENGTH}
			max={DataArray.MAX_LENGTH}
		/>
	{/if}
</form>

<style>
	button {
		border: 3px solid var(--foreground-dark);
		font-size: inherit;
		padding: 0.5rem 1rem;
	}
	button:hover,
	button:active {
		border: 3px solid var(--highlight-dark);
		transition: all 0.2s ease-in-out;
	}
	.buttons-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 2rem;
	}
	form {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		width: 100%;
	}
	.item {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		gap: 1rem;
	}
	form button {
		align-self: center;
	}
</style>
