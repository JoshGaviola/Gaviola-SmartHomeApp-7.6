USE gaviola_smarthome;

INSERT INTO devices (name, type, icon, status)
SELECT 'Living Room Light', 'Smart Light', 'bulb-outline', TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM devices WHERE name = 'Living Room Light'
);

INSERT INTO devices (name, type, icon, status)
SELECT 'Bedroom Fan', 'Smart Fan', 'sync-outline', FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM devices WHERE name = 'Bedroom Fan'
);

INSERT INTO devices (name, type, icon, status)
SELECT 'Front Door Lock', 'Smart Lock', 'lock-closed-outline', TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM devices WHERE name = 'Front Door Lock'
);

INSERT INTO sensor_readings (temperature, humidity, light_level)
SELECT 28, 65, 720
WHERE NOT EXISTS (SELECT 1 FROM sensor_readings);
