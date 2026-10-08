import express from "express";
import { db } from "../db.js";

const router = express.Router();

async function readDevices() {
  const [rows] = await db.query(
    "SELECT id, name, type, icon, status FROM devices ORDER BY id",
  );

  return rows.map((device) => ({
    ...device,
    status: Boolean(device.status),
  }));
}

router.get("/", async (_request, response) => {
  try {
    response.json(await readDevices());
  } catch (error) {
    console.error("Error fetching devices:", error);
    response.status(500).json({ message: "Unable to retrieve devices." });
  }
});

router.patch("/:id/status", async (request, response) => {
  const id = Number(request.params.id);
  const { status } = request.body;

  if (!Number.isInteger(id) || typeof status !== "boolean") {
    response.status(400).json({
      message: "A numeric device id and boolean status are required.",
    });
    return;
  }

  try {
    const [result] = await db.query(
      "UPDATE devices SET status = ? WHERE id = ?",
      [status, id],
    );

    if (result.affectedRows === 0) {
      response.status(404).json({ message: "Device was not found." });
      return;
    }

    response.json(await readDevices());
  } catch (error) {
    console.error("Error updating device:", error);
    response.status(500).json({ message: "Unable to update device." });
  }
});

export default router;
