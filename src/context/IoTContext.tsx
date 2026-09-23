import React, { createContext, useContext, useState } from "react";

import {
    sampleDevices,
    type Device,
    type SensorData,
} from "../models/IoTModels";

type IoTContextType = {
  devices: Device[];
  sensors: SensorData;
  toggleDevice: (id: number, value: boolean) => Promise<void>;
  updatingDeviceId: number | null;
  gatewayConnected: boolean;
  loading: boolean;
  error: string | null;
};

const IoTContext = createContext<IoTContextType | undefined>(undefined);

export function IoTProvider({ children }: { children: React.ReactNode }) {
  const [gatewayConnected] = useState(true);
  const [loading] = useState(false);
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

  const sensors: SensorData = {
    temperature: 100,
    humidity: 99,
    lightLevel: 1000,
  };

  return (
    <IoTContext.Provider
      value={{
        devices: updatedDevices,
        sensors,
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
