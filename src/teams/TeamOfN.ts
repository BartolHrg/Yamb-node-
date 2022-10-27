// import { Team, Player, Index, WriteDecision, CommunicationObject } from "../Abstract";

import { Index } from "../Abstract";
import { Communication } from "../communication/Communication";
import { Player } from "../players/Player";
import { Team, TeamName } from "./Team";

export class TeamOfN extends Team {
	// _player_iter: Generator<Player | null, never, void>;
	_current_player_index = 0;
	get number_of_players(): Index { return this.players.length; }
	get captain(): Player { for (const player of this.players.values()) { return player; } }
	constructor(name: TeamName, players?: Player[]) {
		super(name);
		if (players !== undefined) {
			for (const player of players) {
				this.add(player);
			}
		}
		// const th = this;
		// this._player_iter = (function* g() {
		// 	while (true) {
		// 		for (const player of th.players.values()) {
		// 			yield player;
		// 		}
		// 		yield null;
		// 	}
		// })();
		// this.current_player = this._player_iter.next().value;
	}
	
	async gotoNextPlayer(): Promise<boolean> {
		// const pl = this._player_iter.next().value;
		// if (pl === null) {
		// 	this.current_player = this._player_iter.next().value;
		// 	return false;
		// } else {
		// 	this.current_player = pl;
		// 	return true;
		// }
		++this._current_player_index;
		if (this._current_player_index === this.number_of_players) {
			this._current_player_index = 0;
			return false;
		}
		return true;
	}
	get current_player(): Player { return this.players[this._current_player_index]; }
	// async endTurn(): Promise<WriteDecision> {
	// 	const q = { type: "write decision" } as CommunicationObject<void>;
	// 	const to_write =await this.captain.ask<void, WriteDecision>(q);
	// 	if (to_write.type !== "write decision") {
	// 		throw new Error(`wrong type, expected "write decision", got ${to_write.type}`);
	// 	}
	// 	return to_write.data;
	// }
}
