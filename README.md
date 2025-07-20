# PlantBase Backend

**API Documentation:** https://plantbase-be.onrender.com/

A **Node.js** and **Express** backend for the PlantBase application, providing RESTful APIs for user authentication, plant management, care scheduling, and tasks using Supabase Auth and PostgreSQL.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Database Setup & Seeding](#database-setup--seeding)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## Tech Stack

- **Runtime:** Node.js (TypeScript)
- **Web Framework:** Express
- **Database:** PostgreSQL (pg)
- **Authentication:** Supabase Auth
- **Seeding & Migrations:** Custom SQL + pg-format
- **Testing:** Jest + Supertest

## Features

- Supabase Auth for signup/login (email/password)
- CRUD operations for plants
- Care schedule management (water, fertilise, prune tasks)
- Task completion/advancement logic
- Profile management and user-specific endpoints
- Error handling with custom handlers (404, 400, 403, 500)

## Prerequisites

- Node.js v16 or higher
- PostgreSQL v12 or higher
- A Supabase project (used for authentication)

## Environment Variables

Create `.env.development` and `.env.test` in the project root with the following variables:

```ini
PGDATABASE=<your_database_name>
SUPABASE_URL=<your_supabase_url>
SUPABASE_ANON_KEY=<your_supabase_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_supabase_service_role_key>
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Emiltps/plantBase-Backend.git
   cd plantBase-Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Development Mode**

   The default scripts in `package.json` target production builds. For a faster development cycle, add a development script:

   ```json
   "scripts": {
     "dev": "ts-node-dev --respawn --transpile-only ./bin/www.ts",
     // ... existing scripts
   }
   ```

   Then run:

   ```bash
   npm run dev
   ```

4. For production start:
   ```bash
   npm start
   ```

## Database Setup & Seeding

```bash
# Create development and test databases
npm run setup-dbs

# Seed the development database with sample data
npm run seed-dev
```

## Running the Application

```bash
# Start the server in development mode (using ts-node)
npm start
```

## Testing

```bash
# Run unit and integration tests
npm test
```

## API Documentation

Interactive API docs are available at:  
https://plantbase-be.onrender.com/

Frontend:
https://github.com/Emiltps/plantBase-Frontend
