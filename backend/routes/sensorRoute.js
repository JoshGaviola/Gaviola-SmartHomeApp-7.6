import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.get("/latest", async (_request, response) => {
  try {
    const [rows] = await db.query(
      `SELECT temperature, humidity, light_level AS lightLevel
       FROM sensor_readings
       ORDER BY recorded_at DESC, id DESC
       LIMIT 1`,
    );

    if (rows.length === 0) {
      response
        .status(404)
        .json({ message: "No sensor readings are available." });
      return;
    }

    const reading = rows[0];
    response.json({
      temperature: Number(reading.temperature),
      humidity: Number(reading.humidity),
      lightLevel: Number(reading.lightLevel),
    });
  } catch (error) {
    console.error("Error fetching sensors:", error);
    response.status(500).json({ message: "Unable to retrieve sensor data." });
  }
});

export default router;
