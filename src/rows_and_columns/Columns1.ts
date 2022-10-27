import { Column, AvailableInColumn, ColumnsData } from "./Abstract";
import * as common from "./common/CommonColumns";

export const columns_data: ColumnsData = [
	{ name: "downward", availability: common.downward, announcable: -1},
	{ name: "upward",   availability: common.upward,   announcable: -1},
	{ name: "free",     availability: common.free,     announcable: -1},
	{ name: "announce", availability: common.free,     announcable: 1 },
];
