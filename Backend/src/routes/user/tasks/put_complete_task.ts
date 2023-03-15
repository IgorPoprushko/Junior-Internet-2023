//#region Inports
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { DomainError } from "../../../common/errors";
import { MyPool } from "../../../common/my_pool";
import { UserTask } from "../../../models/user_task";
//#endregion

export function putCompleteTaskRouter(pool: MyPool): Router {

	const router = express.Router();

	router.put("/complete", expressAsyncHandler(async (req, res) => {

		const body: {
			completed_task_id: string;
		} = req.body;

		if (isNaN(Number(body.completed_task_id)) || !body.completed_task_id)
			throw new DomainError("Invalid task id");

		const result = await UserTask.send_complete(pool, req.session.user.id, body.completed_task_id);
		if (!result)
			throw new DomainError("Oops!");

		res.status(200).json({ message: "Success!" });
	}));

	return router;
}