//#region Inports
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { DomainError } from "../../../common/errors";
import { MyPool } from "../../../common/my_pool";
import { Task } from "../../../models/task";
//#endregion

export function createTaskRouter(pool: MyPool): Router {

	const router = express.Router();

	router.post("/add", expressAsyncHandler(async (req, res) => {

		const body: {
			// children_list: string | number[];
			is_mono: boolean;
			reward: number;
			title: string;
			description: string;
			start_date: Date;
			end_date: Date;
		} = req.body;

		//#region Child_list
		// try {
		// 	body.children_list = body.children_list.toString().replaceAll(" ", "").replaceAll("{", "").replaceAll("}", "").split(",").map((id: string) => {
		// 		if (isNaN(Number(id)))
		// 			throw new DomainError("Invalid value(s)");
		// 		return Number(id);
		// 	});
		// 	console.log(typeof body.children_list);
		// } catch (e) {
		// 	console.log("Error " + e);
		// 	throw new DomainError("Invalid child list type");
		// }
		//#endregion

		// !body.children_list
		if (body.is_mono == undefined || !body.reward || !body.title || !body.description || !body.start_date || !body.end_date)
			throw new DomainError(`Invalid value(s)`);

		if (isNaN(Number(body.reward)))
			throw new DomainError("Invalid reward type");

		if (isNaN(Date.parse(body.start_date.toString())) || isNaN(Date.parse(body.end_date.toString())))
			throw new DomainError("Unreadable date format.");

		body.is_mono = (String(body.is_mono) === "true") || (String(body.is_mono) === "1");
		body.start_date = new Date(Date.parse(body.start_date.toString()));
		body.end_date = new Date(Date.parse(body.end_date.toString()));

		//#region Child_list
		// const id_list = await User.get_count_by_ids_family(pool, body.children_list, req.session.user.familyId);
		// if (!id_list)
		// 	throw new DomainError("Wrong child list.");
		//#endregion

		// start/end date (time zones)?

		const task = await Task.create(pool, {
			id: "0",
			user_id: req.session.user.id,
			family_id: req.session.user.familyId,
			is_mono: body.is_mono,
			children_list: null,
			reward: body.reward, title: body.title, description: body.description,
			start_date: body.start_date, end_date: body.end_date, created_at: new Date(Date.now())
		});
		if (!task)
			throw new DomainError("Oops!");

		// TODO: ???

		res.status(200).json({ message: "Success!" });
	}));

	return router;
}

