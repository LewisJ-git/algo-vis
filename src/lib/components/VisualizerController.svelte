<script>
	import { PlotParams } from '$lib/state/PlotParams.svelte';
	import BoolInput from './Inputs/BoolInput.svelte';
	import NumInput from './Inputs/NumInput.svelte';

	let params = PlotParams.get();

	$effect(() => {
		$inspect(params.showIndex);
	});
</script>

<div class="border-box container">
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
	<BoolInput name="displayIndex" bind:value={params.showIndex}>Indices</BoolInput>
	<BoolInput name="displayValue" bind:value={params.showValue}>Values</BoolInput>
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
