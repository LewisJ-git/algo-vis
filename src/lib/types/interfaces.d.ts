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

export interface Directions {
	top: number;
	left: number;
	bottom: number;
	right: number;
}

export interface Dimension {
	width: number;
	height: number;
}

export interface Coordinate {
	x: number;
	y: number;
}

export interface Neighbors {
	left: Coordinate;
	top: Coordinate;
	right: Coordinate;
	bottom: Coordinate;
}

export interface Scale {
	x: ScaleBand<string>;
	y: ScaeLinear<number>;
}

export interface GraphNode {
	x: number;
	y: number;
	state: NodeState;
	weight: NumRange<1, 9>;
}

export type Graph = Array<Array<GraphNode>>;
