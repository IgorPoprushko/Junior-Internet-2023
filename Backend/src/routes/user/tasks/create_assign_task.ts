//#region Inports
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { DomainError } from "../../../common/errors";
import { MyPool } from "../../../common/my_pool";
import { Task } from "../../../models/task";
import { UserTask } from "../../../models/user_task";
//#endregion

export function createAssignTaskRouter(pool: MyPool): Router {

	const router = express.Router();

	router.post("/assign/add", expressAsyncHandler(async (req, res) => {

		const body: {
			task_id: string;
		} = req.body;

		if (isNaN(Number(body.task_id)) || !body.task_id)
			throw new DomainError("Invalid task id");

		const able_to_assing = await Task.check_is_able_to_assign(pool, req.session.user.familyId, body.task_id);
		if (!able_to_assing)
			throw new DomainError("You can't assing this task.");

		const result = await UserTask.create(pool, req.session.user.familyId, req.session.user.id, body.task_id);
		if (!result)
			throw new DomainError("Assigning error");

		res.status(200).json({ message: "Success!" });
	}));

	return router;
}

