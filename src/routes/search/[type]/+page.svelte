<script lang="ts">
	import { page } from '$app/state';
	import BarPlot from '$lib/components/BarPlot.svelte';
	import { LayoutType } from '$lib/state/LayoutType.svelte';
	import { algoType, dataType } from '$lib/types/enums';

	const type = $derived(page.params.type);
	let layoutContext: LayoutType = LayoutType.get();

	layoutContext.setLayout(dataType.ARRAY);
	layoutContext.setMethod(algoType.SEARCH);

	let m = layoutContext.getLayout();
	let t = layoutContext.getMethod();
</script>

<BarPlot />
