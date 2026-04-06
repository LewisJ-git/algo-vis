import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => {
	return [
		{ method: 'graph', type: 'bfs' },
		{ method: 'graph', type: 'dfs' },
		{ method: 'graph', type: 'dijkstra' },
		{ method: 'graph', type: 'astar' }
	];
};

export const prerender = true;
