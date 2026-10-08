import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.get("/health", async (_request, response) => {
  try {
    await db.query("SELECT 1");
    response.json({ status: "ok", connected: true });
  } catch (error) {
    console.error("Gateway health check failed:", error);
    response.status(503).json({ status: "unavailable", connected: false });
  }
});

export default router;
