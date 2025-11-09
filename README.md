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

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd group_2_proj
   ```

2. **Start the application:**
   ```bash
   docker compose up
   ```
3. **Troubleshooting:**
If you are having issues with database inconsistencies/errors, try using these commands:
   ```bash
   docker compose down -v
   docker compose up --build
   ```


4. **Access the application:**
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

### Features

**All Users:**
- **User Authentication**: Login with any of the three user roles (staff, registrar, or admin)
- **User Permission Hierarchy**: Admin users can log into registrar and staff accounts, and registrars can login to staff accounts

**Staff:**
- **Room Browsing**: View available classrooms by building
- **Room Booking**: Book classrooms in 30-minute sessions a maximum of 7 days into the future
- **View Bookings**: View bookings (upcoming, passed, and cancelled), filter by date, cancel bookings, and view booking details.

**Registrar:**
- **Feature A**: Description
- **Feature B**: Description
- **Feature C**: Description

...

**Admin:**
- **Feature A**: Description
- **Feature B**: Description
- **Feature C**: Description

...

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


