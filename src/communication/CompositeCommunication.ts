import { Communication, CommunicationObject } from "./Communication";


export class CompositeCommunication extends Communication {
	communications: Communication[];
	constructor(communications: Communication[]) {
		super();
		this.communications = communications;
	}
	async send(msg: CommunicationObject): Promise<void> {
		const promises = [];
		for (const comm of this.communications) {
			promises.push(comm.send(msg));
		}
		for (const p of promises) {
			await p;
		}
	}
	async read(): Promise<CommunicationObject> {
		for (const comm of this.communications) {
			const r = await comm.read();
			if (r !== null) {
				return r;
			}
		}
		return null;
	}
}