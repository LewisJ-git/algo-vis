export enum dataType {
	ARRAY = 'ARRAY',
	GRAPH = 'GRAPH',
	NONE = 'NONE'
}

export enum algoType {
	SEARCH = 'SEARCH',
	SORT = 'SORT',
	NONE = 'NONE'
}

export enum NodeState {
	EMPTY = 'EMPTY',
	WALL = 'WALL',
	START = 'START',
	END = 'END',
	VISITED = 'VISITED',
	PATH = 'PATH'
}

type Union<
	Max extends number,
	Accumulator extends Array<number> = []
> = Accumulator['length'] extends Max
	? Accumulator[number]
	: Union<Max, [...Accumulator, Accumulator['length']]>;

export type NumRange<Min extends number, Max extends number> = Exclude<Union<Max>, Union<Min>>;
