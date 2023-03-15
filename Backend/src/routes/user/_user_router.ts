//#region Inports
import express, { Router } from "express";
import { MyPool } from "../../common/my_pool"
import { userWalletRouter } from "./balance/_user_wallet_router";
import { userExpensesRouter } from "./expenses/_user_expenses_router";
import { loginRouter } from "./login";
import { logoutRouter } from "./logout";
import { userProfileRouter } from "./profile/_profile_router";
import { registerRouter } from "./register";
import { userTasksRouter } from "./tasks/_user_tasks_router";
//#endregion

export function userRouter(pool: MyPool): Router {

	const router = express.Router();

	router.use("/", [loginRouter(pool), registerRouter(pool), logoutRouter()]);
	router.use("/tasks", userTasksRouter(pool));
	router.use("/profile", userProfileRouter(pool));
	router.use("/expenses", userExpensesRouter(pool));
	router.use("/wallet", userWalletRouter(pool));

	return router;
}