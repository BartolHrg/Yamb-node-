import { ScoreNumber, Index } from "./Abstract";
import type { Player } from "./players/Player";
import type { Team, TeamName } from "./teams/Team";

export type DiceRoller = [Index, () => ScoreNumber];

export type PlayerDiceRollerFactory = (player: Player) => DiceRoller;
export type TeamDiceRollerFactory   = (team: Team) => PlayerDiceRollerFactory;

export function uniformRandom(a: number, b: number): number {
	return a + Math.floor((b - a) * Math.random());
}

export function uniformRoller1ToN(n: ScoreNumber): DiceRoller[1] {
	return () => uniformRandom(1, n+1);
}

// const per_team_rollers: Map<TeamName, PlayerDiceRollerFactory> = new Map();
// export function perTeamDiceRollerFactory(dice_roller: DiceRoller): TeamDiceRollerFactory {
// 	per_team_rollers.set(name, dice_roller);
// 	return (team: Team) => per_team_rollers.get(team.name);
// }

export function sharedRollerFactory(dice_roller: DiceRoller): TeamDiceRollerFactory {
	return (team: Team) => (player: Player) => dice_roller;
}
