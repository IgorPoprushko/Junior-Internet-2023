import { MyPool } from "../common/my_pool";

export class Family {
	readonly id: string;
	readonly name: string;
	readonly email: string;

	static async getByEmail(pool: MyPool, email: string): Promise<Family> {

		const result = await pool.query("SELECT * FROM FAMILY WHERE email = ?;", [email]);
		if (result[0].length !== 1)
			return undefined;

		return Family.materialize(result[0][0]);
	}

	static async create(pool: MyPool, family: Family): Promise<Family> {
		const result = await pool.query("INSERT INTO FAMILY ( name ,email ) VALUES (?,?);", [family.name, family.email]);
		return { ...family, id: result[0].insertId.toString() };
	}
	static async archive(pool: MyPool, id: string): Promise<any[]> {
		const result = await pool.query("UPDATE FAMILY SET archive = 1 WHERE id = ?;", [id]);
		return result;
	}

	private static materialize(row: any): Family {
		return {
			id: row.id,
			email: row.email,
			name: row.name,
		};
	}
}