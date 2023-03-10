import { randomUUID } from "crypto";
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { Db } from "../common/db";
import { DomainError } from "../common/errors";
import { Family } from "../models/family";
import { User } from "../models/user";

export function registerRouter(db: Db): Router {

	const router = express.Router();

	router.post("/register", expressAsyncHandler(async (req, res) => {

		const body: {
			email: string;
			password: string;
			firstName: string;
			lastName: string;
		} = req.body;

		const existing = await User.getByEmail(db, body.email);
		if (existing)
			throw new DomainError(`Email taken.`);

		const family = await Family.create(db, {
			id: randomUUID(),
		});

		const user = await User.create(db, {
			id: randomUUID(),
			familyId: family.id,
			role: 123,
			email: body.email,
			password: User.hashPassword(body.password),
			firstName: body.firstName,
			lastName: body.lastName,
		});

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