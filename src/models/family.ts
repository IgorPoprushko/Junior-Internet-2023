import { Db } from "../common/db";

export class Family {
	readonly id: string;

	static async create(db: Db, family: Family): Promise<Family> {
		throw new Error(`Not implemented.`);
	}
}