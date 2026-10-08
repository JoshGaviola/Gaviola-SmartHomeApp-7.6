import cors from "cors";
import "dotenv/config";
import express from "express";
import deviceRoute from "./routes/deviceRoute.js";
import gatewayRoute from "./routes/gatewayRoute.js";
import sensorRoute from "./routes/sensorRoute.js";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/devices", deviceRoute);
app.use("/api/gateway", gatewayRoute);
app.use("/api/sensors", sensorRoute);

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: "Internal server error." });
});

app.listen(port, () => {
  console.log(`Smart home backend listening on port ${port}`);
});
