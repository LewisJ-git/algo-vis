<script lang="ts">
	import { DataGraph } from '$lib/state/DataGraph.svelte';
	import { PlotParams } from '$lib/state/PlotParams.svelte';
	import { NodeState } from '$lib/types/enums';
	import type { Coordinate, Dimension, GraphNode } from '$lib/types/interfaces';
	import { interpolateNumber } from 'd3';
	import { Layer, type LayerEvent, type Render } from 'svelte-canvas';

	const {
		size,
		node,
		cellSizeState,
		activeNode,
		dragMode,
		setActiveNode,
		setCellSize,
		activateDrag,
		disableDrag
	}: {
		size: Dimension;
		node: GraphNode;
		cellSizeState: number;
		activeNode: Coordinate;
		dragMode: boolean;
		activateDrag: () => void;
		disableDrag: () => void;
		setCellSize: (input: number) => void;
		setActiveNode: (input: Coordinate) => void;
	} = $props();
	let params = PlotParams.get();
	let dataContext = DataGraph.get();

	let cell: Layer;

	let strokeColor: string = $state('');
	let Color: string = $state('');

	function stroke(node: GraphNode): string {
		if (activeNode.x == node.x && activeNode.y == node.y) {
			switch (dataContext.placementMode) {
				case NodeState.WALL:
					return '#41f341';
				case NodeState.START:
					return '#41e1f3';
				case NodeState.END:
					return '#df3030';
				default:
					break;
			}
		}
		switch (node.state) {
			case NodeState.WALL:
				return '#41f341';
			case NodeState.START:
				return '#41e1f3';
			case NodeState.END:
				return '#df3030';
			default:
				return 'rgba(65, 243, 65, 0.5)';
		}
	}

	function fill(context: CanvasRenderingContext2D, node: GraphNode) {
		switch (node.state) {
			case NodeState.WALL:
				context.fillStyle = '#41f341';
				break;
			case NodeState.START:
				context.fillStyle = '#41e1f3';
				break;
			case NodeState.VISITED:
				context.fillStyle = 'rgba(65, 225, 243, 0.4)';
				break;
			case NodeState.PATH:
				context.fillStyle = 'rgba(223, 48, 48, 0.4)';
				break;
			case NodeState.END:
				context.fillStyle = '#df3030';
				break;
			default:
				context.fillStyle = `rgba(65, 243, 65, ${interpolateNumber(0, 0.5)(node.weight / 10)})`;
				break;
		}
	}

	const render: Render = ({ context, width, height }) => {
		context.strokeStyle = '#002706';
		const cellSize: number = width / size.width;
		if (cellSizeState !== cellSize) {
			setCellSize(cellSize);
		}
		const s: Coordinate = { x: node.x * cellSize, y: node.y * cellSize };

		context.strokeStyle = stroke(node);
		context.strokeRect(s.x, s.y, cellSize, cellSize);
		fill(context, node);
		context.fillRect(s.x, s.y, cellSize, cellSize);
	};

	const onhover = (e: LayerEvent) => {
		const mouse: Coordinate = {
			x: Math.floor(e.x / cellSizeState),
			y: Math.floor(e.y / cellSizeState)
		};
		if (mouse.x <= node.x && mouse.y <= node.y) {
			setActiveNode({ x: node.x, y: node.y });
		}
	};

	const onleave = () => {
		setActiveNode({ x: -1, y: -1 });
	};

	const ondown = () => {
		if (
			dataContext.placementMode == NodeState.WALL ||
			dataContext.placementMode == NodeState.EMPTY
		) {
			activateDrag();
		}
	};

	const onup = () => {
		disableDrag();
	};

	const onmove = () => {
		if (
			dragMode &&
			dataContext.graph[activeNode.x][activeNode.y].state != NodeState.END &&
			dataContext.graph[activeNode.x][activeNode.y].state != NodeState.START
		) {
			dataContext.graph[activeNode.x][activeNode.y].state = dataContext.placementMode;
		}
	};

	const handleClick = () => {
		if (dataContext.placementMode == NodeState.START) {
			dataContext.updateStartPos(activeNode);
		}
		if (dataContext.placementMode == NodeState.END) {
			dataContext.updateEndPos(activeNode);
		}
		if (
			dataContext.placementMode == NodeState.WALL &&
			dataContext.graph[activeNode.x][activeNode.y].state != NodeState.END &&
			dataContext.graph[activeNode.x][activeNode.y].state != NodeState.START
		) {
			dataContext.graph[activeNode.x][activeNode.y].state = dataContext.placementMode;
		}
	};
</script>

<Layer
	{render}
	bind:this={cell}
	onclick={handleClick}
	onmouseenter={onhover}
	onmouseleave={onleave}
	onmousedown={ondown}
	onmouseup={onup}
	onmousemove={onmove}
/>
