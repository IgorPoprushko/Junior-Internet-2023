import express from "express";
import { createPool } from "mysql";
import { Db } from "./common/db";
import { DomainError } from "./common/errors";
import { loginRouter } from "./routes/login";
import { registerRouter } from "./routes/register";

const app = express();
const port = +process.env.HTTP_PORT || 3000;
const db = new Db(createPool(process.env.DB_CONNECTION));

app.use(express.json());

app.use("/api/user",
	loginRouter(db),
	registerRouter(db),
);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
	let status = 500;
	let errMessage = err.message ?? "internal server error";
	if (err instanceof DomainError) {
		status = 400;
		errMessage = err.message || errMessage;
	}
	res.status(status);
	res.json({ message: errMessage });
});

app.listen(port, () => {
	console.log(`Backend listening on port ${port}`);
});