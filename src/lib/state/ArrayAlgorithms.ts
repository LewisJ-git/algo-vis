export type ArrayAlgorithm = Generator<Array<number>, void | number, unknown>;

function* bubble(arr: Array<number>): ArrayAlgorithm {
	let i, j, temp;
	let swapped;
	const n = arr.length;
	for (i = 0; i < n - 1; i++) {
		yield [i];
		swapped = false;
		for (j = 0; j < n - i - 1; j++) {
			if (arr[j] > arr[j + 1]) {
				temp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = temp;
				swapped = true;
				yield [j, j + 1];
			}
		}

		if (swapped == false) break;
	}
}

function* selection(arr: Array<number>): ArrayAlgorithm {
	const n = arr.length;
	for (let i = 0; i < n - 1; i++) {
		yield [i];
		let min_idx = i;
		for (let j = i + 1; j < n; j++) {
			if (arr[j] < arr[min_idx]) {
				yield [j, min_idx];
				min_idx = j;
			}
		}

		let temp = arr[i];
		arr[i] = arr[min_idx];
		arr[min_idx] = temp;
		yield [i, min_idx];
	}
}

function* insertion(arr: Array<number>): ArrayAlgorithm {
	const n = arr.length;
	for (let i = 1; i < n; i++) {
		yield [i];
		let key = arr[i];
		let j = i - 1;
		while (j >= 0 && arr[j] > key) {
			yield [j, i];
			arr[j + 1] = arr[j];
			j = j - 1;
		}
		arr[j + 1] = key;
	}
}

function* mergeSort(arr: Array<number>, left: number, mid: number, right: number): ArrayAlgorithm {
	yield [left, mid, right];
	const n1 = mid - left + 1;
	const n2 = right - mid;

	const L = new Array(n1);
	const R = new Array(n2);

	for (let i = 0; i < n1; i++) L[i] = arr[left + i];
	for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

	let i = 0,
		j = 0;
	let k = left;

	while (i < n1 && j < n2) {
		if (L[i] <= R[j]) {
			arr[k] = L[i];
			yield [k, left + i];
			i++;
		} else {
			arr[k] = R[j];
			yield [k, mid + j];
			j++;
		}
		k++;
	}

	while (i < n1) {
		arr[k] = L[i];
		yield [k];
		i++;
		k++;
	}

	while (j < n2) {
		arr[k] = R[j];
		yield [k];
		j++;
		k++;
	}
}

function* mergeController(arr: Array<number>, left: number, right: number): ArrayAlgorithm {
	if (left >= right) return;

	const mid = Math.floor(left + (right - left) / 2);
	yield [mid];
	yield* mergeController(arr, left, mid);
	yield* mergeController(arr, mid + 1, right);
	yield* mergeSort(arr, left, mid, right);
}

function* merge(arr: Array<number>): ArrayAlgorithm {
	yield* mergeController(arr, 0, arr.length - 1);
}

function* partition(
	arr: Array<number>,
	low: number,
	high: number
): Generator<Array<number>, number, unknown> {
	let pivot = arr[high];
	yield [high];

	let i = low - 1;

	for (let j = low; j <= high - 1; j++) {
		if (arr[j] < pivot) {
			i++;
			yield* swap(arr, i, j);
		}
	}

	yield* swap(arr, i + 1, high);
	return i + 1;
}

function* swap(arr: Array<number>, i: number, j: number): ArrayAlgorithm {
	let temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
	yield [i, j];
}

function* quickSort(arr: Array<number>, low: number, high: number): ArrayAlgorithm {
	if (low < high) {
		let pi = yield* partition(arr, low, high);

		yield* quickSort(arr, low, pi - 1);
		yield* quickSort(arr, pi + 1, high);
	}
}

function* quick(arr: Array<number>): ArrayAlgorithm {
	yield* quickSort(arr, 0, arr.length - 1);
}

function* linear(arr: Array<number>, target?: number): ArrayAlgorithm {
	if (target !== undefined) {
		for (let i = 0; i < arr.length; i++) {
			yield [i];
			if (arr[i] == target) {
				return i;
			}
		}
	}
}

function* binary(arr: Array<number>, target?: number): ArrayAlgorithm {
	if (target !== undefined) {
		let low = 0;
		let high = arr.length - 1;
		let mid;
		yield [low, high];
		while (high >= low) {
			mid = low + Math.floor((high - low) / 2);
			yield [mid];

			if (arr[mid] == target) return mid;

			if (arr[mid] > target) {
				high = mid - 1;
				yield [low, high];
			} else {
				low = mid + 1;
				yield [low, high];
			}
		}
		return;
	}
}

type Algo = (data: number[], target?: number) => ArrayAlgorithm;

export const algorithmMap: { [key: string]: Algo } = {
	bubble,
	selection,
	insertion,
	merge,
	quick,
	linear,
	binary
};

export type AlgorithmName = keyof typeof algorithmMap;
