import { AI } from "../players/AI";
import { Communication, CommunicationObject } from "./Communication";


export class AICommunication extends Communication {
	last_decision: CommunicationObject | null;
	ai: AI;
	constructor(ai: AI) {
		super();
		this.ai = ai;
		this.last_decision = null;
	}
	async send(msg: CommunicationObject): Promise<void> {
		const dec = await this.ai.decide(msg);
		this.last_decision = dec;
	}
	async read(): Promise<CommunicationObject> {
		const dec = this.last_decision;
		this.last_decision = null;
		return dec;
	}
}