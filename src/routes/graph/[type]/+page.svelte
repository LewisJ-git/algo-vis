<script lang="ts">
	import { page } from '$app/state';
	import { LayoutType } from '$lib/state/LayoutType.svelte';
	import { algoType, dataType } from '$lib/types/enums';

	const type = $derived(page.params.type);
	let layoutContext: LayoutType = LayoutType.get();

	layoutContext.setLayout(dataType.GRAPH);
	layoutContext.setMethod(algoType.SEARCH);

	let m = layoutContext.getLayout();
	let t = layoutContext.getMethod();
</script>

<h1>{type}</h1>
<h1>{m}{t}</h1>
