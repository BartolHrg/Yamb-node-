import { ScoreNumber } from "../../Abstract";
import { Column, GroupCalculator } from "../Abstract";

export function sum(cells: ScoreNumber[]): ScoreNumber {
	return cells.reduce((acc, cell) => acc + cell);
}
export function conditionalBonus(bonus: ScoreNumber, condition: (score: ScoreNumber) => boolean, group_calc: GroupCalculator): GroupCalculator {
	return (cells: ScoreNumber[], all_cells: Column): ScoreNumber => {
		var res = group_calc(cells, all_cells);
		if (condition(res)) {
			res += bonus;
		}
		return res;
	}
}