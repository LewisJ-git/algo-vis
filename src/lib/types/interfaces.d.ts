import type { Snippet } from 'svelte';

export interface NavData {
	name: string;
	link: string;
	types: Array<NavData>;
}

export interface NavChildren {
	data: NavData;
	isLast?: Boolean;
	index: Number;
	active?: Number;
	parent?: string;
	children?: Snippet;
}

export interface Input {
	name: string;
	value: number;
	min: number;
	max: number;
}
