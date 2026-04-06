<script>
	import { LayoutType } from '$lib/state/LayoutType.svelte';
	import { PlotParams } from '$lib/state/PlotParams.svelte';
	import { dataType } from '$lib/types/enums';
	import BoolInput from './Inputs/BoolInput.svelte';
	import NumInput from './Inputs/NumInput.svelte';

	let params = PlotParams.get();
	let layoutContext = LayoutType.get();

	$effect(() => {
		$inspect(params.showIndex);
	});
</script>

<div class="border-box container appear-transition-delay-3">
	<div class="anim-container">
		<BoolInput name="enableAnimation" bind:value={params.enableAnimation}>Animations</BoolInput>
		<label>
			Speed:
			<NumInput
				name="speed"
				min={PlotParams.SPEED_RANGE.min}
				max={PlotParams.SPEED_RANGE.max}
				bind:value={params.animationSpeed}
				factor={0.1}
			/>
		</label>
	</div>
	{#if layoutContext.layout == dataType.ARRAY}
		<BoolInput name="displayIndex" bind:value={params.showIndex}>Indices</BoolInput>
		<BoolInput name="displayValue" bind:value={params.showValue}>Values</BoolInput>
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.anim-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 1rem;
	}
	label {
		color: inherit;
	}
</style>
