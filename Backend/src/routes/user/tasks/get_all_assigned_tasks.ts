//#region Inports
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { DomainError } from "../../../common/errors";
import { MyPool } from "../../../common/my_pool";
import { Role, User } from "../../../models/user";
import { UserTask } from "../../../models/user_task";
//#endregion

export function getAllAssignedTasksRouter(pool: MyPool): Router {

	const router = express.Router();

	router.get(["/assign/all", "/assign/all/:child_id"], expressAsyncHandler(async (req, res) => {

		let result_child_id: string;

		if (req.session.user.role == Role.Child) {
			result_child_id = req.session.user.id;
		} else {
			const child_id = req.params.child_id;
			if (!child_id || isNaN(Number(child_id)))
				throw new DomainError(`Invalid value(s)`);
			const id_list = await User.get_by_id_and_family_id(pool, child_id, req.session.user.familyId);
			if (!id_list)
				throw new DomainError("Wrong child id.");
			result_child_id = child_id.toString();
		}

		const assigned_tasks = await UserTask.get_all_assigned_by_user(pool, result_child_id);
		if (!assigned_tasks)
			res.status(200).json({ tasks: {} });
		else
			res.status(200).json({ tasks: assigned_tasks });
	}));

	return router;
}