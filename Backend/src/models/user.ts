import { createHash } from "crypto";
import { MyPool } from "../common/my_pool";

export enum Role {
	Parent = 1,
	Child = 2
}

export class User {
	readonly id: string;
	readonly familyId: string;
	readonly login: string;
	readonly password: string;
	readonly role: Role;
	readonly firstName: string;
	readonly lastName: string;
	readonly balance: number;

	static hashPassword(password: string): string {
		return createHash("sha256")
			.update(password)
			.digest()
			.toString("hex");
	}

	static async get_by_login_and_family(pool: MyPool, login: String, family_id: String): Promise<User> {
		const result = await pool.query("SELECT * FROM USER WHERE login = ? AND family_id = ?;", [login, family_id]);
		if (result[0].length !== 1)
			return undefined;
		return User.materialize(result[0][0]);
	}
	static async get_by_id_and_family_id(pool: MyPool, user_id: String, family_id: String): Promise<User> {

		const result = await pool.query("SELECT * FROM USER WHERE id = ? AND family_id = ?;", [user_id, family_id]);
		if (result[0].length !== 1)
			return undefined;
		return User.materialize(result[0][0]);
	}
	static async get_count_by_ids_family(pool: MyPool, child_list: Number[], family_id: String): Promise<Boolean> {

		const result = await pool.query("SELECT COUNT(*) as Count FROM USER WHERE id IN (?) AND family_id = ? AND role = 2 AND archive = 0;", [child_list, family_id]);
		if (result[0].length !== 1)
			return false;
		return child_list.length == Number(result[0][0]["Count"]);
	}
	static async get_all_by_family_id(pool: MyPool, family_id: String, user_id: string): Promise<User[]> {

		const q_result = await pool.query("SELECT * FROM USER WHERE family_id = ? AND id != ? AND archive = 0;", [family_id, user_id]);
		if (q_result[0].length == 0)
			return undefined;

		let result = q_result[0].map((user) => User.materialize(user))

		return result;
	}
	static async get_balance_by_id(pool: MyPool, user_id: string): Promise<number> {

		const q_result = await pool.query("SELECT balance FROM USER WHERE id = ? AND archive = 0;", [user_id]);
		if (q_result[0].length == 0)
			return undefined;
		return Number(q_result[0][0]["balance"]);
	}

	static async create(pool: MyPool, user: User): Promise<User> {

		const result = await pool.query(
			`INSERT INTO USER (first_name, last_name, login, password, role, family_id, balance)
				VALUES (?,?,?,?,?,?,?);`,
			[user.firstName, user.lastName, user.login, user.password, user.role, user.familyId, 0]
		)
		return { ...user, id: result[0].insertId.toString() };
	}

	static async archive(pool: MyPool, id: string): Promise<any> {

		const result = await pool.query(`UPDATE USER SET archive = 1 WHERE id = ?;`, [id])
		return result;
	}

	private static materialize(row: any): User {
		return {
			id: row.id,
			familyId: row.family_id,
			login: row.login,
			password: row.password,
			role: row.role,
			firstName: row.firstName,
			lastName: row.lastName,
			balance: row.balance,
		};
	}
}
