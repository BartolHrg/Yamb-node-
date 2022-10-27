import { Index } from "../Abstract";
import { CommunicationObject, getId, PlayerDecisionCommunicationObject, WriteDecisionCommunicationObject } from "../communication/Communication";
import { uniformRandom } from "../DiceRoller";
import { Cell, ColumnsData, ColumnsDataEntity, Location } from "../rows_and_columns/Abstract";
import { AI } from "./AI";
import { PlayerName } from "./Player";


export class RandomAI extends AI {
	turn: number = 0;
	announcement: Location | null;
	constructor() {
		super();
		this.announcement = null;
	}
	async decide(msg: CommunicationObject): Promise<CommunicationObject> {
		switch (msg.type) {
			case "player start": {
				return {
					id: getId(),
					type: "player decision",
					backend_expect_answer: false,
					data: {
						id: msg.id,
					},
				} as PlayerDecisionCommunicationObject;
			}
			case "dices": {
				const reroll: Index[] = [];
				const iss = uniformRandom(0, 1 << msg.data.dices.length);
				for (let i = 0; i < msg.data.dices.length; ++i) {
					if (iss & (1 << i)) {
						reroll.push(i);
					}
				}
				
				const announcable: ColumnsDataEntity[] = [];
				const non_announcable: ColumnsDataEntity[] = [];
				for (const cd of this.team.board.columns_data) {
					if (cd.announcable < this.turn) {
						non_announcable.push(cd);
					} else {
						announcable.push(cd);
					}
				}
				const non_announcable_cells: Cell[] = [];
				for (const nann of non_announcable) {
					const column = this.team.board.getByName(nann.name);
					for (const row_name of nann.availability(column)) {
						non_announcable_cells.push(column.getByName(row_name));
					}
				}
				const announcable_cells: Cell[] = [];
				for (const ann of announcable) {
					const column = this.team.board.getByName(ann.name);
					for (const row_name of ann.availability(column)) {
						announcable_cells.push(column.getByName(row_name));
					}
				}
				
				if (reroll.length === 0 || this.turn === 3) {
					this.turn = 0;
				} else {
					++this.turn;
				}
				
				var should_announce: boolean = false;
				if (announcable_cells.length === 0) {
					should_announce = false;
				} else if (non_announcable_cells.length === 0) {
					should_announce = true;
				} else if (uniformRandom(0, 4) === 0) {
					should_announce = true;
				}
				if (should_announce) {
					const i = uniformRandom(0, announcable_cells.length);
					const loc = announcable_cells[i].location;
					this.announcement = loc;
					return {
						id: getId(),
						type: "player decision",
						backend_expect_answer: false,
						data: {
							id: msg.id,
							announce: loc,
							reroll,
						},
					} as PlayerDecisionCommunicationObject;
				} else {
					return {
						id: getId(),
						type: "player decision",
						backend_expect_answer: false,
						data: {
							id: msg.id,
							reroll,
						},
					} as PlayerDecisionCommunicationObject;
				}
			}
			case "write question": {
				if (msg.data.team !== this.team.name) {
					return null;
				}
				// if only AI playing, one with min number selects random
				for (const player of this.team.players) {
					if (!(player as AI).is_ai) {
						return null;
					}
					if (this.name > player.name) {
						return null;
					}
				}
				const possible_cells: Cell[] = [];
				for (const column of this.team.board.columns) {
					const cd = this.team.board.columns_data_map.get(column.name);
					const rnms = cd.availability(column);
					for (const rn of rnms) {
						possible_cells.push(column.getByName(rn));
					}
				}
				const choosen_player = this.team.players[uniformRandom(0, this.team.players.length)];
				const ann = (choosen_player as RandomAI).announcement;
				for (const player of this.team.players) {
					(player as RandomAI).announcement = null;
				}
				const choosen_location: Location = ann || possible_cells[uniformRandom(0, possible_cells.length)].location;
				return {
					id: getId(),
					type: "write decision",
					backend_expect_answer: false,
					data: {
						id: msg.id,
						player_name: choosen_player.name,
						location: choosen_location,
					},
				} as WriteDecisionCommunicationObject;
			}
			default: {
				return await super.decide(msg);
			}
		}
	}
}