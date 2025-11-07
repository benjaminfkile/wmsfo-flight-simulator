import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import locationRouter from "./routers/locationRouter";
//import helmet from "helmet";

const app: Express = express();

//app.use(morgan("tiny"));

app.use("/", locationRouter);

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
