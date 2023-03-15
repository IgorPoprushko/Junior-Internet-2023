import { formatDate } from "../common/date";
import { MyPool } from "../common/my_pool";

export class Task {
	readonly id: string;
	readonly family_id: string;
	readonly user_id: string;
	readonly is_mono: boolean;
	readonly children_list: number[] | null; // not implemented in buisnes logic
	readonly reward: number;
	readonly title: string;
	readonly description: string;
	readonly start_date: Date;
	readonly end_date: Date;
	readonly created_at: Date;
	readonly status?: String;


	static async get_all_todo_tasks_to_child(pool: MyPool, family_id: String, child_id: string): Promise<Task[]> {

		const q_result = await pool.query(`SELECT a.*, "TODO" as "status" FROM TASK_LIST a
		LEFT JOIN USER_TASKS b 
		ON a.id = b.task_id AND (a.is_mono = TRUE OR b.child_id = ?)
		WHERE b.task_id IS NULL AND a.family_id = ? AND a.start_date < NOW() AND a.end_date > NOW()`, [child_id, family_id]);
		if (q_result[0].length == 0)
			return undefined;
		let result: Array<Task> = q_result[0].map((row) => Task.materialize(row))

		return result;
	}

	static async check_is_able_to_assign(pool: MyPool, family_id: String, task_id: string): Promise<boolean> {

		const q_result = await pool.query(`SELECT a.* FROM TASK_LIST a
		LEFT JOIN USER_TASKS b 
		ON a.id = b.task_id AND a.is_mono = TRUE
		WHERE b.task_id IS NULL AND a.family_id = ? AND a.id = ?;`, [family_id, task_id]);
		if (q_result[0].length !== 1)
			return false;
		return true;
	}

	static async get_all_tasks_by_family_id(pool: MyPool, family_id: String): Promise<Task[]> {

		const q_result = await pool.query(`SELECT *,  IF(end_date<NOW(), "archive", IF(start_date>NOW(),"wait to start","active")) as "status"  FROM TASK_LIST WHERE family_id = ?;`, [family_id]);
		if (q_result[0].length == 0)
			return undefined;
		let result: Array<Task> = q_result[0].map((row) => Task.materialize(row))

		return result;
	}

	static async create(pool: MyPool, task: Task): Promise<Task> {

		const result = await pool.query(
			`INSERT INTO task_list( family_id, user_id,is_mono, title,
			description, reward, start_date, end_date) 
			VALUES (?,?,?,?,?,?,?,?);`,
			[task.family_id, task.user_id, task.is_mono, task.title,
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
			is_mono: row.is_mono,
			reward: row.reward,
			title: row.title,
			description: row.description,
			start_date: row.start_date,
			end_date: row.end_date,
			created_at: row.created_at,
			children_list: row.children_list,
			status: row.status,
		};
	}
}