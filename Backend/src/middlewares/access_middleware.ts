import express from "express";
import { DomainError } from "../common/errors";
import { Role } from "../models/user";
import { AllRouters } from "../routes/routes_list";

interface AccessControlOptions {
	isLogined: true,
	role?: Role.Parent
}

function AccessControlFilter(url: string) {
	if (AllRouters.noAccessControle.includes(url))
		return ({ isLogined: false });
	else if (AllRouters.child.includes(url))
		return ({ isLogined: true, role: Role.Child });
	else if (AllRouters.parent.includes(url))
		return ({ isLogined: true, role: Role.Parent });
	else
		return ({ isLogined: true });
}
export function mainAccessControl(options?: AccessControlOptions) {
	return function (req: express.Request, res: express.Response, next: express.NextFunction) {
		console.log(req.url);
		let my_options = (options == undefined) ? AccessControlFilter(req.url) as AccessControlOptions : options;

		if (!my_options.isLogined || ((my_options.isLogined == req.session.isLogined)
			&& (!my_options.role || (my_options.role == req.session.user.role))))
			next();
		else
			throw new DomainError("You have no access to this page", 403);
	}

}