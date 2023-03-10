import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { Db } from "../common/db";
import { DomainError } from "../common/errors";
import { User } from "../models/user";

export function loginRouter(db: Db): Router {

	const router = express.Router();

	router.post("/login", expressAsyncHandler(async (req, res) => {

		const body: {
			email: string;
			password: string;
		} = req.body;

		const user = await User.getByEmail(db, body.email);
		if (!user || user.password !== body.password)
			throw new DomainError(`Invalid email or password.`);

		const session = "xyz"; // TODO: create session
		res.json({
			session: session,
			user: {
				firstName: user.firstName,
				lastName: user.lastName,
			}
		});
	}));

	return router;
}