<script lang="ts">
	import { DataArray } from '$lib/state/DataArray.svelte';
	import { Canvas } from 'svelte-canvas';
	import Axis from './Axis.svelte';
	import { scaleBand, scaleLinear } from 'd3';
	import type { Directions, Scale } from '$lib/types/interfaces';
	import Bar from './Bar.svelte';

	let dataArray = DataArray.get();
	let innerWidth = $state(0);

	let isMobile = $derived(innerWidth < 800);

	let width: number = $state(600),
		height: number = $state(450),
		margin: Directions = $state({ top: 50, left: 5, right: 5, bottom: 15 });

	const axisPadding = 20;
	const textPadding = 4;

	const innerWindow = (w: number, h: number): Directions => ({
		top: 0 + margin.top,
		left: 0 + margin.left,
		bottom: h - margin.bottom - axisPadding,
		right: w - margin.right
	});

	let scale = (s: Directions): Scale => ({
		x: scaleBand()
			.domain(dataArray.data.map((d, i) => String(i)))
			.range([s.left, s.right])
			.padding(0.1),
		y: scaleLinear()
			.domain([-(dataArray.getMax() * 0.02), dataArray.getMax()])
			.range([s.bottom, s.top])
	});

	$effect(() => {
		if (isMobile) {
			width = 300;
			height = 225;
			margin = { top: 10, left: 2, right: 2, bottom: 5 };
		} else {
			width = 600;
			height = 450;
			margin = { top: 50, left: 5, right: 5, bottom: 15 };
		}
	});
</script>

<svelte:window bind:innerWidth />
<div class="border-box container appear-transition-delay-1">
	<Canvas {width} {height}>
		<Axis {scale} window={innerWindow} padding={axisPadding} />
		<Bar {scale} window={innerWindow} padding={textPadding} />
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
