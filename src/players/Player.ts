import type { Team } from "../teams/Team";
import { Communication } from "../communication/Communication";
import { DiceRoller } from "../DiceRoller";

export type PlayerName = string;

export class Player {
	name: PlayerName;
	team: Team | null = null;
	dice_roller: DiceRoller | null;
	constructor(name: string) {
		this.name = name;
		this.dice_roller = null;
	}
}