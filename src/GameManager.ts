import { Index, ScoreNumber } from "./Abstract";
import { Board } from "./Board";
import { Communication, CommunicationObject, DicesCommunicationObject, FinalResultCommunicationObject, getId, PlayerDecisionCommunicationObject, PlayerStartCommunicationObject, PreGameCommunicationObject, SuccessCommunicationObject, WriteDecisionCommunicationObject, WriteQuestionCommunicationObject } from "./communication/Communication";
import { DiceRoller, TeamDiceRollerFactory } from "./DiceRoller";
import { Player, PlayerName } from "./players/Player";
import { Location } from "./rows_and_columns/Abstract";
import { Team, TeamName } from "./teams/Team";

function shuffle(array: any[]) {
	let currentIndex = array.length;
	let randomIndex;
	
	// While there remain elements to shuffle.
	while (currentIndex != 0) {
	
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
}

function roll(dices: ScoreNumber[], indices: Index[], roller: () => ScoreNumber) {
	for (let i = 0; i < indices.length; i++) {
		const index = indices[i];
		dices[index] = roller();
	}
}

export class GameManager {
	teams: Team[];
	order: Index[];
	communication: Communication;
	constructor(teams: Team[], boardFactory: () => Board, dice_roller_factory: TeamDiceRollerFactory, communication: Communication) {
		this.teams = teams;
		for (const team of teams) {
			team.board = boardFactory();
			team.dice_roller_factory = dice_roller_factory(team);
		}
		this.communication = communication;
	}
	
	async play() {
		await this.startGame();
		const column_count = this.teams[0].board.columns.length;
		const    row_count = this.teams[0].board.columns[0].cells.length;
		const count = column_count * row_count;
		for (let i = 0; i < count; i++) {
			console.log(count, i);
			await this.playRound();
		}
		await this.finishGame();
	}
	async startGame() {
		this.order = [...this.teams.keys()];
		shuffle(this.order);
		await this.communication.send({
			id: getId(),
			type: "pre game",
			backend_expect_answer: false,
			data: {
				main: "order",
				order: this.order,
			}
		} as PreGameCommunicationObject);
		const not_ready: Set<PlayerName> = new Set();
		for (const team of this.teams) {
			for (const player of team.players) {
				not_ready.add(player.name);
			}
		}
		await this.communication.send({
			id: getId(),
			type: "pre game",
			backend_expect_answer: true,
			data: {
				main: "start",
			}
		} as PreGameCommunicationObject);
		while (not_ready.size !== 0) {
			const response: CommunicationObject = await this.communication.read();
			if (response.type !== "pre game") {
				continue;
			}
			if (response.data.main !== "start") {
				if (response.data.main === "cancel") {
					throw new Error("Canceled");
				}
				continue;
			}
			not_ready.delete(response.data.player_name);
			// console.log(Array.from(not_ready.values()));
		}
	}
	async playRound() {
		for (const index of this.order) {
			await this.playTeam(this.teams[index]);
		}
	}
	async playTeam(team: Team) {
		const results: Map<PlayerName, [ScoreNumber[], Location | null]> = new Map();
		for (const player of team.players) {
			results.set(player.name, await this.playPlayer(player));
		}
		const response = await this.ask<WriteQuestionCommunicationObject, WriteDecisionCommunicationObject>({
			id: getId(),
			type: "write question",
			backend_expect_answer: true,
			data: {
				team: team.name,
			},
		}, (question, response) => {
			if (response.type !== "write decision" || response.data.id !== question.id) {
				return null;
			}
			const [dices, announcemet] = results.get(response.data.player_name);
			const {column: column_name, row: row_name} = response.data.location;
			if (announcemet && (announcemet.column !== column_name || announcemet.row !== row_name)) {
				return false;
			}
			const column_data = team.board.columns_data_map.get(column_name);
			const    row_data = team.board.   rows_data_map.get(   row_name);
			const column = team.board.getByName(column_name);
			if (!column_data.availability(column).includes(row_name)) {
			// if (cell.value !== null) {
				return false;
			}
			const cell = team.board.getByName(column_name).getByName(row_name);
			
			cell.value = row_data.calculator(dices) || 0;
			return true;
		});
		// cool, but now I no longer need response 🤷
	}
	
	
	async playPlayer(player: Player): Promise<[ScoreNumber[], Location | null]> {
		const response = await this.ask<PlayerStartCommunicationObject, PlayerDecisionCommunicationObject>({
			id: getId(),
			type: "player start",
			backend_expect_answer: true,
			data: {
				team: player.team.name,
				player: player.name,
			},
		}, (question, response) => {
			if (response.type !== "player decision" || response.data.id !== question.id) {
				return null;
			}
			// we only care about announcements
			if (!this.checkAnnouncement(response.data.announce, player.team, 0)) {
				return false;
			}
			return true;
		});
		
		const [n, roller] = player.dice_roller;
		var indices = [...Array(n).keys()];
		const dices = Array(n);
		var announcement: Location | null = null;
		
		for (let i = 1; i <= 2 && indices.length !== 0; ++i) {
			roll(dices, indices, roller);
			const response = await this.ask<DicesCommunicationObject, PlayerDecisionCommunicationObject>({
				id: getId(),
				type: "dices",
				backend_expect_answer: true,
				data: {
					team: player.team.name,
					player: player.name,
					dices,
				}
			}, (question, response) => {
				if (response.type !== "player decision" || response.data.id !== question.id) {
					return null;
				}
				if (!this.checkAnnouncement(response.data.announce, player.team, i)) {
					return false;
				}
				if (!response.data.reroll) {
					return true;
				}
				for (const index of response.data.reroll) {
					if (index >= n) {
						return false;
					}
				}
				return true;
			});
			indices = response.data.reroll;
			announcement = response.data.announce || null;
		}
		roll(dices, indices, roller);
		await this.communication.send({
			id: getId(),
			type: "dices",
			backend_expect_answer: false,
			data: {
				team: player.team.name,
				player: player.name,
				dices,
			},
		} as DicesCommunicationObject);
		return [dices, announcement];
	}
	
	checkAnnouncement(location: Location | null, team: Team, i: Index) {
		if (location) {
			const {column: column_name, row: row_name} = location;
			const column_data = team.board.columns_data_map.get(column_name);
			// const    row_data = team.board.   rows_data_map.get(   row_name);
			if (column_data.announcable < i || !column_data.availability(team.board.getByName(column_name)).includes(row_name)) {
				return false;
			}
		}
		return true;
	}
	
	async finishGame() {
		const results: Array<{
			name: TeamName;
			score: ScoreNumber;
		}> = [];
		for (const team of this.teams) {
			results.push({
				name: team.name,
				score: team.board.calculate(),
			})
		}
		console.log(results);
		await this.communication.send({
			id: getId(),
			type: "final result",
			backend_expect_answer: false,
			data: results
		} as FinalResultCommunicationObject);
	}
	
	async ask<Q extends CommunicationObject, R extends CommunicationObject>(question: Q, condition: (question: Q, response: CommunicationObject) => boolean | null, report_success: boolean = true): Promise<R> {
		while (true) {
			// TODO: typecheck fails
			const response: CommunicationObject = await this.communication.ask(question);
			const r = condition(question, response);
			if (report_success && r !== null) {
				await this.sendSuccess(response.id, r);
			}
			if (r) {
				return response as R;
			}
		}
	}
	
	async sendSuccess(id: Index, success: boolean) {
		await this.communication.send({
			type: "success",
			id: getId(),
			backend_expect_answer: false,
			data: {
				id: id,
				successful: success,
			}
		} as SuccessCommunicationObject);
	}
}