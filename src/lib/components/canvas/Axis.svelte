<script lang="ts">
	import { DataArray } from '$lib/state/DataArray.svelte';
	import { PlotParams } from '$lib/state/PlotParams.svelte';
	import type { Dim, Scale } from '$lib/types/interfaces';
	import { Layer, type Render } from 'svelte-canvas';

	const {
		scale,
		window,
		padding
	}: { scale: (s: Dim) => Scale; window: (w: number, h: number) => Dim; padding: number } =
		$props();

	let dataArray = DataArray.get();
	let params = PlotParams.get();

	const render: Render = ({ context, width, height }) => {
		const innerWindow: Dim = window(width, height);

		context.strokeStyle = '#41f341';
		context.beginPath();

		context.moveTo(innerWindow.left, height - padding);
		context.lineTo(innerWindow.left, innerWindow.bottom);
		context.lineTo(innerWindow.right, innerWindow.bottom);
		context.lineTo(innerWindow.right, height - padding);
		context.stroke();

		if (params.canDisplayIndex(dataArray.getSize())) {
			const xScale = scale(innerWindow).x;
			const fontScale = 20 - 0.3 * dataArray.getSize();
			context.font = `${fontScale}px NimbusMono`;
			context.fillStyle = '#41f341';
			context.textAlign = 'center';
			context.beginPath();
			dataArray.data.forEach((d, i) => {
				const ticker = xScale(String(i));
				if (ticker) {
					const x = ticker + xScale.bandwidth() / 2;
					context.moveTo(x, innerWindow.bottom);
					context.lineTo(x, innerWindow.bottom + 6);
					context.fillText(String(i), x, height);
				}
			});
			context.stroke();
		}
	};
</script>

<Layer {render} />
