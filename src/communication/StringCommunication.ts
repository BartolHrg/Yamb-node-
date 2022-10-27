import { Communication, CommunicationObject } from "./Communication";

export type Stringer = {
	stringify: (obj: CommunicationObject) => Promise<string>;
	parse    : (str: string) => Promise<CommunicationObject>;
};
export const json_stringer: Stringer = {
	stringify: async (obj: CommunicationObject) => { return JSON.stringify(obj); },
	parse    : async (str: string)              => { return JSON.parse    (str) as CommunicationObject; },
};

export abstract class StringCommunication extends Communication {
	stringer: Stringer;
	constructor(stringer: Stringer) {
		super();
		this.stringer = stringer;
	}
	async prepare(msg: CommunicationObject): Promise<string> {
		return await this.stringer.stringify(msg);
	}
	async interpret(msg: string): Promise<CommunicationObject> {
		return (await this.stringer.parse(msg)) as CommunicationObject;
	}
}
