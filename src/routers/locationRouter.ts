import express, { Request, Response } from "express";
import { getCurrentLocation, setMode } from "../simulator";

const locationRouter = express.Router();

locationRouter.get("/", (req: Request, res: Response) => {
  res.json(getCurrentLocation());
});

locationRouter.post("/mode/:value", (req: Request, res: Response) => {
  const mode = parseInt(req.params.value, 10);
  setMode(mode);
  res.json({ success: true, mode });
});

export default locationRouter;
