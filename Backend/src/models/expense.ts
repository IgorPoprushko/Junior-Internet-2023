import { MyPool } from "../common/my_pool";

export class Expense {
	readonly id: string;
	readonly child_id: string;
	readonly category: string;
	readonly amount: number;
	readonly created_at: string;

	static async getByUser(pool: MyPool, userID: string): Promise<Expense[]> {

		const q_result = await pool.query("SELECT * FROM EXPENSES WHERE child_id = ?;", [userID]);

		if (q_result[0].length < 1)
			return undefined;

		let result: Array<Expense> = q_result[0].map((row) => Expense.materialize(row))

		return result;
	}

	static async create(pool: MyPool, expense: Expense): Promise<Expense> {
		const result = await pool.query(`INSERT INTO expenses ( child_id, category, amount, created_at ) 
		VALUES (?,?,?,NOW());`, [expense.child_id, expense.category, expense.amount]);
		return { ...expense, id: result[0].insertId.toString() };
	}

	static async archive(pool: MyPool, id: string): Promise<any[]> {
		const result = await pool.query("UPDATE EXPENSES SET archive = 1 WHERE id = ?;", [id]);
		return result;
	}

	private static materialize(row: any): Expense {
		return {
			id: row.id,
			child_id: row.child_id,
			category: row.category,
			amount: row.amount,
			created_at: row.created_at,
		};
	}
}