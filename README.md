# Smart Carpool and Ride Sharing System

A full-stack, production-grade web application engineered with **Java 21**, **Spring Boot 3.x**, and **React (Vite)** for technical training (TT) project evaluation.

The system connects drivers with empty vehicle seats to passengers commuting along identical routes, facilitating cost-splitting, traffic congestion reduction, and lower carbon emissions through verified, community-first shared transit.

---

## 1. Project Overview & Key Features

### Core Capabilities
- **JWT Stateless Authentication:** Secure user registration, login, token refresh, and logout powered by Spring Security and BCrypt password hashing.
- **Role-Based Authorization:** Strict boundary segregation between `ROLE_USER` (drivers/passengers) and `ROLE_ADMIN` (platform operators).
- **Ride Discovery & Advanced Filtering:** Search trips by origin city, destination, travel date, and minimum passenger seats needed.
- **Ride Publishing & Management:** Drivers publish upcoming trips with route details, schedule, passenger capacity (1–8 seats), price per seat, and vehicle information.
- **Atomic Booking & Anti-Overbooking Engine:** Database-level transactional locking (`@Version` optimistic concurrency) prevents simultaneous race conditions and overbooking.
- **Seat Availability & Automatic Restoration:** Seats are atomically decremented upon confirmed booking. If a booking or trip is cancelled, available seats are immediately refunded back to the ride pool.
- **Safety Business Rules:** Drivers cannot book their own rides; passengers cannot book beyond available seats or create duplicate active bookings.
- **Passenger Roster for Drivers:** Drivers can view real-time passenger contact info (phone, email, reserved seat counts, booking notes) for their offered trips.
- **User Dashboard & Profile:** Personal trip metrics, itinerary timeline, phone/name updates, and secure current-password-verified password changes.
- **Administrative Moderation Panel:** Platform-wide metrics (total users, rides, active trips, bookings, total revenue), user account deletion, and administrative force-cancellation of rides.
- **Production Health-Check Endpoint:** Zero-secret `GET /api/health` verifying uptime and service version.
- **Pre-Seeded Demo Accounts:** Pre-populated with realistic trips and verified accounts for instant evaluator demonstration.

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM (v6), Axios, Lucide React, Modern CSS3 |
| **Backend** | Java 21 LTS, Spring Boot 3.3.4, Spring Web, Spring Data JPA, Spring Security 6, Spring Validation, JJWT 0.12.6 |
| **Database** | MySQL 8.x (via MySQL Connector/J & Flyway MySQL), In-Memory H2 (Local zero-config dev/test mode) |
| **Deployment** | Vercel (Frontend SPA), Render (Backend Dockerized Web Service) & Hosted MySQL (TiDB / Aiven / Railway / AWS RDS) |
| **Build & Tooling** | Apache Maven 3.9.9 (`./mvnw`, `mvnw.cmd`), Node.js (v18+), npm |

---

## 3. Monorepo Project Structure

```text
smart-carpool-system/
├── .gitignore                          # Git ignore rules (secrets, build targets, node_modules)
├── README.md                           # Master documentation and deployment handbook
├── render.yaml                         # Render Infrastructure-as-Code Blueprint
│
├── backend/                            # Spring Boot Java 21 REST API
│   ├── .mvn/wrapper/                   # Maven wrapper configuration
│   ├── Dockerfile                      # Production multi-stage Docker build
│   ├── mvnw                            # Linux/macOS Maven wrapper script
│   ├── mvnw.cmd                        # Windows PowerShell Maven wrapper batch script
│   ├── pom.xml                         # Maven dependencies & build plugins
│   ├── .env.example                    # Backend environment template
│   ├── README.md                       # Backend specific documentation
│   └── src/
│       ├── main/
│       │   ├── java/com/smartcarpool/system/
│       │   │   ├── SmartCarpoolApplication.java
│       │   │   ├── config/             # SecurityConfig, CorsConfig, DatabaseConfig, DataInitializer
│       │   │   ├── controller/         # Auth, User, Ride, Booking, Admin, Health Controllers
│       │   │   ├── dto/                # Request & Response Data Transfer Objects
│       │   │   ├── entity/             # User, Ride, Booking, Role, Status Enums
│       │   │   ├── exception/          # GlobalExceptionHandler, Custom exceptions, ErrorResponse
│       │   │   ├── repository/         # Spring Data JPA repositories with JPQL queries
│       │   │   ├── security/           # JwtTokenProvider, JwtAuthFilter, UserPrincipal
│       │   │   └── service/            # AuthService, UserService, RideService, BookingService, AdminService
│       │   └── resources/
│       │       ├── application.properties
│       │       └── db/migration/V1__init_schema.sql
│       └── test/
│           ├── java/com/smartcarpool/system/
│           │   ├── AuthServiceTest.java
│           │   ├── BookingServiceTest.java
│           │   ├── RideServiceTest.java
│           │   └── SmartCarpoolIntegrationTest.java
│           └── resources/application-test.properties
│
└── frontend/                           # React + Vite Frontend Client
    ├── index.html                      # HTML entry with Plus Jakarta Sans & Outfit fonts
    ├── package.json                    # Frontend dependencies & scripts
    ├── vite.config.js                  # Vite configuration & dev proxy
    ├── vercel.json                     # Vercel SPA routing rewrites & asset caching
    ├── .env.example                    # Frontend environment template
    ├── README.md                       # Frontend specific documentation
    ├── public/
    │   └── favicon.svg                 # Smart Carpool brand SVG favicon
    └── src/
        ├── main.jsx                    # React DOM root entry
        ├── App.jsx                     # Router routes & providers tree
        ├── context/                    # AuthContext, ToastContext
        ├── services/api.js             # Axios client with JWT interceptors
        ├── styles/index.css            # Design tokens & responsive styles
        ├── components/common/          # Navbar, Footer, ProtectedRoute, AdminRoute, Modals, Spinners
        └── pages/                      # Home, Login, Register, FindRides, RideDetails,
                                        # OfferRide, Dashboard, MyBookings, MyOfferedRides,
                                        # EditRide, Profile, AdminDashboard, NotFound
```

