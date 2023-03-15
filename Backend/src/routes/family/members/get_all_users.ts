//#region Inports
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { DomainError } from "../../../common/errors";
import { MyPool } from "../../../common/my_pool";
import { Role, User } from "../../../models/user";
//#endregion
export function getAllUsersRouter(pool: MyPool): Router {

	const router = express.Router();

	router.get("/all", expressAsyncHandler(async (req, res) => {

		const all_users = await User.get_all_by_family_id(pool, req.session.user.familyId, req.session.user.id);
		if (!all_users)
			res.status(200).json({ users: {} });
		else
			res.status(200).json({ users: all_users });
	}));

	return router;
}