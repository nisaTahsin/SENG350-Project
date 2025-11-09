# UVIC Classroom Booking System



## Team Members

| V#   | Name     |
| ---- | -------- |
| V01010048 | Amanda Erickson |
| V01006449 | Nisa Tahsin |
| V01013819 | Griffin Costello |
| V00984911 | Anitta Varghese |
| V01033161 | Taqdeer Kaur Sandhu|

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd group_2_proj
   ```

2. **Start the application**
   ```bash
   docker-compose up
   ```
   Try again if it doesn't work the first time

3. **Access the application**
Just go to localhost:3000 on your web browser to begin interacting with the system
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

### Test User Credentials
The following test users are available for testing different user roles:

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| `staff` | `test123` | Staff | Can browse and book classrooms |
| `staffA` | `test123` | Staff | Additional staff user |
| `registrar` | `test123` | Registrar | Registrar-level access |
| `admin` | `test123` | Admin | Administrative access |

### Test Audit Logs
The following test audit log entries are seeded in the database:

| Actor    | Action                      | Target Type | Target ID | Metadata (summary)                                                                 | Timestamp (relative) |
|----------|-----------------------------|-------------|-----------|------------------------------------------------------------------------------------|----------------------|
| admin    | USER_LOGIN                  | user        | 1         | {"username":"admin","role":"admin","timestamp":"2024-11-09T10:00:00Z"}             | ~1 hour ago          |
| registrar| USER_LOGIN                  | user        | 2         | {"username":"registrar","role":"registrar","timestamp":"2024-11-09T09:30:00Z"}     | ~1.5 hours ago       |
| staff    | USER_LOGIN                  | user        | 3         | {"username":"staff","role":"staff","timestamp":"2024-11-09T09:00:00Z"}             | ~2 hours ago         |
| admin    | USER_CREATED                | user        | 4         | {"username":"newstaff","role":"staff","created_by":"admin"}                       | ~3 hours ago         |
| admin    | USER_ROLE_CHANGED           | user        | 2         | {"username":"registrar","old_role":"staff","new_role":"registrar"}                | ~4 hours ago         |
| registrar| USER_BLOCKED_WITH_REASON    | user        | 4         | {"username":"newstaff","reason":"Policy violation"}                               | ~5 hours ago         |
| admin    | SYSTEM_CONFIG_CHANGED       | NULL        | NULL      | {"setting":"max_bookings_per_day","old_value":"2","new_value":"3"}                | ~6 hours ago         |

### Features

- **User Authentication**: Login with different user roles
- **Room Browsing**: View available classrooms by building
- **Room Booking**: Book classrooms in 30-minute chunks many days into the future

### Available Buildings

- Elliot Building
- MacLaurin Building  
- Clearihue Building
- David Strong Building
- Cornett Building
- And many more...

### API Endpoints

- `GET /users` - List all users
- `POST /users/login` - User authentication
- `GET /rooms` - List all rooms
- `GET /rooms/:id/timeslots` - Get timeslots for a room
- `POST /booking` - Create a new booking
- `GET /booking` - List all bookings

### Development

To run in development mode:

```bash
# Backend
cd src/backend
npm install
npm run start:dev

# Frontend  
cd src/frontend
npm install
npm start
```

## Directory Structure

The project directory is organized as follows:

```
Root/
├── data/
│   ├── uvic_rooms.csv           # CSV used to seed rooms
│   └── .gitkeep
├── docker-compose.yml
├── Dockerfile
├── package.json
├── package-lock.json
├── README.md
└── src/
    ├── backend/
    │   ├── .env
    │   ├── Dockerfile
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── schema.sql
    │   └── src/                    # Main backend source (controllers, services, entities, modules, tests)
    │
    └── frontend/
        ├── Dockerfile
        ├── package.json
        ├── tsconfig.json
        ├── README.md
        └── src/                    # Main frontend source (React app: components, pages, contexts, tests)
```

Notes:
- backend/src contains the Nest/Node TypeScript application code that runs the backend (controllers, modules, services, entities, DB/data-source, and tests).
- frontend/src contains the React TypeScript application code that runs the frontend (components, pages, contexts, public assets, and tests).
- Each of backend and frontend is self-contained with its own package.json, Dockerfile, tsconfig.json and test folders.
- data/uvic_rooms.csv is used by schema.sql to seed initial room records when the DB container initializes.
- docker-compose.yml wires the three services (frontend, backend, db) for local development.


