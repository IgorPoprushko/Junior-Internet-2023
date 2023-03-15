//#region Inports
import express, { Router } from "express";
import { MyPool } from "../../../common/my_pool"
import { getAllFamilyTaskRouter } from "./get_all_tasks";
import { createTaskRouter } from "./create_task";
import { getAllPendingTasksRouter } from "./get_all_pending_tasks";
import { putValidateTaskRouter } from "./put_validate_task";
//#endregion

export function familyTasksRouter(pool: MyPool): Router {

	const router = express.Router();

	router.use("/", [createTaskRouter(pool), getAllFamilyTaskRouter(pool), getAllPendingTasksRouter(pool), putValidateTaskRouter(pool)]);

	return router;
}