---

## 4. Prerequisites and MySQL Setup

Before running the application locally on Windows, verify that you have:
1. **Java Development Kit (JDK 21 or later):**
   ```powershell
   java -version
   javac -version
   ```
2. **Node.js (v18 or later) and npm:**
   ```powershell
   node -v
   npm -v
   ```
3. **Git:**
   ```powershell
   git --version
   ```
4. **MySQL Server (8.0 or later):**
   - Download and install [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) or MySQL Installer for Windows.
   - Start the MySQL service from Windows PowerShell (Run as Administrator if needed):
     ```powershell
     net start MySQL80
     ```
     *(Or via PowerShell: `Start-Service MySQL80`)*
   - Open MySQL CLI or MySQL Workbench and initialize the database:
     ```sql
     CREATE DATABASE smart_carpool CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
     ```
   - (Optional) Create a dedicated user for Smart Carpool:
     ```sql
     CREATE USER IF NOT EXISTS 'carpool_user'@'localhost' IDENTIFIED BY 'carpool_pass';
     GRANT ALL PRIVILEGES ON smart_carpool.* TO 'carpool_user'@'localhost';
     FLUSH PRIVILEGES;
     ```

---

## 5. Local Setup and Execution in Visual Studio Code

### Step 1: Open Workspace in VS Code
Open the root directory `c:\smartcard-rideshare` in Visual Studio Code.

### Step 2: Configure Environment Variables

**Backend Environment Setup:**
Create `backend/.env` (or set variables in your terminal) using `backend/.env.example`:
```env
PORT=8080
DB_URL=jdbc:mysql://localhost:3306/smart_carpool?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=supersecurejwtsecretkeyforlocaldevelopment2026min256bits
FRONTEND_URL=http://localhost:5173,http://localhost:3000
```
> [!NOTE]
> If you do not have MySQL running locally, the backend **automatically falls back to an in-memory H2 database** in MySQL compatibility mode (`MODE=MySQL`). You can launch and test immediately!

**Frontend Environment Setup:**
In `frontend/`, create `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Step 3: Run the Backend
Open a terminal in VS Code:
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
*(On macOS/Linux use `./mvnw spring-boot:run`)*

The Spring Boot backend will start on **`http://localhost:8080`**.
Verify health by visiting: `http://localhost:8080/api/health`

### Step 4: Run the Frontend
Open a second terminal in VS Code:
```powershell
cd frontend
npm.cmd run dev
```
Open **`http://localhost:5173`** in your web browser.

---

## 6. Pre-Seeded Academic Evaluation Accounts

When the application boots against a fresh database, `DataInitializer` seeds test accounts and active trips:

| Role | Email Address | Password | Description |
|---|---|---|---|
| **Platform Admin** | `admin@carpool.com` | `Admin@123` | Full access to `/admin` dashboard, metrics, user deletion, and ride cancellation |
| **Driver Dan** | `john.driver@carpool.com` | `User@123` | Offered rides in New York, Austin, etc. |
| **Driver Sarah** | `sarah.driver@carpool.com` | `User@123` | Offered rides in San Francisco, Seattle |
| **Rider Alex** | `alex.rider@carpool.com` | `User@123` | Pre-existing confirmed booking on Seattle ➔ Portland trip |

