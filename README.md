# AWS EC2 Demo Backend

A Node.js/Express backend server with PostgreSQL integration for task management.

## Prerequisites

- Node.js 20+
- PostgreSQL 12+
- npm

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

3. **Create PostgreSQL database and tables:**
   ```bash
   psql -U postgres -h localhost -d postgres -f schema.sql
   ```

   Or manually run:
   ```bash
   psql -U postgres -h localhost
   CREATE DATABASE your_database_name;
   \c your_database_name
   \i schema.sql
   ```

4. **Start the server:**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm run start:prod
   ```

The server will be available at `http://localhost:3000`

## API Endpoints

### Health Check
- **GET** `/api/health` - Check server and database status

### Tasks
- **GET** `/api/tasks` - Fetch all tasks
- **POST** `/api/tasks` - Create a new task
  ```json
  {
    "title": "Task title",
    "description": "Optional description"
  }
  ```
- **PUT** `/api/tasks/:id` - Update a task
- **DELETE** `/api/tasks/:id` - Delete a task

## Build

```bash
npm run build
```

Output will be in the `dist/` folder.

## Environment Variables

- `DB_USER` - PostgreSQL username
- `DB_PASSWORD` - PostgreSQL password
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - PostgreSQL database name
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
