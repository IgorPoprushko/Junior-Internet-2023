//#region Inports {#309,5}
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import { DomainError } from "../../common/errors";
import { MyPool } from "../../common/my_pool"
import { Role } from "../../models/user";
import { addTaskRouter } from "./add_expense";
//#endregion

export function mainChildRouter(pool: MyPool): Router {

	const router = express.Router();

	router.use("/", expressAsyncHandler(async (req, res, next) => {
		if (req.session.isLogined == true && req.session.user.role == Role.Child)
			next();
		else
			throw new DomainError("No token provided!", 403);
	}));

	router.use("/", [addTaskRouter(pool)]);

	return router;
}