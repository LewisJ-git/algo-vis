import { NodeState } from '$lib/types/enums';
import type { Coordinate, Graph, GraphNode, Neighbors } from '$lib/types/interfaces';
import { interpolateRound } from 'd3';
import { createNoise2D } from 'simplex-noise';

export type AlgoYield =
	| { state: NodeState.VISITED; node: Coordinate }
	| { state: NodeState.PATH; node: Coordinate };
export type GraphAlgorithm = Generator<AlgoYield, void, unknown>;

const neighbors = (input: Coordinate): Neighbors => ({
	left: { x: input.x - 1, y: input.y },
	top: { x: input.x, y: input.y - 1 },
	right: { x: input.x + 1, y: input.y },
	bottom: { x: input.x, y: input.y + 1 }
});

function key(input: Coordinate): string {
	return `${input.x},${input.y}`;
}

function isValid(input: Coordinate, graph: Graph) {
	if (input.x < 0 || input.y < 0 || input.x >= graph.length || input.y >= graph[0].length)
		return false;

	if (
		graph[input.x][input.y].state == NodeState.VISITED ||
		graph[input.x][input.y].state == NodeState.WALL
	)
		return false;

	return true;
}

function isSolved(input: GraphNode) {
	if (input.state == NodeState.END) {
		return true;
	}
	return false;
}

function uniform(graph: Graph) {
	graph.forEach((dx) => dx.forEach((dy) => (dy.weight = 1)));
}
function random(graph: Graph) {
	graph.forEach((dx) => dx.forEach((dy) => (dy.weight = Math.floor(Math.random() * 9) + 1)));
}
function noise(graph: Graph) {
	const noise2D = createNoise2D();
	graph.forEach((dx, x) =>
		dx.forEach((dy, y) => {
			dy.weight = interpolateRound(1, 9)(noise2D(x, y));
		})
	);
}

function shuffle(directions: Array<string>): void {
	let index = directions.length;
	while (index != 0) {
		let randomIndex = Math.floor(Math.random() * index);
		index--;
		[directions[index], directions[randomIndex]] = [directions[randomIndex], directions[index]];
	}
}

