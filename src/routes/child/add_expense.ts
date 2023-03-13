//#region Inports
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { DomainError } from "../../common/errors";
import { MyPool } from "../../common/my_pool";
import { Expense } from "../../models/expense";
//#endregion

export function addTaskRouter(pool: MyPool): Router {

	const router = express.Router();
	router.post("/add_expense", expressAsyncHandler(async (req, res) => {

		const body: {
			category: string;
			amount: number;
		} = req.body;

		//#region Validate {#985,7}
		if (!body.category || !body.amount)
			throw new DomainError(`Invalid value(s)`);

		if (isNaN(Number(body.amount)))
			throw new DomainError("Invalid value(s)");

		const expese = await Expense.create(pool, { id: "0", child_id: req.session.user.id, category: body.category, amount: Math.abs(body.amount), created_at: "" })
		if (!expese)
			throw new DomainError("Oops!");;

		// TODO: BALANCE_CHANGE

		res.status(200).json({ message: "Success!" });

	}));

	return router;
}