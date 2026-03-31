import { algoType, dataType } from '$lib/types/enums';
import { setContext, getContext } from 'svelte';

const KEY = Symbol();

export class LayoutType {
	layout: dataType = $state(dataType.NONE);
	method: algoType = $state(algoType.NONE);
	type: string = $state('');

	constructor(type?: dataType) {
		setContext(KEY, this);
	}

	static get(): LayoutType {
		return getContext<LayoutType>(KEY);
	}

	setLayout(type: dataType): void {
		this.layout = type;
	}

	setMethod(type: algoType): void {
		this.method = type;
	}

	setType(type: string): void {
		this.type = type;
	}

	getLayout(): dataType {
		return this.layout;
	}

	getMethod(): algoType {
		return this.method;
	}
}
