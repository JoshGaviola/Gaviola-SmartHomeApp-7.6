import React, { createContext, useContext, useEffect, useState } from "react";

import {
    sampleDevices,
    type Device,
    type SensorData,
} from "../models/IoTModels";
import {
    getDevices,
    getSensorData,
    updateDeviceStatus,
} from "../services/IoTService";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingDeviceId, setUpdatingDeviceId] = useState<number | null>(null);

  const [devices, setDevices] = useState<Device[]>(sampleDevices);
  const [sensors, setSensors] = useState<SensorData>({
    temperature: 28,
    humidity: 65,
    lightLevel: 720,
  });

  useEffect(() => {
    let active = true;

    Promise.all([getDevices(), getSensorData()])
      .then(([loadedDevices, loadedSensors]) => {
        if (active) {
          setDevices(loadedDevices);
          setSensors(loadedSensors);
        }
      })
      .catch((serviceError: Error) => {
        if (active) {
          setError(serviceError.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const toggleDevice = async (id: number, value: boolean) => {
    if (!gatewayConnected || updatingDeviceId !== null) {
      return;
    }

    setUpdatingDeviceId(id);

    setError(null);

    try {
      setDevices(await updateDeviceStatus(id, value));
    } catch (serviceError) {
      setError(
        serviceError instanceof Error
          ? serviceError.message
          : "Unable to update the device.",
      );
    } finally {
      setUpdatingDeviceId(null);
    }
  };

  const refreshSensors = async () => {
    setLoading(true);
    setError(null);

    try {
      setSensors(await getSensorData());
    } catch (serviceError) {
      setError(
        serviceError instanceof Error
          ? serviceError.message
          : "Unable to refresh sensors.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <IoTContext.Provider
      value={{
        devices,
        sensors,
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
