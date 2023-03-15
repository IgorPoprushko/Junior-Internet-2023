//#region Inports
import express, { Router } from "express";
import { MyPool } from "../../../common/my_pool"
import { getBalance } from "./get_balance";
import { getBalanceLog } from "./get_balance_log";
//#endregion

export function userWalletRouter(pool: MyPool): Router {

	const router = express.Router();

	router.use("/", [getBalance(pool), getBalanceLog(pool)]);

	return router;
}