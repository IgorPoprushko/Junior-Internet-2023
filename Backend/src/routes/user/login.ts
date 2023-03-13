//#region Inports {#309,7}
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import { User } from "../../models/user";
import { DomainError } from "../../common/errors";
import { MyPool } from "../../common/my_pool"
//#endregion

export function loginRouter(pool: MyPool): Router {

	const router = express.Router();

	router.post("/login", expressAsyncHandler(async (req, res) => {
		if (req.session.isLogined == true) {
			res.status(200).json({ role: req.session.user.role });
			return;
		}

		const body: {
			family_id: string;
			login: string;
			password: string;
		} = req.body;

		//#region Validate {#985,7}
		if (!body.family_id || !body.login || !body.password)
			throw new DomainError(`Invalid value for login/password or family code`);

		const user = await User.get_by_login_family(pool, body.login, body.family_id);
		if (!user || user.password !== body.password)
			throw new DomainError(`Invalid login/password or family code.`);
		//#endregion

		req.session.user = user;
		req.session.isLogined = true;

		res.status(200).json({ role: req.session.user.role });

	}));

	return router;
}