> [!TIP]
> The Login page includes **Quick-Fill Demo Buttons** ("Admin Demo", "Driver Demo", "Rider Demo") to log in with one click during project demonstrations.

---

## 7. REST API Documentation

All endpoints return uniform JSON envelopes:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-10-25T14:30:00"
}
```

### Authentication Endpoints
- `POST /api/auth/register` — Register a new user account
- `POST /api/auth/login` — Authenticate and obtain JWT Bearer token
- `POST /api/auth/logout` — Logout session
- `GET /api/auth/me` — Retrieve authenticated user identity (`Bearer token`)

### User Profile Endpoints
- `GET /api/users/me` — Get profile of authenticated user
- `PUT /api/users/me` — Update full name and phone number
- `PUT /api/users/me/password` — Change password (verifies `currentPassword`)

### Ride Endpoints
- `GET /api/rides` — Search trips (`?source=...&destination=...&date=YYYY-MM-DD&minSeats=...`)
- `GET /api/rides/{id}` — Get complete details for a single ride
- `POST /api/rides` — Publish a new ride (Authenticated driver)
- `PUT /api/rides/{id}` — Update ride schedule/vehicle/price (Driver/Admin)
- `DELETE /api/rides/{id}` — Cancel ride and cascade cancel active bookings (Driver/Admin)
- `GET /api/rides/mine` — Retrieve all rides offered by the authenticated driver
- `GET /api/rides/{rideId}/bookings` — View passenger booking roster for an offered ride

### Booking Endpoints
- `POST /api/bookings` — Book 1–N seats on an available ride (Authenticated passenger)
- `GET /api/bookings/mine` — Retrieve all bookings for the authenticated passenger
- `GET /api/bookings/{id}` — Retrieve single booking details
- `PATCH /api/bookings/{id}/cancel` — Cancel booking and restore available seats to the ride

### Admin Endpoints (`ROLE_ADMIN` only)
- `GET /api/admin/stats` — Platform metrics (Users, rides, active trips, bookings, revenue)
- `GET /api/admin/users` — List all registered platform users
- `DELETE /api/admin/users/{id}` — Delete user account
- `GET /api/admin/rides` — Audit all rides across the platform
- `PATCH /api/admin/rides/{id}/cancel` — Admin force-cancel ride

### Health Endpoint
- `GET /api/health` — Public uptime status check

---

## 8. Automated Test Suite

Automated unit and integration tests are located in `backend/src/test/java/com/smartcarpool/system/`.

### Run Tests:
```powershell
cd backend
.\mvnw.cmd clean test
```

### Test Coverage Highlights:
- `AuthServiceTest` (4 tests): Registration success, duplicate email collision rejection, password mismatch validation, JWT login authentication.
- `RideServiceTest` (5 tests): Ride creation, rejection of past departure dates, search query filtering, unauthorized edit prevention, ride cancellation.
- `BookingServiceTest` (6 tests): Seat reservation and atomic decrement, rejection when requested seats exceed capacity, prevention of driver booking own ride, prevention of duplicate active bookings, booking cancellation and seat restoration, unauthorized cancellation blocking.
- `SmartCarpoolIntegrationTest` (3 tests): Context loading, `/api/health` validation, public `/api/rides` accessibility, and 401 Unauthorized protection on `/api/admin/stats`.

**Test Result:** `Tests run: 18, Failures: 0, Errors: 0, Skipped: 0` (100% Passing).

---

## 9. GitHub Repository Setup and Push Commands

Push your codebase to GitHub:

```powershell
# 1. Initialize git repository
git init

# 2. Stage all project files (sensitive .env files are excluded by .gitignore)
git add .

# 3. Commit the implementation
git commit -m "feat: complete full-stack smart carpool and ride sharing system"

# 4. Set default branch to main
git branch -M main

# 5. Add your remote repository URL (replace with your GitHub repo URL)
git remote add origin https://github.com/your-username/smart-carpool-system.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 10. Deployment Guide

### A. Deploy Managed MySQL Database (Hosted MySQL Provider)
Render natively offers a PostgreSQL managed service, but does not offer managed MySQL. For production, connect your Render web service to a MySQL-compatible cloud provider:
1. Choose a free or low-cost cloud MySQL provider:
   - **TiDB Cloud** (Free Serverless Tier, MySQL 8.0 wire-compatible)
   - **Aiven for MySQL** (Free tier available)
   - **Railway** (MySQL service add-on)
   - **AWS RDS / Clever Cloud / PlanetScale**
2. In the provider dashboard, create a database named `smart_carpool`.
3. Note your connection details:
   - **Host:** e.g. `gateway01.us-west-2.prod.aws.tidbcloud.com`
   - **Port:** `3306` (or provider port like `4000`)
   - **Database Name:** `smart_carpool`
   - **Username:** Your database user
   - **Password:** Your database password
   - **JDBC URL Format:** `jdbc:mysql://<host>:<port>/smart_carpool?useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC`

