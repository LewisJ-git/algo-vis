<script lang="ts">
	import NavItem from './NavItem.svelte';
	import items from '$lib/data/Nav.json';

	let active = $state(-1);
</script>

<nav>
	{#each items as item, i_index}
		<NavItem bind:active data={item} index={i_index} isLast={i_index == items.length - 1}>
			{#each item.types as type, t_index}
				<NavItem
					data={type}
					index={t_index}
					parent={item.link}
					isLast={t_index == item.types.length - 1}
				/>
			{/each}
		</NavItem>
	{/each}
</nav>

<style>
	nav {
		display: flex;
		flex-direction: column;
		padding: 1rem 0;
	}
</style>
