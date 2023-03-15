//#region Inports
import express, { Router } from "express";
import { MyPool } from "../../../common/my_pool"
import { getExpenses } from "./get_expenses";
import { postExpenseRouter } from "./post_expense";
//#endregion

export function userExpensesRouter(pool: MyPool): Router {

	const router = express.Router();

	router.use("/", [getExpenses(pool), postExpenseRouter(pool)]);

	return router;
}