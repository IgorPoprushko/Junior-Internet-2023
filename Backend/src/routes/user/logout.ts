//#region Inports {#309,3}
import express, { Router } from "express";
import expressAsyncHandler from "express-async-handler";
//#endregion

export function logoutRouter(): Router {

    const router = express.Router();

    router.post("/logout", expressAsyncHandler(async (req, res) => {

        req.session.destroy((error) => {
            if (error != undefined)
                res.status(400).json({ message: "Logout failed" });
            else
                res.status(200).json({ message: "Success!" });
        });
    }));

    return router;

}