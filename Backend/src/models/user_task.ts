import { MyPool } from "../common/my_pool";

export class UserTask {
	readonly id: string;
	readonly family_id: string;
	readonly task_id: string;
	readonly child_id: string;
	readonly task_end_date: string;
	readonly child_confirm: boolean;
	readonly parent_confirm: boolean;
	readonly assign_date: Date;
	readonly complete_date: Date | null;
	readonly confirm_date: Date | null;
	readonly reject_message: String | null
	readonly status?: String | null


	static async check_is_able_to_validate(pool: MyPool, family_id: String, id: string): Promise<boolean> {

		const q_result = await pool.query(`SELECT * FROM USER_TASKS WHERE id = ? AND family_id = ? AND child_confirm = 1 AND parent_confirm = 0;`, [id, family_id]);
		return q_result[0].length == 1;
	}

	static async get_all_pending_tasks_by_family_id(pool: MyPool, family_id: String): Promise<UserTask[]> {

		const q_result = await pool.query(`SELECT * FROM USER_TASKS WHERE family_id = ? AND child_confirm = 1 AND parent_confirm = 0;`, [family_id]);
		if (q_result[0].length == 0)
			return undefined;
		let result: Array<UserTask> = q_result[0].map((row) => UserTask.materialize(row))

		return result;
	}

	static async get_all_assigned_by_user(pool: MyPool, userID: string): Promise<UserTask[]> {

		const q_result = await pool.query(`SELECT *,IF(end_task_date < NOW(),IF(parent_confirm,"Completed","Expired"),IF(parent_confirm,"Completed",IF(child_confirm,"Pending","InProgress")) as "status" FROM USER_TASKS WHERE child_id = ?`, [userID]);

		if (q_result[0].length < 1)
			return undefined;

		let result: Array<UserTask> = q_result[0].map((row) => UserTask.materialize(row))

		return result;
	}

	static async create(pool: MyPool, family_id: string, child_id: string, task_id: string): Promise<boolean> {
		const result = await pool.query(`INSERT INTO USER_TASKS (family_id, child_id, task_id, end_task_date) 
		SELECT ?, ?, ?, tl.end_date  FROM task_list tl WHERE tl.id = ?;`, [family_id, child_id, task_id, task_id]);
		return result[0].affectedRows == 1;
	}

	static async send_complete(pool: MyPool, user_id: string, task_id: string): Promise<boolean> {
		const result = await pool.query("UPDATE USER_TASKS SET complete_date = NOW(), child_confirm = 1 WHERE child_id = ? AND task_id = ? AND child_confirm = 0;", [user_id, task_id]);
		return result[0].affectedRows == 1;
	}

	static async validate(pool: MyPool, user_task_id: string, parent_confirm: boolean, reject_message: string | null): Promise<boolean> {
		const result = await pool.query(`UPDATE USER_TASKS SET child_confirm=IF(? = 0,0,child_confirm), parent_confirm = ?,verify_date = NOW(), reject_message=?
		WHERE id = ?;`, [parent_confirm, parent_confirm, reject_message, user_task_id]);
		return result[0].affectedRows == 1;
	}

	private static materialize(row: any): UserTask {
		return {
			id: row.id,
			family_id: row.family_id,
			task_id: row.task_id,
			child_id: row.child_id,
			task_end_date: row.task_end_date,
			child_confirm: row.child_confirm,
			parent_confirm: row.parent_confirm,
			assign_date: row.assign_date,
			complete_date: row.complete_date,
			confirm_date: row.confirm,
			reject_message: row.reject_message,
			status: row.status,
		};
	}
}
/*

   assign |child | parent       end_date > date   |  end_date < date
__________|______|________________________________|_________________
		1 |  1   |  1               Complite      |    	Complite		
		1 |  1   |  0               Pending       |     Pending
		1 |  0   |  -               InProgress    |     Expired
		1 |  0   |  -               InProgress    |     Expired
		0 |  -   |  -               TODO          |     Expired
		0 |  -   |  -               TODO          |     Expired
		0 |  -   |  -               TODO      	  |     Expired
		0 |  -   |  -               TODO   		  |     Expired
*/