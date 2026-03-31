import type { Snippet } from 'svelte';
import type { ScaleBand } from 'd3';

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
	factor?: number;
}

export interface Dim {
	top: number;
	left: number;
	bottom: number;
	right: number;
}

export interface Scale {
	x: ScaleBand<string>;
	y: ScaeLinear<number>;
}

type AlgorithmArgs = { arr: Array<number>; animate: boolean; speed: number };
