import { setContext, getContext } from 'svelte';

const KEY = Symbol();

export class PlotParams {
	enableAnimation: boolean = $state(true);
	animationSpeed: number = $state(1);
	showIndex: boolean = $state(true);
	showValue: boolean = $state(true);

	static INDEX_LIMIT: number = 30;
	static VALUE_LIMIT: number = 20;
	static ANIMATION_LIMIT: number = 500;
	static SPEED_RANGE: { min: number; max: number } = { min: 0.1, max: 5 };

	constructor() {
		setContext(KEY, this);
	}

	static get(): PlotParams {
		return getContext<PlotParams>(KEY);
	}

	canAnimate(dataSize: number): boolean {
		return dataSize <= PlotParams.ANIMATION_LIMIT || this.enableAnimation;
	}

	canDisplayIndex(dataSize: number): boolean {
		return dataSize <= PlotParams.INDEX_LIMIT && this.showIndex;
	}

	canDisplayValue(dataSize: number): boolean {
		return dataSize <= PlotParams.VALUE_LIMIT && this.showValue;
	}
}
