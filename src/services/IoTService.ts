import {
    sampleDevices,
    type Device,
    type SensorData,
} from "../models/IoTModels";

const REQUEST_DELAY = 500;
const FAILURE_RATE = 0.1;

let devices = sampleDevices.map((device) => ({ ...device }));
let sensorData: SensorData = {
  temperature: 28,
  humidity: 65,
  lightLevel: 720,
};

function delay(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function simulateFailure() {
  if (Math.random() < FAILURE_RATE) {
    throw new Error("The IoT service is temporarily unavailable.");
  }
}

export async function getSensorData(): Promise<SensorData> {
  await delay(REQUEST_DELAY);
  simulateFailure();

  sensorData = {
    temperature: sensorData.temperature >= 35 ? 24 : sensorData.temperature + 1,
    humidity: sensorData.humidity >= 90 ? 55 : sensorData.humidity + 5,
    lightLevel:
      sensorData.lightLevel >= 1000 ? 360 : sensorData.lightLevel + 80,
  };

  return { ...sensorData };
}

export async function getDevices(): Promise<Device[]> {
  await delay(REQUEST_DELAY);
  simulateFailure();

  return devices.map((device) => ({ ...device }));
}

export async function updateDeviceStatus(
  id: number,
  status: boolean,
): Promise<Device[]> {
  await delay(REQUEST_DELAY);
  simulateFailure();

  const device = devices.find((item) => item.id === id);

  if (!device) {
    throw new Error(`Device ${id} was not found.`);
  }

  device.status = status;

  return devices.map((item) => ({ ...item }));
}
