//#region Inports
import express, { Router } from "express";
import { MyPool } from "../../../common/my_pool"
import { getAllUsersRouter } from "./get_all_users";
import { createUserRouter } from "./post_create_user";
//#endregion

export function familyMembersRouter(pool: MyPool): Router {

	const router = express.Router();

	router.use("/", [createUserRouter(pool), getAllUsersRouter(pool)]);

	return router;
}