import { Index } from "../../Abstract";
import { AvailableInColumn, Column, RowName } from "../Abstract";

export function downward(column: Column): RowName[] {
	for (let i = 0; i < column.cells.length; i++) {
		const cell = column.cells[i];
		if (cell.value === null) {
			return [cell.location.row];
		}
	}
	return [];
}
export function upward(column: Column): RowName[] {
	for (let i = column.cells.length - 1; i >= 0; --i) {
		const cell = column.cells[i];
		if (cell.value === null) {
			return [cell.location.row];
		}
	}
	return [];
}
export function both(column: Column): RowName[] {
	const upper = downward(column);
	const lower = upward(column);
	for (const i of lower) {
		if (!upper.includes(i)) {
			upper.push(i);
		}
	}
	return upper;
}
export function free(column: Column): RowName[] {
	const available: RowName[] = [];
	for (const cell of column.cells) {
		if (cell.value === null) {
			available.push(cell.location.row);
		}
	}
	return available;
}
/** do not use ? */
// export function announced(i: Index, column: Column): AvailableInColumn {
// 	return (c: Column) => (column === c) ? [i] : [];
// }