
import { Pool } from "mysql";

export class Db {

	constructor(private readonly pool: Pool) { }

	query(sql: string, params?: any[]): Promise<any[] & Db.QueryResult> {
		return new Promise<any[] & Db.QueryResult>((resolve, reject) => {
			this.pool.query(sql, params, (err, rows) => {
				if (err)
					return reject(err);
				resolve(rows);
			});
		});
	}
}
export namespace Db {
	export interface QueryResult {
		insertId: number;
		affectedRows: number;
		changedRows: number;
	}
}