import { setContext, getContext } from 'svelte';
import { algorithmMap, type AlgorithmName, type ArrayAlgorithm } from './ArrayAlgorithms';
import { algoType } from '$lib/types/enums';

const KEY = Symbol();
const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));
const calculateSpeed = (multiplier: number, size: number) => {
	return (2 * DataArray.MAX_LENGTH) / size / multiplier;
};
const uniqueRNG = (min: number, max: number, length: number): Array<number> => {
	let lengthLimit = length > DataArray.MAX_LENGTH ? DataArray.MAX_LENGTH : length;
	let arr: Array<number> = Array.from({ length: lengthLimit }, (_, i) => i + 1);
	let index = arr.length;
	while (index != 0) {
		let randomIndex = Math.floor(Math.random() * index);
		index--;
		[arr[index], arr[randomIndex]] = [arr[randomIndex], arr[index]];
	}
	return arr;
};
export class DataArray {
	static MAX_LENGTH: number = 1000;
	static EXAMPLE_MIN: number = 0;
	static EXAMPLE_MAX: number = 20;
	static EXAMPLE_LEN: number = 10;
	data: Array<number> = $state([]);
	dataPrev: Array<number> = $state([]);
	activeIndices: Array<number> = $state([]);
	running: boolean = $state(false);
	iterator: ArrayAlgorithm | undefined = $state();
	inProcess: boolean = $state(false);

	constructor(min = 0, max = 20, length = 10) {
		this.generate(min, max, length);
		setContext(KEY, this);
	}

	generate(min: number, max: number, length: number): void {
		this.data = uniqueRNG(min, max, length);
		this.dataPrev = [...this.data];
		this.activeIndices = [];
	}

	static get(): DataArray {
		return getContext<DataArray>(KEY);
	}

	insert(input: number): void {
		this.data.push(input);
	}

	set(input: Array<number>): void {
		this.data = input;
	}

	getMin(): number {
		return Math.min(...this.data);
	}

	getMax(): number {
		return Math.max(...this.data);
	}

	getSize(): number {
		return this.data.length;
	}

	reset(): void {
		this.data = [...this.dataPrev];
		this.activeIndices = [];
	}

	start(): void {
		this.running = true;
		this.inProcess = true;
	}

	stop(): void {
		this.running = false;
		this.inProcess = false;
	}

	toggle(): void {
		this.running = !this.running;
		if (!this.running) {
			this.inProcess = false;
		}
	}

	setIterator(type: string): void {
		this.iterator = algorithmMap[type as AlgorithmName](this.data);
	}

	setSearchIterator(type: string | undefined, target: number): void {
		if (type) {
			this.iterator = algorithmMap[type as AlgorithmName](this.data, target);
		}
	}

	execute(
		type: algoType,
		animate: boolean,
		speed: number,
		search?: { type: string | undefined; target: number }
	) {
		switch (type) {
			case algoType.SORT:
				this.start();
				this.startAlgo(animate, speed);
				break;
			case algoType.SEARCH:
				if (search) {
					this.setSearchIterator(search.type, search.target);
					this.start();
					this.startAlgo(animate, speed);
				}
				break;
			default:
				break;
		}
	}

	async startAlgo(animate: boolean, speed: number): Promise<void> {
		if (this.iterator) {
			let result = this.iterator.next();
			while (!result.done) {
				if (!this.running) {
					return;
				}
				if (animate) {
					this.activeIndices = result.value;
					await timer(calculateSpeed(speed, this.getSize()));
				}
				result = this.iterator.next();
			}
			this.stop();
			if (result.value !== undefined) {
				this.activeIndices = [result.value];
			} else {
				this.activeIndices = [];
			}
		}
	}
}
