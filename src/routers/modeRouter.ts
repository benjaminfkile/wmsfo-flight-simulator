import express from "express";
import { mode } from "../db/mode";

const modeRouter = express.Router();

modeRouter.get("/", async (_req, res) => {
  try {
    const fetchedMode = await mode.getMode();
    res.json({ mode: fetchedMode });
  } catch (err) {
    console.error("[ModeRouter] Failed to get mode:", err);
    res.status(500).json({ error: "Failed to get mode" });
  }
});

modeRouter.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const newMode = Number(req.body.mode);
    await mode.setMode(newMode);
    res.json({ success: true, mode: newMode });
  } catch (err: any) {
    console.error("[ModeRouter] Failed to set mode:", err);
    res.status(400).json({ error: err.message });
  }
});

export default modeRouter;
