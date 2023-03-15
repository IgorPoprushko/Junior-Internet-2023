//#region Inports
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { MyPool } from "../../../common/my_pool";
import { Task } from "../../../models/task";
//#endregion

export function getAllFamilyTaskRouter(pool: MyPool): Router {

	const router = express.Router();

	router.get("/all", expressAsyncHandler(async (req, res) => {

		const result = await Task.get_all_tasks_by_family_id(pool, req.session.user.familyId);
		if (!result)
			res.status(200).json({ tasks: {} });
		else
			res.status(200).json({ tasks: result });

	}));

	return router;
}

