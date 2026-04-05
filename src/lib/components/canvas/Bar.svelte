<script lang="ts">
	import { DataArray } from '$lib/state/DataArray.svelte';
	import { PlotParams } from '$lib/state/PlotParams.svelte';
	import type { Directions, Scale } from '$lib/types/interfaces';
	import { Layer, type Render } from 'svelte-canvas';

	const {
		scale,
		window,
		padding
	}: {
		scale: (s: Directions) => Scale;
		window: (w: number, h: number) => Directions;
		padding: number;
	} = $props();

	let dataArray = DataArray.get();
	let params = PlotParams.get();

	const render: Render = ({ context, width, height }) => {
		const innerWindow: Directions = window(width, height);
		const s: Scale = scale(innerWindow);

		context.beginPath();

		const fontScale = 17 - 0.3 * dataArray.getSize();
		context.font = `${fontScale}px NimbusMono`;
		context.textAlign = 'center';
		dataArray.data.forEach((d, i) => {
			const x = s.x(String(i));
			if (x) {
				const bar = {
					x,
					y: s.y(d),
					width: s.x.bandwidth(),
					height: s.y(0) - s.y(d)
				};
				const base = s.y(0) - padding;
				context.strokeStyle = dataArray.activeIndices.includes(i) ? '#df3030' : '#41f341';

				context.strokeRect(bar.x, bar.y, bar.width, bar.height);
				if (params.canDisplayValue(dataArray.getSize())) {
					context.strokeText(String(d), bar.x + bar.width / 2, base);
				}
			}
		});
	};
</script>

<Layer {render} />