### B. Deploy Spring Boot Backend on Render
1. In the Render Dashboard, click **New +** ➔ **Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Name:** `smart-carpool-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Docker` (Render automatically uses `backend/Dockerfile`)
   - **Instance Type:** `Free`
4. Add **Environment Variables**:
   - `PORT`: `8080`
   - `DB_URL`: `jdbc:mysql://<hostname>:<port>/smart_carpool?useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC` (or provider's `mysql://...` URI)
   - `DB_USERNAME`: `<your_hosted_mysql_user>`
   - `DB_PASSWORD`: `<your_hosted_mysql_password>`
   - `JWT_SECRET`: A secure 32+ character random key (e.g. `c7f98d1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9`)
   - `FRONTEND_URL`: Your Vercel frontend URL (or temporary `http://localhost:5173` until Vercel is deployed, then update).
5. Health Check Path: `/api/health`
6. Click **Create Web Service**.
7. Once deployed, note your Render URL (e.g. `https://smart-carpool-backend.onrender.com`).

### C. Deploy React Frontend on Vercel
1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New...** ➔ **Project** and import your GitHub repository.
3. Configure the Project:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click Edit and select `frontend`.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Expand **Environment Variables**:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://smart-carpool-backend.onrender.com/api` *(your Render backend URL followed by `/api`)*
5. Click **Deploy**.
6. The included `vercel.json` ensures that Single Page App routing works without 404s when pages are refreshed.
7. Return to Render and update `FRONTEND_URL` in the backend environment variables with your deployed Vercel domain (e.g. `https://smart-carpool.vercel.app`) to authorize CORS.

---

## 11. Troubleshooting Guide

| Issue | Cause | Fix |
|---|---|---|
| **PowerShell script execution disabled** (`PSSecurityException`) | Windows blocks `.ps1` execution by default. | Use `npm.cmd` instead of `npm`, or run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` |
| **`PORT` already in use (8080 or 5173)** | Another local process is occupying the port. | Change the port in `backend/.env` (`PORT=8081`) or specify `--port 5174` for Vite. |
| **MySQL Connection Refused (`CommunicationsLinkException`)** | Local MySQL service is stopped or port 3306 is inactive. | Start MySQL in Windows PowerShell (`net start MySQL80` or `Start-Service MySQL80`). If MySQL is not installed, omit `DB_URL` to automatically fall back to the built-in in-memory H2 database in MySQL mode. |
| **Public Key Retrieval Not Allowed (`allowPublicKeyRetrieval`)** | MySQL 8 uses `caching_sha2_password` by default. | Ensure your JDBC URL includes `?allowPublicKeyRetrieval=true&useSSL=false` (or `useSSL=true` for hosted cloud SSL). |
| **CORS errors in browser console** | Backend `FRONTEND_URL` does not include your frontend origin. | Update `FRONTEND_URL` in backend environment variables to match your exact Vercel URL (e.g., `https://my-app.vercel.app`). Do not include a trailing slash. |
| **Render backend spinning down / slow first response** | Render Free Tier services spin down after 15 minutes of inactivity. | Wait 30–50 seconds on the first request for the free container to wake up. Check `/api/health` to confirm uptime. |
| **Vercel returns 404 on page refresh** | Static web server missing SPA rewrite rule. | Handled automatically! The included `frontend/vercel.json` rewrites all requests to `/index.html`. |

---

## 12. College Demonstration Walkthrough

When presenting this project to technical evaluators:
1. **Landing Page:** Showcase the search widget, 3-step process, and value propositions.
2. **One-Click Demo Login:** Click "Admin Demo" or "Driver Demo" on the login screen to demonstrate role-based access instantly.
3. **Ride Creation:** Log in as Driver, navigate to **Offer a Ride**, fill in the schedule and vehicle details, and publish the trip.
4. **Search & Seat Reservation:** Log out, log in as Rider Alex, search for the route, review trip details, and reserve 2 seats.
5. **Anti-Overbooking Verification:** Show how available seats immediately update from 4 to 2 in real-time. Try booking 5 seats to prove the backend rejects requests exceeding capacity.
6. **Cancellation & Seat Refund:** Navigate to **My Bookings**, cancel the booking, and verify that the 2 seats are restored to the ride pool.
7. **Driver Passenger Roster:** Log in as the driver, go to **My Offered Rides**, expand **View Passengers**, and show passenger contact details.
8. **Admin Panel:** Log in with `admin@carpool.com`, visit the **Admin Panel**, and display platform statistics, user accounts, and moderation controls.
