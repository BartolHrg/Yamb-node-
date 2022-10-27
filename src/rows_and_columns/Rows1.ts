import { Column, RowCalculator, RowsData } from "./Abstract";
import * as CommonRows from "./common/CommonRows";
import * as CommonGroups from "./common/CommonGroups";

export const rows_data: RowsData = [
	{
		rows: [
			{name: "1", calculator: CommonRows.numbered(1),},
			{name: "2", calculator: CommonRows.numbered(2),},
			{name: "3", calculator: CommonRows.numbered(3),},
			{name: "4", calculator: CommonRows.numbered(4),},
			{name: "5", calculator: CommonRows.numbered(5),},
			{name: "6", calculator: CommonRows.numbered(6),},
		],
		calculator: CommonGroups.conditionalBonus(30, n => n >= 60, CommonGroups.sum),
	},
	{
		rows: [
			{name: "max", calculator: CommonRows.sum,},
			{name: "min", calculator: CommonRows.sum,},
		],
		calculator: ([max, min]: [number, number], all_cells: Column): number => (max - min) * all_cells.getByName("1").value,
	},
	{
		rows: [
			{name: "2 pairs", calculator: CommonRows.bonus(10, CommonRows.finder([2, 2])),},
			{name: "scale"  , calculator: CommonRows.scale,},
			{name: "full"   , calculator: CommonRows.bonus(30, CommonRows.finder([3, 2])),},
			{name: "poker"  , calculator: CommonRows.bonus(40, CommonRows.finder([4])),},
			{name: "yamb"   , calculator: CommonRows.bonus(50, CommonRows.finder([5])),},
		],
		calculator: CommonGroups.sum,
	},
];
