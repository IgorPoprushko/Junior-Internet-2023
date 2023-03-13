import { createHash } from "crypto";
import { formatDate } from "../common/date";
import { MyPool } from "../common/my_pool";

export class Task {
	readonly id: string;
	readonly family_id: string;
	readonly user_id: string;
	readonly children_list: number[];
	readonly reward: number;
	readonly title: string;
	readonly description: string;
	readonly start_date: Date;
	readonly end_date: Date;

	static hashPassword(password: string): string {
		return createHash("sha256")
			.update(password)
			.digest()
			.toString("hex");
	}

	static async getByFamilyIdAndLogin(pool: MyPool, login: String, family_id: String): Promise<Task> {

		const result = await pool.query("SELECT * FROM Task WHERE login = ? AND family_id = ?;", [login, family_id]);
		if (result[0].length !== 1)
			return undefined;
		return Task.materialize(result[0][0]);
	}

	static async create(pool: MyPool, task: Task): Promise<Task> {

		const result = await pool.query(
			`INSERT INTO task_list( family_id, user_id, children_list, title,
			description, reward, start_date, end_date, created_at ) 
			VALUES (?,?,?,?,?,?,?,?,NOW());`,
			[task.family_id, task.user_id, JSON.stringify(task.children_list), task.title,
			task.description, task.reward, formatDate(task.start_date), formatDate(task.end_date)]
		)
		return { ...task, id: result[0].insertId.toString() };
	}

	static async archive(pool: MyPool, id: string): Promise<any> {
		const result = await pool.query(`UPDATE TASK_LIST SET archive = 1 WHERE id = ?;`, [id])
		return result;
	}

	private static materialize(row: any): Task {
		return {
			id: row.id,
			family_id: row.family_id,
			user_id: row.user_id,
			children_list: JSON.parse(row.children_list),
			reward: row.reward,
			title: row.title,
			description: row.description,
			start_date: row.start_date,
			end_date: row.end_date
		};
	}
}
