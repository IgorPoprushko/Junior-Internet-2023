//#region Inports
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { DomainError } from "../../common/errors";
import { MyPool } from "../../common/my_pool";
import { Task } from "../../models/task";
import { User } from "../../models/user";
//#endregion

export function createTaskRouter(pool: MyPool): Router {

	const router = express.Router();

	router.post("/create_task", expressAsyncHandler(async (req, res) => {
		const body: {
			children_list: string | number[];
			reward: number;
			title: string;
			description: string;
			start_date: Date;
			end_date: Date;
		} = req.body;

		try {
			body.children_list = body.children_list.toString().replaceAll(" ", "").replaceAll("{", "").replaceAll("}", "").split(",").map((id: string) => {
				if (isNaN(Number(id)))
					throw new DomainError("Invalid value(s)");
				return Number(id);
			});
			console.log(typeof body.children_list);
		} catch (e) {
			console.log("Error " + e);
			throw new DomainError("Invalid child list type");
		}

		if (!body.children_list || !body.reward || !body.title || !body.description || !body.start_date || !body.end_date)
			throw new DomainError(`Invalid value(s)`);

		if (isNaN(Number(body.reward)))
			throw new DomainError("Invalid reward type");

		if (isNaN(Date.parse(body.start_date.toString())) || isNaN(Date.parse(body.end_date.toString())))
			throw new DomainError("Unreadable date format.");

		body.start_date = new Date(Date.parse(body.start_date.toString()));
		body.end_date = new Date(Date.parse(body.end_date.toString()));

		const id_list = await User.get_count_by_ids_family(pool, body.children_list, req.session.user.familyId);
		if (!id_list)
			throw new DomainError("Wrong child list.");
		// start/end date (time zones)

		const task = await Task.create(pool, {
			id: "0",
			user_id: req.session.user.id,
			family_id: req.session.user.familyId,
			children_list: body.children_list,
			reward: body.reward, title: body.title, description: body.description,
			start_date: body.start_date, end_date: body.end_date
		});
		if (!task)
			throw new DomainError("Oops!");

		// TODO: ???

		res.status(200).json({ message: "Success!" });
	}));

	return router;
}