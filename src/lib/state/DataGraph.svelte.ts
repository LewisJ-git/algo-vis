import type { Coordinate, Dimension, GraphNode } from '$lib/types/interfaces';
import { getContext, setContext } from 'svelte';
import {
	algorithmMap,
	Terrain,
	type AlgorithmName,
	type GraphAlgorithm,
	type TerrainType
} from './GraphAlgorithm';
import { NodeState } from '$lib/types/enums';

const KEY = Symbol();
const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));
const calculateSpeed = (multiplier: number) => {
	return 1 / multiplier;
};

export const GraphSize: { [key: string]: Dimension } = {
	small: { width: 20, height: 15 },
	medium: { width: 40, height: 30 },
	large: { width: 60, height: 45 }
} as const;

export type GraphType = keyof typeof GraphSize;

type PlacementModes = NodeState.START | NodeState.END | NodeState.WALL | NodeState.EMPTY;

export const PlaceModes: { [key: string]: PlacementModes } = {
	start: NodeState.START,
	end: NodeState.END,
	wall: NodeState.WALL,
	none: NodeState.EMPTY
} as const;

export type PlacementTypes = keyof typeof PlaceModes;

export class DataGraph {
	graph: Array<Array<GraphNode>> = $state([]);
	startPos: Coordinate = $state({ x: 0, y: 0 });
	endPos: Coordinate = $state({ x: 0, y: 0 });
	placementMode: PlacementModes = $state(NodeState.EMPTY);
	iterator: GraphAlgorithm | undefined = $state();
	status: 'PENDING' | 'RUNNING' | 'PAUSED' | 'DONE' = $state('PENDING');

	constructor(dim = 'small' as GraphType, terrain = 'uniform' as TerrainType) {
		this.generate(dim, terrain);
		setContext(KEY, this);
	}

	generate(dim: GraphType, terrain: TerrainType): void {
		this.startPos = { x: 0, y: 0 };
		this.endPos = { x: 0, y: 0 };
		this.graph = Array.from({ length: GraphSize[dim].width }, (_, x) =>
			Array.from({ length: GraphSize[dim].height }, (_, y) => ({
				x,
				y,
				state: NodeState.EMPTY,
				weight: 1
			}))
		);
		this.randomStartPos();
		this.randomEndPos();
		Terrain[terrain](this.graph);
	}

	static get(): DataGraph {
		return getContext<DataGraph>(KEY);
	}

	changeTerrain(terrain: TerrainType): void {
		Terrain[terrain](this.graph);
	}

	getWidth(): number {
		return this.graph.length;
	}

	getHeight(): number {
		return this.graph[0].length;
	}

	start(): void {
		this.status = 'RUNNING';
	}

	stop(): void {
		this.status = 'PAUSED';
	}

	toggle(): void {
		if (this.status == 'RUNNING') {
			this.stop();
		} else {
			this.start();
		}
	}

	setPlacementMode(input: PlacementTypes): void {
		this.placementMode = PlaceModes[input];
	}

	setIterator(type: string): void {
		this.iterator = algorithmMap[type as AlgorithmName](this.graph, this.startPos, this.endPos);
	}

	randomStartPos(): void {
		let randomCoord: Coordinate = {
			x: Math.floor(Math.random() * this.getWidth()),
			y: Math.floor(Math.random() * this.getHeight())
		};
		let currentState: NodeState = this.graph[randomCoord.x][randomCoord.y].state;
		if (currentState == NodeState.WALL || currentState == NodeState.END) {
			this.randomStartPos();
		} else {
			this.updateStartPos(randomCoord);
		}
	}

	randomEndPos(): void {
		let randomCoord: Coordinate = {
			x: Math.floor(Math.random() * this.getWidth()),
			y: Math.floor(Math.random() * this.getHeight())
		};
		let currentState: NodeState = this.graph[randomCoord.x][randomCoord.y].state;
		if (currentState == NodeState.WALL || currentState == NodeState.START) {
			this.randomStartPos();
		} else {
			this.updateEndPos(randomCoord);
		}
	}

	updateStartPos(input: Coordinate): void {
		this.graph[this.startPos.x][this.startPos.y].state = NodeState.EMPTY;
		this.startPos = input;
		this.graph[this.startPos.x][this.startPos.y].state = NodeState.START;
	}

	updateEndPos(input: Coordinate): void {
		this.graph[this.endPos.x][this.endPos.y].state = NodeState.EMPTY;
		this.endPos = input;
		this.graph[this.endPos.x][this.endPos.y].state = NodeState.END;
	}

	reset(): void {
		this.graph.forEach((r) =>
			r.forEach((n) => {
				if (n.state == NodeState.PATH || n.state == NodeState.VISITED) n.state = NodeState.EMPTY;
			})
		);
		this.status = 'PENDING';
	}

	renderState(node: GraphNode, state: NodeState) {
		if (node.state == NodeState.START || node.state == NodeState.END) return;

		this.graph[node.x][node.y].state = state;
	}

	async startAlgo(animate: boolean, speed: number): Promise<void> {
		if (this.iterator) {
			let result = this.iterator.next();
			while (!result.done) {
				if (this.status !== 'RUNNING') {
					return;
				}
				if (animate) {
					const y = result.value;
					const coord = y.node;
					const n = this.graph[coord.x][coord.y];
					this.renderState(n, y.state);
					await timer(calculateSpeed(speed));
				}
				result = this.iterator.next();
			}
			this.status = 'DONE';
		}
	}
}
