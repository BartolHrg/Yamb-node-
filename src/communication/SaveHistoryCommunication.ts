import { Communication, CommunicationObject } from "./Communication";
import { json_stringer, StringCommunication, Stringer } from "./StringCommunication";

import * as fs from "fs";

export class SaveHistoryCommunication extends Communication {
	communication: Communication;
	file_name: string;
	messages: string[];
	first = true;
	constructor(communication: Communication) {
		super();
		this.communication = communication;
		const date = new Date();
		this.file_name = `./history/history_${date.toISOString().replaceAll(':', '-')}.json`;
		this.messages = [];
	}
	
	async send(msg: CommunicationObject): Promise<void> {
		this.add("send", msg);
		await this.communication.send(msg);
	}
	async read(): Promise<CommunicationObject> {
		const msg = await this.communication.read();
		this.add("read", msg);
		return msg;
	}
	add(direction: "send" | "read", message: CommunicationObject) {
		const str = JSON.stringify({direction, message,});
		this.messages.push(str);
		fs.writeFileSync(this.file_name, "[\n\t" + this.messages.join(",\n\t") + "\n]");
	}
}