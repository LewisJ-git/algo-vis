<script lang="ts">
	import { page } from '$app/state';
	import Folder from '$lib/assets/icons/Folder.svelte';
	import type { NavChildren } from '$lib/types/interfaces';
	import { resolve } from '$app/paths';
	import { slide } from 'svelte/transition';

	let {
		data = {
			name: '',
			link: '',
			types: []
		},
		isLast = false,
		active = $bindable(),
		index = -1,
		parent = '',
		children
	}: NavChildren = $props();

	let { params } = page;

	function expand(e: MouseEvent) {
		e.preventDefault();
		if (active == index) {
			active = -1;
		} else {
			active = index;
		}

		if (data.types.length == 0 && parent.length > 0) {
			switch (parent) {
				case 'search':
				case 'sort':
					resolve('/array/method/[method]/type/[type]', { method: parent, type: data.link });
					break;
				case 'graph':
					resolve('/graph/method/[method]/type/[type]', { method: parent, type: data.link });
					break;
				default:
					break;
			}
		}
	}
</script>

<div class="container">
	{#if isLast}
		<div class="path">
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<div class="y-border-end" />
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<div class="x-border-end" />
		</div>
	{:else}
		<div class="path">
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<div class="y-border" />
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<div class="x-border" />
		</div>
	{/if}
	<div class="sub-container">
		<button onclick={expand}>
			<Folder />
			<p>{data.name}</p>
		</button>
		{#if active == index}
			<div class="children" transition:slide|global={{ duration: 200 }}>
				{@render children?.()}
			</div>
		{/if}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		justify-items: stretch;
		gap: 1rem;
		padding: 0 1rem;
	}
	.container p {
		align-self: center;
	}
	.path {
		display: flex;
		flex-direction: row;
	}
	.y-border {
		border-right: 3px solid var(--foreground-dark);
	}
	.y-border-end {
		height: 50%;
		justify-self: flex-start;
		border-right: 3px solid var(--foreground-dark);
	}
	.x-border {
		width: 1.5rem;
		transform: translateY(-50%);
		border-bottom: 3px solid var(--foreground-dark);
	}
	.x-border-end {
		width: 1.5rem;
		transform: translateY(-50%);
		border-bottom: 3px solid var(--foreground-dark);
	}
	.sub-container {
		display: flex;
		flex-direction: column;
	}
	button {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0.5rem 0;
		gap: 1rem;
		color: inherit;
		font-family: inherit;
		font-size: inherit;
		border: none;
	}
	button:hover,
	button:active {
		color: var(--highlight);
		border: none;
		transition: all 0.2s ease-in-out;
	}
	.children {
		display: flex;
		flex-direction: column;
	}
</style>
