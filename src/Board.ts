import { ScoreNumber } from "./Abstract";
import { Column, ColumnName, ColumnsData, ColumnsDataEntity, RowName, RowsData, RowsDataEntity } from "./rows_and_columns/Abstract";

export class Board {
	columns: Column[];
	_column_names: Map<string, number>;
	columns_data: ColumnsData;
	rows_data: RowsData;
	columns_data_map: Map<ColumnName, ColumnsDataEntity>;
	rows_data_map: Map<RowName, RowsDataEntity>;
	constructor(columns_data: ColumnsData, rows_data: RowsData) {
		this.columns_data = columns_data;
		this.rows_data = rows_data;
		this.columns = [];
		this._column_names = new Map();
		for (const { name } of columns_data) {
			const index = this.columns.length;
			this.columns.push(new Column(name, rows_data));
			this._column_names.set(name, index);
		}
		this.columns_data_map = new Map();
		for (const cd of columns_data) {
			this.columns_data_map.set(cd.name, cd);
		}
		this.rows_data_map = new Map();
		for (const { rows } of rows_data) {
			for (const rd of rows) {
				this.rows_data_map.set(rd.name, rd);
			}
		}
	}
	getByName(name: string): Column {
		const index = this._column_names.get(name);
		if (index === undefined) { throw new Error(`invalid name ${name}`); }
		return this.columns[index];
	}
	
	calculate(): ScoreNumber {
		var score = 0;
		for (const group of this.rows_data) {
			for (const column of this.columns) {
				const relevant_cells = [];
				for (const {name} of group.rows) {
					relevant_cells.push(column.getByName(name).value);
				}
				score += group.calculator(relevant_cells, column);
			}
		}
		return score;
	}
}