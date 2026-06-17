# MikTik - Backend & Frontend Setup

## Overview
This project consists of two parts:
- **Backend**: Express.js server (runs on port 5000)
- **Frontend**: React + Vite (runs on port 5173)

## Backend Setup

### Prerequisites
- Node.js installed
- MongoDB running locally (optional for basic testing)

### Steps
1. Navigate to the backend directory:
   ```bash
   cd MikTik-Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The backend will start on `http://localhost:5000`

### Available API Endpoints
- **GET** `/api/health` - Check if backend is running
- **POST** `/api/test` - Send a test message to the backend

## Frontend Setup

### Steps
1. Navigate to the frontend directory:
   ```bash
   cd MikTik-Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:5173`

## Testing the Connection

1. Open your browser and go to `http://localhost:5173`
2. Click **"Check Backend Health"** button to test the connection
3. Type a message and click **"Send Message"** to test POST requests

## Configuration

### Backend Environment Variables
Edit `MikTik-Backend/.env` to configure:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - Secret key for JWT tokens

### Frontend API URL
The frontend is configured to connect to `http://localhost:5000`
If you need to change this, update the `API_URL` constant in `src/App.tsx`

## Troubleshooting

### CORS Error
- Make sure the backend is running on port 5000
- Check that CORS is properly configured in the backend

### Connection Refused
- Verify the backend server is running: `http://localhost:5000/api/health`
- Check that ports 5000 and 5173 are not blocked

### Frontend not connecting to backend
- Ensure backend is started first with `npm run dev`
- Check browser console for network errors
- Verify the API_URL in App.tsx matches your backend URL
