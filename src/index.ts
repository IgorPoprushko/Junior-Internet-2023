//#region Import {#309, 4}}
import express from "express";
import { createPool } from "mysql2/promise";
import Session from "express-session";
// Common Imports {#929,3}
import { DomainError } from "./common/errors";
import { MyPool } from "./common/my_pool";
// Import Routes {#760,6}
import { loginRouter } from "./routes/user/login";
import { logoutRouter } from "./routes/user/logout";
import { registerRouter } from "./routes/user/register";
import { mainChildRouter } from "./routes/child/_child";
import { mainParentRouter } from "./routes/parent/_parent";
//#endregion

//#region Init {#322,4}
const app = express();
const pool = new MyPool(createPool(JSON.parse(process.env.DB_CONNECTION)));
const port = Number(process.env.HTTP_PORT);
//#endregion

//#region Middleware
app.use(express.json());
// app.use(formidableMiddleware());  uninstall
app.use(Session({ secret: "14.1", }));
//#endregion

//#region Routes {#aaa,4}
app.use("/api/user", [loginRouter(pool), registerRouter(pool), logoutRouter()]);
app.use("/api/child", mainChildRouter(pool));
app.use("/api/parent", mainParentRouter(pool));
//#endregion

// ErrorHandler {#029,10}
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

app.listen(port, () => { console.log(`Backend listening on port ${port}`); });