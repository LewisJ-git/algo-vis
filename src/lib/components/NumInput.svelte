<script lang="ts">
	import type { Input } from '$lib/types/interfaces';

	let { name = '', value = $bindable(), min = 0, max = 20 }: Input = $props();

	function inc() {
		value++;
	}

	function dec() {
		value--;
	}
</script>

<div class="container">
	<input type="number" {name} inputmode="numeric" pattern="[0-9]*" bind:value {min} {max} />
	<div class="controls">
		<button type="button" onclick={inc}>+</button>
		<button type="button" onclick={dec}>-</button>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 1rem;
	}
	input {
		width: 100%;
	}
	.controls {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
	}
</style>
