import { createHash } from "crypto";
import { Db } from "../common/db";

export class User {
	readonly id: string;
	readonly familyId: string;
	readonly email: string;
	readonly password: string;
	readonly role: number;
	readonly firstName: string;
	readonly lastName: string;

	static hashPassword(password: string): string {

		return createHash("sha256")
			.update(password)
			.digest()
			.toString("hex");
	}

	static async getByEmail(db: Db, email: string): Promise<User> {

		const rows = await db.query("SELECT * FROM users WHERE id = ?", [email]);
		if (rows.length !== 1)
			return undefined;
		return User.materialize(rows[0]);
	}

	static async create(db: Db, user: User): Promise<User> {

		await db.query(
			`INSERT INTO users (id, family_id, role, email, password, first_name, last_name) VALUES (?,?,?,?,?,?,?)`,
			[user.id, user.familyId, user.role, user.email, user.password, user.firstName, user.lastName]
		);
		return user;
	}

	private static materialize(row: any): User {
		return {
			id: row.id,
			familyId: row.family_id,
			email: row.email,
			password: row.password,
			role: row.role,
			firstName: row.firstName,
			lastName: row.lastName,
		};
	}
}