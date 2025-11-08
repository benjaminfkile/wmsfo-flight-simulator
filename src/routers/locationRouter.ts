import express, { Request, Response } from "express";
import service from "../service";

const locationRouter = express.Router();

locationRouter.get("/", (req: Request, res: Response) => {
  res.json(service.getCurrentLocation());
});

locationRouter.post("/mode/:value", (req: Request, res: Response) => {
  const mode = parseInt(req.params.value, 10);
  service.setMode(mode);
  res.json({ success: true, mode });
});

export default locationRouter;
