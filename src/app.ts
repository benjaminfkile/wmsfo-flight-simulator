import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import locationRouter from "./routers/locationRouter";
import modeRouter from "./routers/modeRouter";
import { isLocal } from "./utils/isLocal";

const app: Express = express();
app.use(express.json());

if (isLocal()) {
  app.use(morgan("dev"));
  app.use(cors());
}

app.use("/", locationRouter);
app.use("/mode", modeRouter);

app.use(function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render("error", { error: err });
});

export default app;
