<script lang="ts">
	import { DataArray } from '$lib/state/DataArray.svelte';
	import { PlotParams } from '$lib/state/PlotParams.svelte';
	import { onMount } from 'svelte';
	import { Canvas, type CanvasResizeEvent } from 'svelte-canvas';
	import Axis from './Axis.svelte';
	import { axisBottom, scaleBand, scaleLinear, type ScaleBand } from 'd3';
	import type { Dim, Scale } from '$lib/types/interfaces';
	import Bar from './Bar.svelte';

	let plot: SVGSVGElement;
	let axis: SVGGElement;
	let dataArray = DataArray.get();
	let params = PlotParams.get();

	let width: number = 600,
		height: number = 450,
		margin: Dim = { top: 100, left: 5, right: 5, bottom: 15 };

	const axisPadding = 20;
	const textPadding = 4;

	const innerWindow = (w: number, h: number): Dim => ({
		top: 0 + margin.top,
		left: 0 + margin.left,
		bottom: h - margin.bottom - axisPadding,
		right: w - margin.right
	});

	let scale = (s: Dim): Scale => ({
		x: scaleBand()
			.domain(dataArray.data.map((d, i) => String(i)))
			.range([s.left, s.right])
			.padding(0.1),
		y: scaleLinear()
			.domain([-(dataArray.getMax() * 0.02), dataArray.getMax()])
			.range([s.bottom, s.top])
	});
</script>

<div class="border-box container">
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
