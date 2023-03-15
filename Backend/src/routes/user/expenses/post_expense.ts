//#region Inports
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { DomainError } from "../../../common/errors";
import { MyPool } from "../../../common/my_pool";
import { Expense } from "../../../models/expense";
//#endregion

export function postExpenseRouter(pool: MyPool): Router {

	const router = express.Router();
	router.post("/add", expressAsyncHandler(async (req, res) => {

		const body: {
			title: string;
			category: string;
			amount: number;
		} = req.body;

		//#region Validate {#985,7}
		if (!body.category || !body.amount || !body.title)
			throw new DomainError(`Invalid value(s)`);

		if (isNaN(Number(body.amount)))
			throw new DomainError("Invalid value(s)");

		const expese = await Expense.create(pool, { id: "0", child_id: req.session.user.id, title: body.title, category: body.category, amount: Math.abs(body.amount), created_at: new Date(Date.now()) })
		if (!expese)
			throw new DomainError("Oops!");;

		// TODO: BALANCE_CHANGE

		res.status(200).json({ message: "Success!" });

	}));

	return router;
}