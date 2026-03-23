<script lang="ts">
	import { DataArray } from '$lib/state/DataArray.svelte';
	import * as d3 from 'd3';
	import { onMount } from 'svelte';

	let plot: SVGSVGElement;
	let axis: SVGGElement;
	let dataArray = DataArray.get();

	const width = 600,
		height = 450,
		padding = { top: 100, left: 5, right: 5, bottom: 10 };

	const trueWidth = width + padding.left + padding.right;
	const trueHeight = height + padding.bottom + padding.top;
	let xScale = $derived(
		d3
			.scaleBand()
			.domain(dataArray.data.map((d, i) => String(i)))
			.range([0, width])
			.padding(0.1)
	);

	let yScale = $derived(
		d3.scaleLinear().domain([dataArray.getMin(), dataArray.getMax()]).range([height, 0])
	);

	let drawAxis = $derived(
		dataArray.getSize() > 30
			? d3.axisBottom(xScale).tickFormat((d) => {
					return '';
				})
			: d3.axisBottom(xScale)
	);

	$effect(() => {
		d3.select(axis).call(drawAxis).selectAll('text').style('text-anchor', 'middle');
	});
</script>

<svg
	bind:this={plot}
	width={trueWidth}
	height={trueHeight}
	viewBox={`0 0 ${trueWidth} ${trueHeight}`}
>
	{#each dataArray.data as d, i}
		<rect
			x={xScale(String(i))}
			y={yScale(d)}
			width={xScale.bandwidth()}
			height={height - yScale(d)}
			stroke="var(--foreground-light)"
		/>
	{/each}
	<g bind:this={axis} transform={`translate(0, ${height})`}></g>
</svg>

<style>
</style>
