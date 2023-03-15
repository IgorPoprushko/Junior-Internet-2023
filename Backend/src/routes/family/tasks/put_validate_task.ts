//#region Inports
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { DomainError } from "../../../common/errors";
import { MyPool } from "../../../common/my_pool";
import { UserTask } from "../../../models/user_task";
//#endregion

export function putValidateTaskRouter(pool: MyPool): Router {

	const router = express.Router();

	router.put("/validate", expressAsyncHandler(async (req, res) => {

		const body: {
			user_task_id: string;
			validate_status: boolean;
			reject_message: string | null;
		} = req.body;

		if (!body.user_task_id || isNaN(Number(body.user_task_id)))
			throw new DomainError("Invalid task id");
		if (body.validate_status == undefined)
			throw new DomainError("Invalid validate status");

		body.validate_status = (String(body.validate_status) === "true") || (String(body.validate_status) === "1");

		const able_to_validate = UserTask.check_is_able_to_validate(pool, req.session.user.familyId, body.user_task_id);
		if (!able_to_validate)
			throw new DomainError("You can't validate this task.");

		const result = await UserTask.validate(pool, body.user_task_id, body.validate_status, (body.validate_status) ? null : body.reject_message);
		if (!result)
			throw new DomainError("Oops!");

		res.status(200).json({ message: "Success!" });
	}));

	return router;
}