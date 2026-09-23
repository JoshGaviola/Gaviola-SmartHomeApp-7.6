import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
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
  retryDevices: () => Promise<void>;
  retryDeviceUpdate: () => Promise<void>;
  toggleDevice: (id: number, value: boolean) => Promise<void>;
  updatingDeviceId: number | null;
  gatewayConnected: boolean;
  loading: boolean;
  devicesLoading: boolean;
  sensorError: string | null;
  deviceError: string | null;
  error: string | null;
};

const IoTContext = createContext<IoTContextType | undefined>(undefined);

export function IoTProvider({ children }: { children: React.ReactNode }) {
  const [gatewayConnected] = useState(true);
  const [devices, setDevices] = useState<Device[]>(sampleDevices);
  const [sensors, setSensors] = useState<SensorData>({
    temperature: 28,
    humidity: 65,
    lightLevel: 720,
  });
  const [loading, setLoading] = useState(true);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [sensorError, setSensorError] = useState<string | null>(null);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [updatingDeviceId, setUpdatingDeviceId] = useState<number | null>(null);
  const [lastDeviceCommand, setLastDeviceCommand] = useState<{
    id: number;
    value: boolean;
  } | null>(null);

  const loadDevices = useCallback(async () => {
    setDevicesLoading(true);
    setDeviceError(null);

    try {
      setDevices(await getDevices());
    } catch {
      setDeviceError("Unable to retrieve devices.");
    } finally {
      setDevicesLoading(false);
    }
  }, []);

  const refreshSensors = useCallback(async () => {
    setLoading(true);
    setSensorError(null);

    try {
      setSensors(await getSensorData());
    } catch {
      setSensorError("Unable to retrieve sensor data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const request = setTimeout(() => {
      void loadDevices();
      void refreshSensors();
    }, 0);

    return () => clearTimeout(request);
  }, [loadDevices, refreshSensors]);

  const toggleDevice = async (id: number, value: boolean) => {
    if (!gatewayConnected || updatingDeviceId !== null) {
      return;
    }

    const device = devices.find((item) => item.id === id);
    setUpdatingDeviceId(id);
    setDeviceError(null);
    setLastDeviceCommand({ id, value });

    try {
      setDevices(await updateDeviceStatus(id, value));
      setLastDeviceCommand(null);
    } catch {
      setDeviceError(`Unable to update ${device?.name ?? "device"}.`);
    } finally {
      setUpdatingDeviceId(null);
    }
  };

  const retryDeviceUpdate = async () => {
    if (lastDeviceCommand) {
      await toggleDevice(lastDeviceCommand.id, lastDeviceCommand.value);
    }
  };

  const error = sensorError ?? deviceError;

  return (
    <IoTContext.Provider
      value={{
        devices,
        sensors,
        refreshSensors,
        retryDevices: loadDevices,
        retryDeviceUpdate,
        toggleDevice,
        updatingDeviceId,
        gatewayConnected,
        loading,
        devicesLoading,
        sensorError,
        deviceError,
        error,
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
