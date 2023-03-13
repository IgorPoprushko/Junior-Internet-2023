//#region Inports
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import { DomainError } from "../../common/errors";
import { MyPool } from "../../common/my_pool"
import { Role } from "../../models/user";
import { createTaskRouter } from "./create_task";
import { createUserRouter } from "./create_user";
//#endregion

export function mainParentRouter(pool: MyPool): Router {

	const router = express.Router();

	router.use("/", expressAsyncHandler(async (req, res, next) => {
		if (req.session.isLogined == true && req.session.user.role == Role.Parent)
			next();
		else
			throw new DomainError("No token provided!", 403);
	}));

	router.use("/", [createUserRouter(pool), createTaskRouter(pool)]);

	return router;
}