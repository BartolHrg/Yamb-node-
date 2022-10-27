import { Index, ScoreNumber } from "../../Abstract";
import { RowCalculator } from "../Abstract";

export function sum(dices: ScoreNumber[]): ScoreNumber {
	// this was wrong because if you had more than required
	// it would return all of them
	// return dices.reduce((acc, dice) => acc + dice);
	var sum = 0;
	for (let i = 0; i < dices.length && i < 5; i++) {
		const dice = dices[i];
		sum += dice;
	}
	return sum;
}
export function sumMin(dices: ScoreNumber[]): ScoreNumber {
	dices.sort((a, b) => a - b);
	return sum(dices);
}
export function sumMax(dices: ScoreNumber[]): ScoreNumber {
	dices.sort((a, b) => b - a);
	return sum(dices);
}
export function numbered(n: ScoreNumber): RowCalculator {
	return function (dices: ScoreNumber[]): ScoreNumber {
		return sum(dices.filter(dice => dice === n));
	}
}
export function find(pattern: number[], dices: ScoreNumber[]): Index[] | null {
	const counter: Map<ScoreNumber, number[]> = new Map(); // {[key: ScoreNumber]: number[]} = {};
	for (let i = 0; i < dices.length; i++) {
		const dice = dices[i];
		if (!counter.has(dice)) {
			counter.set(dice, [i]);
		} else {
			counter.get(dice).push(i);
		}
	}
	const list: [ScoreNumber, Index[]][] = [];
	for (const [dice, indices] of counter.entries()) {
		list.push([dice, indices]);
	}
	list.sort(([dice1, indices1], [dice2, indices2]) => {
		var c;
		c = dice2 - dice1; // descending
		if (c !== 0) { return c; }
		c = indices2.length - indices1.length; // descending
		if (c !== 0) { return c; }
		return 0;
	});
	if (list.length < pattern.length) { return null; }
	const result: Index[] = [];
	const used = new Set<ScoreNumber>();
	for (let i = 0; i < pattern.length; i++) {
		const required = pattern[i];
		var found = false;
		for (const [dice, indices] of list) {
			if (used.has(dice)) { continue; }
			if (required <= indices.length) {
				used.add(dice);
				// this was wrong because if you had more than required
				// it would return all of them
				// result.push(...indices); 
				for (let j = 0; j < required; j++) {
					result.push(indices[j]);
				}
				found = true;
				break;
			}
		}
		if (!found) {
			return null;
		}
	}
	return result;
}
export function finder(pattern: number[]): RowCalculator {
	return (dices: ScoreNumber[]) => {
		const indices = find(pattern, dices);
		if (indices === null) { return null; }
		var sum = 0;
		for (const index of indices) {
			sum += dices[index];
		}
		return sum;
	}
}
export function bonus(bonus: ScoreNumber, row_calc: RowCalculator): RowCalculator {
	return (dices: ScoreNumber[]) => {
		const res = row_calc(dices);
		if (res === null) { return null; }
		return bonus + res;
	}
}
function removeDuplicatesFromSorted(array: number[]): number[] {
	if (array.length === 0 || array.length === 1) { return array; }
	const result = [];
	var last = array[0];
	result.push(last);
	for (let i = 1; i < array.length; i++) {
		const el = array[i];
		if (el !== last) {
			result.push(el);
			last = el;
		}
	}
	return result;
}
export function scale(dices: ScoreNumber[]): ScoreNumber | null {
	dices.sort((a, b) => b - a); // descending
	dices = removeDuplicatesFromSorted(dices);
	var join = dices.join();
	if (join.startsWith("65432")) {
		return 45;
	}
	if (join.startsWith("54321")) {
		return 35;
	}
	return null;
}