# Smart Carpool and Ride Sharing System - Backend

Java 21 and Spring Boot 3 RESTful API backend for the **Smart Carpool and Ride Sharing System**.

## Technology Stack

- **Language:** Java 21 LTS
- **Framework:** Spring Boot 3.3.4
- **Security:** Spring Security with BCrypt & JWT (JJWT 0.12.6)
- **Database:** MySQL 8.x (via MySQL Connector/J & Flyway MySQL migrations, with H2 in-memory MySQL mode fallback)
- **Persistence:** Spring Data JPA & Hibernate with `@Version` optimistic concurrency control
- **Build Tool:** Apache Maven with Maven Wrapper (`./mvnw` / `mvnw.cmd`)

## Database Initialization (MySQL)

1. Open your MySQL client or MySQL Workbench.
2. Run the SQL initialization script:
   ```sql
   CREATE DATABASE smart_carpool CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. (Optional) Create a dedicated user for the carpool application:
   ```sql
   CREATE USER IF NOT EXISTS 'carpool_user'@'localhost' IDENTIFIED BY 'carpool_pass';
   GRANT ALL PRIVILEGES ON smart_carpool.* TO 'carpool_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

## Running Locally

1. Configure your environment variables in `backend/.env` (or set them in PowerShell):
   ```powershell
   $env:DB_URL = "jdbc:mysql://localhost:3306/smart_carpool?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
   $env:DB_USERNAME = "root"
   $env:DB_PASSWORD = "your_mysql_password"
   ```
   *(Note: If no MySQL database is running, the backend automatically activates an in-memory H2 database in MySQL compatibility mode so you can test immediately without any setup.)*

2. Set your `JAVA_HOME` to JDK 21+ if not default:
   ```powershell
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-26.0.1"
   $env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
   ```

3. Run the application:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   Or on macOS/Linux:
   ```bash
   ./mvnw spring-boot:run
   ```

4. Default Demo Accounts (Auto-seeded when database is empty):
   - **Admin:** `admin@carpool.com` / `Admin@123`
   - **Driver:** `john.driver@carpool.com` / `User@123`
   - **Passenger:** `alex.rider@carpool.com` / `User@123`

## Running Tests

Execute automated unit and integration tests:
```powershell
.\mvnw.cmd clean test
```

## Deployment on Render with Hosted MySQL

Render natively offers a PostgreSQL service, but does not provide a managed MySQL service. Therefore, connect the backend to a hosted MySQL provider:

1. Provision a free managed MySQL database on a hosted provider such as:
   - **TiDB Cloud** (Free Serverless Tier, MySQL 8.0 compatible)
   - **Aiven for MySQL** (Free Tier available)
   - **Railway** (MySQL plugin)
   - **AWS RDS / Clever Cloud / PlanetScale**
2. Obtain your connection parameters from the provider dashboard:
   - Hostname, Port (usually 3306)
   - Database name: `smart_carpool`
   - Username and Password
3. In Render, create a new **Web Service** connected to your repository:
   - **Root Directory:** `backend`
   - **Runtime:** `Docker` (uses `backend/Dockerfile`)
   - **Health Check Path:** `/api/health`
4. Configure the environment variables in the Render Dashboard:
   - `DB_URL`: `jdbc:mysql://<hostname>:3306/smart_carpool?useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC` (or provider's `mysql://...` URI)
   - `DB_USERNAME`: `<hosted_mysql_username>`
   - `DB_PASSWORD`: `<hosted_mysql_password>`
   - `JWT_SECRET`: A secure 32+ character random secret string
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g. `https://smart-carpool.vercel.app`)
   - `PORT`: `8080` (dynamically assigned by Render)
