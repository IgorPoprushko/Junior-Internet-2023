//#region Inports
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { DomainError } from "../../../common/errors";
import { MyPool } from "../../../common/my_pool";
import { UserTask } from "../../../models/user_task";
//#endregion

export function getAllPendingTasksRouter(pool: MyPool): Router {

	const router = express.Router();

	router.get("/pending", expressAsyncHandler(async (req, res) => {

		const result = await UserTask.get_all_pending_tasks_by_family_id(pool, req.session.user.familyId);
		if (!result)
			res.status(200).json({ tasks: {} });
		else
			res.status(200).json({ tasks: result });

	}));

	return router;
}

