//#region Import {#309, 4}}
import express from "express";
import { createPool } from "mysql2/promise";
import Session from "express-session";
// Common Imports {#929,3}
import { DomainError } from "./common/errors";
import { MyPool } from "./common/my_pool";
import { mainAccessControl } from "./middlewares/access_middleware";
import { familyRouter } from "./routes/family/_family_router";
import { userRouter } from "./routes/user/_user_router";
import expressAsyncHandler from "express-async-handler";
// Import Routes {#760,6}

//#endregion

const app = express();
const pool = new MyPool(createPool(JSON.parse(process.env.DB_CONNECTION)));
const port = Number(process.env.HTTP_PORT);

app.use(express.json());
app.use(Session({ secret: "14.1", }));

app.use("/api", mainAccessControl());
app.use("/api/user", userRouter(pool));
app.use("/api/family", familyRouter(pool));

app.all("*", expressAsyncHandler((req, res) => {
	throw new DomainError("404", 404);
}));

// ErrorHandler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
	let status = 500;
	let errMessage = err.message ?? "internal server error";
	if (err instanceof DomainError) {
		status = err.status ?? 400;
		errMessage = err.message || errMessage;
	}
	res.status(status);
	res.json({ message: errMessage });
});

app.listen(port, () => { console.log(`Server is running on port ${port}`); console.log(`Backend listening on port ${port}`); });