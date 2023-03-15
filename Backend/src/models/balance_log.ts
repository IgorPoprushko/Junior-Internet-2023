import { MyPool } from "../common/my_pool";

export class BalanceLog {
	readonly id: string;
	readonly user_id: string;
	readonly task_id: string | null;
	readonly user_task_id: string | null;
	readonly expense_id: string | null;
	readonly value: number;
	readonly balance: number;
	readonly comment: String | null;



	static async get_all_by_user_id(pool: MyPool, userID: string): Promise<BalanceLog[]> {

		const q_result = await pool.query("SELECT * FROM BALANCE_LOG WHERE user_id = ?;", [userID]);

		if (q_result[0].length < 1)
			return undefined;

		let result: Array<BalanceLog> = q_result[0].map((row) => BalanceLog.materialize(row))

		return result;
	}

	private static materialize(row: any): BalanceLog {
		return {
			id: row.id,
			user_id: row.user_id,
			task_id: row.task_id,
			user_task_id: row.user_task_id,
			expense_id: row.expense_id,
			value: row.value,
			balance: row.balance,
			comment: row.comment,
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