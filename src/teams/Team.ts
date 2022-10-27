import { PlayerDiceRollerFactory, TeamDiceRollerFactory } from "../DiceRoller";
import type { Board } from "../Board";
import { Communication } from "../communication/Communication";
import type { Player, PlayerName } from "../players/Player";
import { Index } from "../Abstract";

export type TeamName = string;

export abstract class Team {
	name: TeamName;
	players: Player[];
	_player_names: Map<PlayerName, Index>;
	abstract get current_player(): Player;
	board: Board | null;
	_dice_roller_factory: PlayerDiceRollerFactory | null;
	get dice_roller_factory() { return this._dice_roller_factory; }
	set dice_roller_factory(value: PlayerDiceRollerFactory) {
		this._dice_roller_factory = value;
		if (value === null) { return; }
		for (const player of this.players) {
			player.dice_roller = value(player);
		}
	}
	constructor(name: TeamName) {
		this.name = name;
		this.players = [];
		this._player_names = new Map();
		this.dice_roller_factory = null;
		this.board = null;
	}
	
	getByName(name: PlayerName) {
		return this.players[this._player_names.get(name)];
	}
	
	abstract gotoNextPlayer(): Promise<boolean>;
	
	add(player: Player) {
		const index = this.players.length;
		this.players.push(player);
		this._player_names.set(player.name, index);
		player.team = this;
		if (this.dice_roller_factory !== null) { 
			player.dice_roller = this.dice_roller_factory(player); 
		}
	}
	// remove(player_name: string) {
	// 	const player = this.players.get(player_name);
	// 	this._player_names.delete(player_name);
	// 	player.team = null;
	// 	player.dice_roller = null;
	// }
}

