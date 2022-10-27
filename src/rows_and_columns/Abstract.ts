import { Index, ScoreNumber } from "../Abstract";


export type    RowName = string;
export type ColumnName = string;
export type Location = {
	column: ColumnName;
	row   :    RowName;
};

export type RowCalculator = (dices: ScoreNumber[]) => ScoreNumber | null;
export type GroupCalculator = (cells: ScoreNumber[], all_cells?: Column) => ScoreNumber;
export type RowsDataEntity = { name: RowName, calculator: RowCalculator, };
export type RowsData = Array<{
	rows: RowsDataEntity[];
	calculator: GroupCalculator;
}>;

export type Cell = {
	location: Location;
	value: ScoreNumber | null;
};
export class Column {
	name: ColumnName;
	cells: Cell[];
	_cell_names: Map<RowName, Index>; // { [key: RowName]: Index };
	constructor(name: ColumnName, rows_data: RowsData) {
		this.name = name;
		this.cells = [];
		this._cell_names = new Map();
		for (const { rows, calculator } of rows_data) {
			for (const { name } of rows) {
				const index = this.cells.length;
				this.cells.push({ location: { column: this.name, row: name, }, value: null });
				this._cell_names.set(name, index);
			}
		}
	}
	getByName(name: RowName): Cell {
		const index = this._cell_names.get(name);
		if (index === undefined) { throw new Error(`invalid name ${name}`); }
		return this.cells[index];
	}
}
export type AvailableInColumn = (column: Column) => RowName[];

export type ColumnsDataEntity = {
	name: ColumnName;
	availability: AvailableInColumn;
	announcable: Index; // -1 for non announceable
};
export type ColumnsData = ColumnsDataEntity[];
