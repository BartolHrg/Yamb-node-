import { Communication, CommunicationObject } from "./Communication";
import { Stringer, StringCommunication } from "./StringCommunication";

// import { } from "readline-promise";
import * as ReadLine from "readline/promises";

export class ConsoleCommunication extends StringCommunication {
	readline: ReadLine.Interface;
	constructor(stringer: Stringer) {
		super(stringer);
		this.readline = ReadLine.createInterface({
			input: process.stdin,
			output: null
		});
	}
	async send(msg: CommunicationObject): Promise<void> {
		const str = await this.prepare(msg);
		// this.readline.write(str + "\n");
		console.log(str);
	}
	async read(): Promise<CommunicationObject> {
		const str = await this.readline.question("");
		return await this.interpret(str);
	}
}
