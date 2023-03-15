//#region Inports
import express, { Router } from "express";
import { MyPool } from "../../common/my_pool"
import { familyMembersRouter } from "./members/_family_members_router";
import { familyTasksRouter } from "./tasks/_family_tasks_router";
//#endregion

export function familyRouter(pool: MyPool): Router {

	const router = express.Router();

	router.use("/tasks", familyTasksRouter(pool));
	router.use("/members", familyMembersRouter(pool));

	return router;
}