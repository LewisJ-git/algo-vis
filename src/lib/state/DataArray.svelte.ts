import { setContext, getContext } from 'svelte';

const KEY = Symbol();

// https://www.reddit.com/r/sveltejs/comments/1gzyv2h/global_state_and_context_api/
export class DataArray {
	static MAX_LENGTH: number = 1000;
	static EXAMPLE_MIN: number = 0;
	static EXAMPLE_MAX: number = 20;
	static EXAMPLE_LEN: number = 10;
	data: Array<number> = $state([]);

	constructor(min = 0, max = 20, length = 10) {
		this.generate(min, max, length);
		setContext(KEY, this);
	}

	generate(min: number, max: number, length: number): void {
		this.data = Array.from(
			{ length: length > DataArray.MAX_LENGTH ? DataArray.MAX_LENGTH : length },
			() => Math.floor(Math.random() * Math.max(min, max)) + Math.min(min, max)
		);
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
}
