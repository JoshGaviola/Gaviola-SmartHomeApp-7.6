# Smart Home Backend

Express and MySQL backend for the Expo smart-home app. Its structure follows the attached delivery backend example: one app entrypoint, one shared database module, and one router per domain.

## Setup

```powershell
Copy-Item .env.example .env
npm install
```

Set the MySQL values in `.env`, then run the SQL files in order:

```powershell
mysql -u root -p < sql/schema.sql
mysql -u root -p < sql/seed.sql
```

Start the server:

```powershell
npm start
```

## Routes

- `GET /health`
- `GET /api/gateway/health`
- `GET /api/devices`
- `PATCH /api/devices/:id/status` with `{ "status": true }`
- `GET /api/sensors/latest`
