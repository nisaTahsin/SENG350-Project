# Backend - Node.js / TypeScript

This backend project is built with **Node.js**, **TypeScript**, and **NestJS**.  
It provides APIs for the system, including user authentication, booking management, audit logs, and analytics.

---

## Getting Started

First, install the project dependencies:

### `npm install`

Then, you can start the backend server:

### `npm run start`

---

## Available Scripts

In the backend project directory, you can run the following commands:

| Command | Description |
|---------|-------------|
| `npm run start` | Starts the backend server in development mode |
| `npm run start:dev` | Starts the backend server in development mode with auto-reloading |
| `npm run build` | Compiles TypeScript files into JavaScript |
| `npm run test` | Runs backend tests |
 

---

## Project Structure

```
backend/
├── src/                  # Backend source code
│   ├── analytics/        # Analytics-related modules
│   ├── audit/            # Audit log handling
│   ├── auth/             # Authentication (login, permissions)
│   ├── booking/          # Booking management
│   ├── maintenance/      # Maintenance tasks
│   ├── room/             # Room management
│   ├── timeslot/         # Timeslot management
│   ├── types/            # TypeScript type definitions
│   ├── user/             # User management
│   ├── app.module.ts     # Main NestJS application module
│   ├── data-source.ts    # Database connection configuration
│   ├── db.ts             # Database helpers
│   └── main.ts           # Application entry point
├── tests/                # Backend tests
├── .env                  # Environment variables
├── package.json          # Project dependencies and scripts
├── package-lock.json     # Dependency lock file
├── tsconfig.json         # TypeScript configuration
├── tsconfig.tsbuildinfo  # TypeScript build info
├── Dockerfile            # Docker setup for backend
├── old-dockerfile.txt    # Previous Docker setup
└── schema.sql            # SQL schema for database
```

---

## Notable Libraries / Frameworks

- **NestJS** → Structured backend framework for Node.js  
- **TypeORM** → ORM for database access  
- **JWT** → User authentication and token management  
- **Jest** → Backend testing  

---

## Modules Overview

| Module | Description |
|--------|-------------|
| analytics/ | Handles analytics-related operations and reporting |
| audit/ | Manages audit logs and tracking of system events |
| auth/ | User authentication, authorization, and permissions |
| booking/ | Booking creation, retrieval, and management |
| maintenance/ | System maintenance tasks and utilities |
| room/ | Room information and management |
| timeslot/ | Timeslot creation, management, and validation |
| types/ | TypeScript type definitions for the backend |
| user/ | User account management and permissions |
| app.module.ts | Main NestJS application module that ties all modules together |
| data-source.ts | Database connection and configuration |
| db.ts | Database helper functions |
| main.ts | Application entry point |

---

## Learn More

- [NestJS Documentation](https://docs.nestjs.com/)  
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)  
- [Node.js Documentation](https://nodejs.org/en/docs/)