function manhattanDistance(a: Coordinate, b: Coordinate) {
	return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function reconstructPath(
	map: Map<string, Coordinate>,
	start: Coordinate,
	end: Coordinate
): Array<Coordinate> {
	const path: Array<Coordinate> = [];
	let currentKey = key(end);
	const seen = new Set<string>();

	while (map.has(currentKey)) {
		if (seen.has(currentKey)) {
			break;
		}
		seen.add(currentKey);
		const node = map.get(currentKey);
		if (node) {
			path.push(node);
			if (node == start) {
				break;
			}
			currentKey = key(node);
		}
	}

	return path.reverse();
}

function* bfs(graph: Graph, start: Coordinate, end: Coordinate): GraphAlgorithm {
	let queue: Array<Coordinate> = [start];
	let parent = new Map<string, Coordinate>();

	while (queue.length > 0) {
		const currentNode = queue.shift();
		let currentNeighbors: Neighbors;

		if (currentNode) {
			yield {
				state: NodeState.VISITED,
				node: currentNode
			};
			currentNeighbors = neighbors(currentNode);

			for (const n of Object.keys(currentNeighbors)) {
				const c = currentNeighbors[<keyof Neighbors>n];
				if (isValid(c, graph)) {
					parent.set(key(c), currentNode);
					if (isSolved(graph[c.x][c.y])) {
						const path = reconstructPath(parent, start, end);
						for (const p of path) {
							yield { state: NodeState.PATH, node: p };
						}
						return;
					}
					queue.push(c);
					yield { state: NodeState.VISITED, node: c };
				}
			}
		}
	}
}

function* dfs(graph: Graph, start: Coordinate, end: Coordinate): GraphAlgorithm {
	let stack: Array<Coordinate> = [start];
	let parent = new Map<string, Coordinate>();

	while (stack.length > 0) {
		const currentNode = stack.pop();
		let currentNeighbors: Neighbors;

		if (currentNode) {
			if (!isValid(currentNode, graph)) continue;

			yield {
				state: NodeState.VISITED,
				node: currentNode
			};

			currentNeighbors = neighbors(currentNode);
			let directions = Object.keys(currentNeighbors);
			shuffle(directions);

			for (const n of directions) {
				const c = currentNeighbors[<keyof Neighbors>n];
				if (isValid(c, graph)) {
					parent.set(key(c), currentNode);
					if (isSolved(graph[c.x][c.y])) {
						const path = reconstructPath(parent, start, end);
						for (const p of path) {
							yield { state: NodeState.PATH, node: p };
						}
						return;
					}
					stack.push(c);
				}
			}
		}
	}
}

function* dijkstra(graph: Graph, start: Coordinate, end: Coordinate): GraphAlgorithm {
	let distances = new Map<string, number>();
	let parent = new Map<string, Coordinate>();
	let minQueue: Array<Coordinate> = [start];
	distances.set(key(start), 0);
	while (minQueue.length > 0) {
		minQueue.sort(
			(a, b) => (distances.get(key(a)) ?? Infinity) - (distances.get(key(b)) ?? Infinity)
		);

		const currentNode = minQueue.shift();
		if (currentNode) {
			const currentKey = key(currentNode);
			if (graph[currentNode.x][currentNode.y].state == NodeState.VISITED) continue;
			yield {
				state: NodeState.VISITED,
				node: currentNode
			};

			if (graph[currentNode.x][currentNode.y].state == NodeState.END) {
				const path = reconstructPath(parent, start, end);
				for (const p of path) {
					yield { state: NodeState.PATH, node: p };
				}

				return;
			}
			const currentNeighbors = neighbors(currentNode);
			for (const n of Object.keys(currentNeighbors)) {
				let c = currentNeighbors[<keyof Neighbors>n];
				if (!isValid(c, graph)) continue;
				const nKey = key(c);
				const newDist = (distances.get(currentKey) ?? Infinity) + graph[c.x][c.y].weight;
				if (newDist < (distances.get(nKey) ?? Infinity)) {
					distances.set(nKey, newDist);
					parent.set(nKey, currentNode);
					minQueue.push(c);
				}
			}
		}
	}
}

function* astar(graph: Graph, start: Coordinate, end: Coordinate): GraphAlgorithm {
	let parent = new Map<string, Coordinate>();
	const openSet: { node: Coordinate; f: number }[] = [];
	let gScore = new Map<string, number>();

	const startKey = key(start);

	gScore.set(startKey, 0);
	openSet.push({
		node: start,
		f: manhattanDistance(start, end)
	});

	while (openSet.length > 0) {
		let bestIndex = 0;
		for (let i = 1; i < openSet.length; i++) {
			if (openSet[i].f < openSet[bestIndex].f) {
				bestIndex = i;
			}
		}

		const { node: currentNode } = openSet.splice(bestIndex, 1)[0];

		if (currentNode) {
			const currentKey = key(currentNode);
			if (graph[currentNode.x][currentNode.y].state == NodeState.VISITED) continue;

			yield {
				state: NodeState.VISITED,
				node: currentNode
			};

			if (graph[currentNode.x][currentNode.y].state == NodeState.END) {
				const path = reconstructPath(parent, start, end);
				for (const p of path) {
					yield { state: NodeState.PATH, node: p };
				}

				return;
			}

			const currentNeighbors = neighbors(currentNode);
			for (const n of Object.keys(currentNeighbors)) {
				let c = currentNeighbors[<keyof Neighbors>n];
				if (!isValid(c, graph)) continue;
				const nKey = key(c);
				const tentativeG = gScore.get(currentKey)! + graph[c.x][c.y].weight;
				if (tentativeG < (gScore.get(nKey) ?? Infinity)) {
					parent.set(nKey, currentNode);
					gScore.set(nKey, tentativeG);

					const f = tentativeG + manhattanDistance(c, end);
					openSet.push({ node: c, f });
				}
			}
		}
	}
}

export const Terrain = {
	uniform,
	random,
	noise
} as const;

export type TerrainType = keyof typeof Terrain;

export const algorithmMap = {
	bfs,
	dfs,
	dijkstra,
	astar
} as const;

export type AlgorithmName = keyof typeof algorithmMap;
