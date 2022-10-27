import type { Index, ScoreNumber } from "../Abstract";
import type { PlayerName } from "../players/Player";
import type { Location } from "../rows_and_columns/Abstract";
import type { TeamName } from "../teams/Team";


export type PreGameCommunicationObject = {
	type: "pre game";
	id: Index;
	backend_expect_answer: boolean;
	data: {
		main: "new game";
	} | {
		main: "teams, players";
		response?: {name: TeamName, players: PlayerName[]}[];
	} | {
		main: "number of dices";
		response?: number;
	} | {
		main: "start" | "cancel",
		player_name?: PlayerName,
	} | {
		main: "order",
		order: Index[],
	};
};
export type PlayerStartCommunicationObject = {
	type: "player start",
	id: Index,
	backend_expect_answer: boolean;
	data: {
		team: TeamName;
		player: PlayerName;
	};
}
export type DicesCommunicationObject = {
	type: "dices";
	id: Index;
	backend_expect_answer: boolean;
	data: {
		team: TeamName;
		player: PlayerName;
		dices: ScoreNumber[];
	};
};
export type PlayerDecisionCommunicationObject = {
	type: "player decision";
	id: Index;
	backend_expect_answer: boolean;
	data: {
		id: Index;
		announce?: Location;
		reroll?: Index[];
	};
};
export type SuccessCommunicationObject = {
	type: "success";
	id: Index;
	backend_expect_answer: boolean;
	data: {
		id: Index;
		successful: boolean;
	};
};
export type WriteQuestionCommunicationObject = {
	type: "write question";
	id: Index;
	backend_expect_answer: boolean;
	data: {
		team: TeamName;
	};
};
export type WriteDecisionCommunicationObject = {
	type: "write decision";
	id: Index;
	backend_expect_answer: boolean;
	data: {
		id: Index;
		player_name: PlayerName;
		location: Location;
	};
};
export type FinalResultCommunicationObject = {
	type: "final result";
	id: Index;
	backend_expect_answer: boolean;
	data: Array<{
		name: TeamName;
		score: ScoreNumber;
	}>;
};

var id = 0;
export function getId(): Index {
	return id++;
}

// const possible_types = ["pre game", "dices", "player decision", "success", "write decision", "final result"] as const;
// export type Type = typeof possible_types[number];
// export type CommunicationObject<Data> = {
// 	type: Type;
// 	data: Data;
// };
export type CommunicationObject = (
	PreGameCommunicationObject |
	PlayerStartCommunicationObject |
	DicesCommunicationObject |
	PlayerDecisionCommunicationObject |
	SuccessCommunicationObject |
	WriteQuestionCommunicationObject |
	WriteDecisionCommunicationObject |
	FinalResultCommunicationObject
);
export type Type = CommunicationObject["type"];

export abstract class Communication {
	abstract send(msg: CommunicationObject): Promise<void>;
	abstract read(): Promise<CommunicationObject>;
	async ask(msg: CommunicationObject): Promise<CommunicationObject> {
		await this.send(msg);
		return await this.read();
	}
}
// export type Listener = (data: any, type?: Type) => void;
// export abstract class Communication {
// 	static counter: Index = 0;
// 	listeners: Map<Type, Map<Index, Listener>>;
// 	constructor() {
// 		this.listeners = new Map();
// 		for (const type of possible_types) {
// 			this.listeners.set(type, new Map());
// 		}
// 	}
// 	abstract send<T = any>(msg: CommunicationObject<T>): Promise<void>;
// 	onRead<R=any>(msg: Communication<R>): void {
// 		const listeners = this.listeners.get(msg.type);
// 		if (listeners.size === 0) {
// 			throw new Error("no listeners");
// 		}
// 		// JavaScript is such a super language that of course that
// 		// even though Map is ordered,
// 		// You can't just access the last element
// 		const listener = Array.from(listeners.values()).pop();
// 		listener(msg.data, msg.type);

// 	}
	
// 	subscribe(type: Type, listener: Listener): Index {
// 		const id = Communication.counter++;
// 		this.listeners.get(type).set(id, listener);
// 		return id;
// 	}
// 	unsubscribe(type: Type, id: Index) {
// 		this.listeners.get(type).delete(id);
// 	}
// }
