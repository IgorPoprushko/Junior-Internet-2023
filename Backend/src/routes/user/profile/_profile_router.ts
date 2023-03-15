//#region Inports
import express, { Router } from "express";
import { MyPool } from "../../../common/my_pool"
// Routers
import { updateProfileSettingsRouter } from "./update_profile_settings";
import { uploadProfileImgRouter } from "./upload_profile_img copy";
//#endregion

export function userProfileRouter(pool: MyPool): Router {

	const router = express.Router();

	router.use("/", [updateProfileSettingsRouter(pool), uploadProfileImgRouter]);

	return router;
}