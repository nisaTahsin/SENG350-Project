# UVIC Classroom Booking System

This document details important information for running, using, and understanding the system.

## Team Members

| V#   | Name     |
| ---- | -------- |
| V01010048 | Amanda Erickson |
| V01006449 | Nisa Tahsin |
| V01013819 | Griffin Costello |
| V00984911 | Anitta Varghese |
| V01033161 | Taqdeer Kaur Sandhu|


## 1.0 Quick Start

### 1.1 Prerequisites
- Docker and Docker Compose
- Node.js (for local development)

### 1.2 Running the Application

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd group_2_proj
   ```

2. **Start the application:**
   ```bash
   docker compose up
   ```
3. **Access the application:**
Just go to localhost:3000 on your web browser to begin interacting with the system
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

4. **Troubleshooting:**
If you are having issues with database inconsistencies/errors, try using these commands:
   ```bash
   docker compose down -v
   docker compose up --build
   ```

### 1.3 Test User Credentials

Please login with one of the following available test users :

| Username | Password | Role |
|----------|----------|------|
| `staff` | `test123` | Staff |
| `staffA` | `test123` | Staff |
| `registrar` | `test123` | Registrar |
| `admin` | `test123` | Admin |

### 1.4 Features

**All Users:**
- **User Authentication**: Login with any of the three user roles (staff, registrar, or admin)
- **User Permission Hierarchy**: Admin users can log into registrar and staff accounts, and registrars can login to staff accounts

**Staff:**
- **Room Browsing**: View available classrooms by building
- **Room Booking**: Book classrooms in 30-minute sessions a maximum of 7 days into the future
- **View Bookings**: View bookings (upcoming, passed, and cancelled), filter by date, cancel bookings, and view booking details

**Registrar:**
- **Classroom & Timeslot Management**: Edit classroom information and configure available time slots
- **Account Management**: Block abusive accounts or manually release bookings
- **Statistics & System Logs**: View booking statistics, generate reports, and monitor system activity
- **Manage Schedule Integrity**: View utilization and ensure efficient room usage

**Admin:**
- **System Configuration**: Configure system level settings
- **Audit Records**: View comprehensive audit trails and system records
- **System Health**: Monitor system performance and health metrics


### 1.5 Available Buildings

- Elliot Building
- MacLaurin Building  
- Cornett Building
- And many more...

### 1.6 Testing Instructions
To run the tests navigate to src/backend and src/frontend respectively and run:
   ```bash
   npm run test
   ```

## 2.0 Additional Information

### 2.1 API Endpoints

- `GET /users` - List all users
- `POST /users/login` - User authentication
- `POST /booking` - Create a new booking
- `GET /booking` - List all bookings

### 2.2 Development

To run in development mode:
```
npm start
```

### 2.3 File Structure Guide
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


### 2.5 Frontend to Backend Connections
Done through http fetching and oxios.

### 2.4 Hardcoded Elements

#### 2.4.1 Admin System Health Data

Since this system will not be operating like a real booking website, a lot of the system health data is not practical display. 
The database connection timestamp, number of failed booking attempts, and number of failed requests to the system health are dynamic.
The hardcoded elements are:

- API Endpoints status
- Booking Service status
- Error Rate
- Failed Bookings
- System Uptime

#### 2.4.2 Admin Audit Logs

One of our team members worked very hard to implement this feature dynamically, however, their implementation unfortunately caused system-wide authentication issues which interrupted the primary purpose of the system, staff booking. 

Since we don't have nearly enough time to re-implement the audit logs feature after spending many many hours trying to fix the authentication issues, we have decided to roll back the dynamic implementation in favour of hardcoded data. 
