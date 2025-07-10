# PlantBase Backend

A Node.js and Express backend for the PlantBase application, providing RESTful APIs for user authentication, plant management, and care scheduling using Supabase Auth and PostgreSQL.

### Tech Stack

- Runtime: Node.js (TypeScript)
- Web Framework: Express
- Database: PostgreSQL (pg)
- Auth: Supabase Auth
- Seeding & Migrations: Custom SQL + pg-format
- Testing: Jest + Supertest

### Prerequisites

- Node.js v16+
- PostgreSQL v12+
- A Supabase project (for Auth)

### Environment Variables
Create .env.development and .env.test at the project root:

```
PGDATABASE=<insert_here>
SUPABASE_URL=<insert_here>
SUPABASE_ANON_KEY=<insert_here>
SUPABASE_SERVICE_ROLE_KEY=<insert_here>
```

### Installation

```bash
git clone https://github.com/your-org/plantbase-backend.git
cd plantbase-backend
npm install
```

### Database Setup & Seeding

```bash
# Create databases (development & test)
npm run setup-dbs

# Seed development database
npm run seed-dev
```

### Running the Application

```bash
# Start in development (ts-node)
npm start
```


### Testing

```bash
# Run unit and integration tests
npm test
```

