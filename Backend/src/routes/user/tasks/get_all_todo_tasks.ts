//#region Inports
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { DomainError } from "../../../common/errors";
import { MyPool } from "../../../common/my_pool";
import { Task } from "../../../models/task";
//#endregion

export function getAllTODOTaskRouter(pool: MyPool): Router {

	const router = express.Router();

	router.get("/all", expressAsyncHandler(async (req, res) => {

		const result = await Task.get_all_todo_tasks_to_child(pool, req.session.user.familyId, req.session.user.id);
		if (!result)
			res.status(200).json({ tasks: {} });
		else
			res.status(200).json({ tasks: result });

	}));

	return router;
}

