<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		name,
		value = $bindable(),
		children
	}: {
		name: string;
		value: boolean;
		children: Snippet;
	} = $props();
</script>

<label for={name}>
	<input type="checkbox" {name} bind:checked={value} />
	<span class="checkmark"></span>
	{@render children()}
</label>

<style>
	label {
		display: flex;
		gap: 0.5rem;
		justify-items: center;
	}
</style>
