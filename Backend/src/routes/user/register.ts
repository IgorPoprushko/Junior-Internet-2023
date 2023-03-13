//#region Inports {#309,8}
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import { Role, User } from "../../models/user";
import { DomainError } from "../../common/errors";
import { MyPool } from "../../common/my_pool"
import { Family } from "../../models/family";
import { SendEmail } from "../../common/email_sender";
//#endregion
export function registerRouter(pool: MyPool): Router {

	const router = express.Router();

	router.post("/register", expressAsyncHandler(async (req, res) => {

		const body: {
			email: string;
			login: string;
			password: string;
			firstName: string;
			lastName: string;
		} = req.body;

		if (!body.email || !body.login || !body.password || !body.firstName || !body.lastName)
			throw new DomainError(`Invalid value(s)`);

		const existing = await Family.getByEmail(pool, body.email);
		if (!!existing)
			throw new DomainError(`Email taken.`);

		const family = await Family.create(pool, { id: "0", email: body.email, name: body.lastName });
		if (!family)
			throw new DomainError(`Ooops!`);

		const user = await User.create(pool, { id: "0", login: body.login, password: body.password, familyId: family.id, role: Role.Parent, firstName: body.firstName, lastName: body.lastName, balance: 0 });
		if (!user)
			throw new DomainError(`Ooops!`);

		await SendEmail(family.email, family.id);

		res.status(200).json({ message: "Success!" });

	}));

	return router;
}