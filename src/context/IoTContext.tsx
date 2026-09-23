import React, { createContext, useContext, useState } from "react";

import {
    sampleDevices,
    type Device,
    type SensorData,
} from "../models/IoTModels";

type IoTContextType = {
  devices: Device[];
  sensors: SensorData;
  refreshSensors: () => Promise<void>;
  toggleDevice: (id: number, value: boolean) => Promise<void>;
  updatingDeviceId: number | null;
  gatewayConnected: boolean;
  loading: boolean;
  error: string | null;
};

const IoTContext = createContext<IoTContextType | undefined>(undefined);

export function IoTProvider({ children }: { children: React.ReactNode }) {
  const [gatewayConnected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [updatingDeviceId, setUpdatingDeviceId] = useState<number | null>(null);

  const [deviceStatus, setDeviceStatus] = useState(
    sampleDevices.reduce(
      (acc, device) => {
        acc[device.id] = device.status;

        return acc;
      },
      {} as Record<number, boolean>,
    ),
  );

  const toggleDevice = async (id: number, value: boolean) => {
    if (!gatewayConnected || updatingDeviceId !== null) {
      return;
    }

    setUpdatingDeviceId(id);

    await new Promise((resolve) => setTimeout(resolve, 300));

    setDeviceStatus((currentStatus) => ({
      ...currentStatus,
      [id]: value,
    }));
    setUpdatingDeviceId(null);
  };

  const updatedDevices = sampleDevices.map((device) => ({
    ...device,
    status: deviceStatus[device.id],
  }));

  const [sensors, setSensors] = useState<SensorData>({
    temperature: 28,
    humidity: 65,
    lightLevel: 720,
  });

  const refreshSensors = async () => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setSensors((currentSensors) => ({
      temperature:
        currentSensors.temperature >= 35 ? 24 : currentSensors.temperature + 1,
      humidity:
        currentSensors.humidity >= 90 ? 55 : currentSensors.humidity + 5,
      lightLevel:
        currentSensors.lightLevel >= 1000
          ? 360
          : currentSensors.lightLevel + 80,
    }));
    setLoading(false);
  };

  const currentSensors: SensorData = {
    ...sensors,
  };

  return (
    <IoTContext.Provider
      value={{
        devices: updatedDevices,
        sensors: currentSensors,
        refreshSensors,
        toggleDevice,
        gatewayConnected,
        loading,
        error,
        updatingDeviceId,
      }}
    >
      {children}
    </IoTContext.Provider>
  );
}

export function useIoT() {
  const context = useContext(IoTContext);

  if (!context) {
    throw new Error("useIoT must be used inside IoTProvider");
  }

  return context;
}
