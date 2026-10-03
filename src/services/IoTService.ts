import { apiConfig } from "../config";
import {
    sampleDevices,
    type Device,
    type SensorData,
} from "../models/IoTModels";

const REQUEST_DELAY = 500;
const FAILURE_RATE = 0.1;

let mockDevices = sampleDevices.map((device) => ({ ...device }));
let mockSensorData: SensorData = {
  temperature: 28,
  humidity: 65,
  lightLevel: 720,
};

export class IoTServiceError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "IoTServiceError";
  }
}

function delay(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function simulateFailure() {
  if (Math.random() < FAILURE_RATE) {
    throw new IoTServiceError("The IoT service is temporarily unavailable.");
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!apiConfig.baseUrl) {
    throw new IoTServiceError("Remote API is not configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    apiConfig.requestTimeoutMs,
  );

  try {
    const response = await fetch(`${apiConfig.baseUrl}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let message = `Request failed with status ${response.status}.`;

      try {
        const body = (await response.json()) as { message?: string };
        if (body.message) {
          message = body.message;
        }
      } catch {
        // Keep the status-based error when the backend has no JSON error body.
      }

      throw new IoTServiceError(message, response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof IoTServiceError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new IoTServiceError("The request timed out.");
    }

    throw new IoTServiceError("Unable to reach the IoT backend.");
  } finally {
    clearTimeout(timeout);
  }
}

function isDevice(value: unknown): value is Device {
  if (!value || typeof value !== "object") {
    return false;
  }

  const device = value as Partial<Device>;
  return (
    typeof device.id === "number" &&
    typeof device.name === "string" &&
    typeof device.type === "string" &&
    typeof device.icon === "string" &&
    typeof device.status === "boolean"
  );
}

function isSensorData(value: unknown): value is SensorData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const sensors = value as Partial<SensorData>;
  return (
    typeof sensors.temperature === "number" &&
    typeof sensors.humidity === "number" &&
    typeof sensors.lightLevel === "number"
  );
}

function parseDevices(value: unknown): Device[] {
  const devices = Array.isArray(value)
    ? value
    : value && typeof value === "object" && "devices" in value
      ? (value as { devices: unknown }).devices
      : null;

  if (!Array.isArray(devices) || !devices.every(isDevice)) {
    throw new IoTServiceError("The backend returned an invalid device list.");
  }

  return devices;
}

function parseSensors(value: unknown): SensorData {
  const sensors =
    value && typeof value === "object" && "sensors" in value
      ? (value as { sensors: unknown }).sensors
      : value;

  if (!isSensorData(sensors)) {
    throw new IoTServiceError("The backend returned invalid sensor data.");
  }

  return sensors;
}

export async function checkGatewayHealth(): Promise<boolean> {
  if (!apiConfig.baseUrl) {
    await delay(REQUEST_DELAY);
    return true;
  }

  try {
    await request<unknown>("/api/gateway/health");
    return true;
  } catch {
    return false;
  }
}

export async function getSensorData(): Promise<SensorData> {
  if (apiConfig.baseUrl) {
    return parseSensors(await request<unknown>("/api/sensors/latest"));
  }

  await delay(REQUEST_DELAY);
  simulateFailure();

  mockSensorData = {
    temperature:
      mockSensorData.temperature >= 35 ? 24 : mockSensorData.temperature + 1,
    humidity: mockSensorData.humidity >= 90 ? 55 : mockSensorData.humidity + 5,
    lightLevel:
      mockSensorData.lightLevel >= 1000 ? 360 : mockSensorData.lightLevel + 80,
  };

  return { ...mockSensorData };
}

export async function getDevices(): Promise<Device[]> {
  if (apiConfig.baseUrl) {
    return parseDevices(await request<unknown>("/api/devices"));
  }

  await delay(REQUEST_DELAY);
  simulateFailure();

  return mockDevices.map((device) => ({ ...device }));
}

export async function updateDeviceStatus(
  id: number,
  status: boolean,
): Promise<Device[]> {
  if (apiConfig.baseUrl) {
    return parseDevices(
      await request<unknown>(`/api/devices/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    );
  }

  await delay(REQUEST_DELAY);
  simulateFailure();

  const device = mockDevices.find((item) => item.id === id);

  if (!device) {
    throw new IoTServiceError(`Device ${id} was not found.`, 404);
  }

  device.status = status;

  return mockDevices.map((item) => ({ ...item }));
}
