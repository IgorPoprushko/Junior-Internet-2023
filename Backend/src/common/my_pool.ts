
import { Pool, RowDataPacket, OkPacket, ResultSetHeader, FieldPacket } from "mysql2/promise";
import { DomainError } from "./errors";

export class MyPool {

	constructor(private readonly pool: Pool) { }

	query(sql: string, params?: any[]): Promise<[RowDataPacket[][] & RowDataPacket[] & OkPacket & OkPacket[] & ResultSetHeader, FieldPacket[]]> {
		return this.pool.query<RowDataPacket[][] & RowDataPacket[] & OkPacket & OkPacket[] & ResultSetHeader>(sql, params).catch((e) => {
			console.log(`Error: ${e.message}`);
			throw new DomainError("Something wrong.");
		});
	};
}