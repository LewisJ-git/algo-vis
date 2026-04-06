import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => {
	return [
		{ method: 'search', type: 'linear' },
		{ method: 'search', type: 'binary' },
		{ method: 'sort', type: 'bubble' },
		{ method: 'sort', type: 'selection' },
		{ method: 'sort', type: 'insertion' },
		{ method: 'sort', type: 'merge' },
		{ method: 'sort', type: 'quick' }
	];
};

export const prerender = true;
