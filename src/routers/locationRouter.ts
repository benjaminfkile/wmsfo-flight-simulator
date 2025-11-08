import express, { Request, Response } from "express";
import service from "../service";

const locationRouter = express.Router();

locationRouter.get("/", (req: Request, res: Response) => {
  res.json(service.getCurrentLocation());
});

export default locationRouter;
