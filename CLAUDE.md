# MikTik Project

Full-stack web app: Express.js + MongoDB backend, React + Vite frontend.

## Project Structure

```
MikTik/
├── MikTik-Backend/       # Express.js API (port 5000)
│   ├── src/
│   │   └── index.ts      # Entry point
│   ├── .env              # Environment variables (do not commit)
│   ├── tsconfig.json
│   └── package.json
├── MikTik-Frontend/      # React + Vite app (port 5173)
│   ├── src/
│   │   ├── App.tsx       # Main component
│   │   └── main.tsx
│   ├── vite.config.ts
│   └── package.json
└── .claude/
    ├── settings.json
    └── commands/
```

## Running the Project

**Backend:**
```bash
cd MikTik-Backend && npm run dev
```

**Frontend:**
```bash
cd MikTik-Frontend && npm run dev
```

## Tech Stack

| Layer     | Tech                                |
|-----------|-------------------------------------|
| Frontend  | React 19, TypeScript, Vite          |
| Backend   | Express 5, TypeScript, ts-node-dev  |
| Database  | MongoDB via Mongoose                |
| Auth      | JWT + bcrypt                        |

## Environment Variables (MikTik-Backend/.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/miktik
NODE_ENV=development
JWT_SECRET=...
```

## API Endpoints

| Method | Path          | Description              |
|--------|---------------|--------------------------|
| GET    | /api/health   | Health check             |
| POST   | /api/test     | Echo message back        |

## Key Conventions

- Backend uses CommonJS (`require`) with TypeScript compiled to `commonjs` module
- Frontend uses ES modules
- CORS is configured to allow `http://localhost:5173` only
- All new routes go in `src/routes/`, models in `src/models/`, middleware in `src/middleware/`

## Common Tasks

- **Type check backend:** `cd MikTik-Backend && npx tsc --noEmit`
- **Type check frontend:** `cd MikTik-Frontend && npx tsc -b --noEmit`
- **Install backend deps:** `cd MikTik-Backend && npm install <pkg>`
- **Install frontend deps:** `cd MikTik-Frontend && npm install <pkg>`
