//#region Inports
import { Console } from "console";
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { DomainError } from "../../common/errors";
import { MyPool } from "../../common/my_pool";
import { Role, User } from "../../models/user";
//#endregion
export function createUserRouter(pool: MyPool): Router {

	const router = express.Router();

	router.post("/create_user", expressAsyncHandler(async (req, res) => {
		const body: {
			login: string;
			password: string;
			firstName: string;
			lastName: string;
			role: number;
		} = req.body;

		if (!body.role || !body.login || !body.password || !body.firstName || !body.lastName)
			throw new DomainError(`Invalid value(s)`);

		if (!Role[Number(body.role)])
			body.role = Role.Child;

		const existing = await User.get_by_login_family(pool, body.login, req.session.user.familyId);
		if (!!existing)
			throw new DomainError("Login is alredy used in your family.");

		const new_user = await User.create(pool, { id: "0", familyId: req.session.user.familyId, login: body.login, password: body.password, role: body.role, firstName: body.firstName, lastName: body.lastName, balance: 0 });
		if (!new_user)
			throw new DomainError("Oops!");

		res.status(200).json({ message: "Success!" });
	}));

	return router;
}