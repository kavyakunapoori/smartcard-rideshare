# Smart Carpool and Ride Sharing System - Frontend

This is the React + Vite frontend for the **Smart Carpool and Ride Sharing System**, built for college technical training (TT) project evaluation.

## Technology Stack

- **Framework:** React 18 with Vite
- **Routing:** React Router DOM (v6)
- **API Client:** Axios (configured with JWT interceptors)
- **Icons:** Lucide React
- **Styling:** Custom CSS with Deep Navy, Royal Blue, and Emerald Green design tokens

## Setup and Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Ensure `VITE_API_BASE_URL` points to your backend:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. Production Build:
   ```bash
   npm run build
   ```

## Deployment on Vercel

1. Push your repository to GitHub.
2. In Vercel, import the repository and select **Root Directory** as `frontend`.
3. Set the Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-on-render.onrender.com/api`
4. The included `vercel.json` ensures Single Page App (SPA) route rewrites so refreshing nested routes does not return a 404 error.
