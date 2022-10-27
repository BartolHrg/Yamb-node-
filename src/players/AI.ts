import { ScoreNumber } from "../Abstract";
import { CommunicationObject, getId, PlayerDecisionCommunicationObject, PlayerStartCommunicationObject, PreGameCommunicationObject } from "../communication/Communication";
import { Player } from "./Player";

var ai_id = 0;
export abstract class AI extends Player {
	is_ai: boolean = true;
	constructor() {
		super(`AI${ai_id++}`);
	}
	async decide(msg: CommunicationObject): Promise<CommunicationObject | null> {
		switch (msg.type) {
			case "pre game": {
				switch (msg.data.main) {
					case "teams, players": { break; }
					case "number of dices": { break; }
					case "start": { return {
						id: getId(),
						type: "pre game",
						backend_expect_answer: false,
						data: {
							main: "start",
							player_name: this.name,
						},
					} as PreGameCommunicationObject; }
					case "order": { break; }
				}
				break;
			}
			case "success": {
				// if (!msg.data.successful) {
				// 	throw new Error(`Unsuccessful communication:\nquestion: ${JSON.stringify(msg)}`);
				// }
				break;
			}
			case "final result": {
				break;
			}
			default: {
				throw new Error(`No decision for type ${msg.type}\nfull message ${JSON.stringify(msg)}`);
			}
		}
		return null;
	}
}