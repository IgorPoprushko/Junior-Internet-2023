//#region Inports
import express, { Router } from "express";
import { MyPool } from "../../../common/my_pool"
import { createAssignTaskRouter } from "./create_assign_task";
import { getAllAssignedTasksRouter } from "./get_all_assigned_tasks";
import { getAllTODOTaskRouter } from "./get_all_todo_tasks";
import { putCompleteTaskRouter } from "./put_complete_task";
//#endregion

export function userTasksRouter(pool: MyPool): Router {

	const router = express.Router();

	router.use("/", [getAllTODOTaskRouter(pool), getAllAssignedTasksRouter(pool),
	createAssignTaskRouter(pool), putCompleteTaskRouter(pool)]);

	return router;
}