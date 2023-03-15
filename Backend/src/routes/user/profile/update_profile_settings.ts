//#region Inports
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { DomainError } from "../../../common/errors";
import { MyPool } from "../../../common/my_pool";
import { Expense } from "../../../models/expense";
import { Role, User } from "../../../models/user";
//#endregion

export function updateProfileSettingsRouter(pool: MyPool): Router {

	const router = express.Router();

	router.put("/update", expressAsyncHandler(async (req, res) => {

		throw new DomainError("Not implemented.");
		return;
		let result_child_id: string;

		if (req.session.user.role == Role.Child) {
			result_child_id = req.session.user.id;
		} else {
			const body: {
				child_id: number;
			} = req.body;
			if (!body.child_id || isNaN(Number(body.child_id)))
				throw new DomainError(`Invalid value(s)`);
			const id_list = await User.get_count_by_ids_family(pool, [body.child_id], req.session.user.familyId);
			if (!id_list)
				throw new DomainError("Wrong child id.");
			result_child_id = body.child_id.toString();
		}
		const expenses = await Expense.get_by_user_id(pool, result_child_id);
		if (!expenses)
			res.status(200).json({ expenses: {} });

		res.status(200).json({ expenses: expenses });
	}));

	return router;
}