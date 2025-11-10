This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Project Structure

```
frontend/
├── .env                      # Env vars (sample values in .env.example if present)
├── .env.local                # Local-only env overrides (gitignored)
├── .gitignore                # React base ignores
├── Dockerfile                # Docker setup
├── package.json              # Project dependencies
├── package-lock.json         # Locked dependencies
├── tsconfig.json             # TypeScript configuration
├── README.md                 # Project documentation
├── public/                   # Static assets
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── api/                  # API helpers 
│   ├── components/
│   │   ├── Dashboard.css
│   │   ├── ErrorBoundary.tsx
│   │   ├── GenericPage.css
│   │   ├── GenericPage.tsx
│   │   ├── Login.css
│   │   ├── Login.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── pages/
│   │       ├── admin_pages/
│   │       │   ├── AdminAuditRecords.tsx
│   │       │   ├── AdminDatabase.tsx
│   │       │   ├── AdminMonitoring.tsx
│   │       │   ├── AdminSystemConfig.tsx
│   │       │   ├── AdminSystemHealth.tsx
│   │       │   └── admin_components/
│   │       │       ├── AdminAuditRecords.tsx
│   │       │       ├── AdminAuditRecordsTable.tsx
│   │       │       ├── AdminDashboard.tsx
│   │       │       ├── AdminDatabase.tsx
│   │       │       ├── AdminMonitoring.tsx
│   │       │       ├── AdminSystemConfig.tsx
│   │       │       ├── AdminSystemConfigurationTable.tsx
│   │       │       ├── AdminSystemHealth.tsx
│   │       │       └── AdminSystemHealthTable.tsx
│   │       ├── registrar_pages/
│   │       │   ├── RegistrarAccountManagement.tsx
│   │       │   ├── RegistrarClassroomManagement.tsx
│   │       │   ├── RegistrarEscalations.tsx
│   │       │   ├── RegistrarScheduleIntegrity.tsx
│   │       │   ├── RegistrarStatisticsLogs.tsx
│   │       │   ├── RegistrarTimeSlotManagement.tsx
│   │       │   └── registrar_components/
│   │       │       ├── RegistrarAccountManagement.tsx
│   │       │       ├── RegistrarAccountManagementTable.tsx
│   │       │       ├── RegistrarDashboard.tsx
│   │       │       ├── RegistrarEscalations.tsx
│   │       │       ├── RegistrarScheduleIntegrity.tsx
│   │       │       ├── RegistrarStatisticsLogs.tsx
│   │       │       ├── RegistrarTimeSlotManagement.tsx
│   │       │       └── UserBookings.tsx
│   │       └── staff_pages/
│   │           ├── StaffBrowseAvailability.tsx
│   │           ├── StaffMyBookings.tsx
│   │           └── staff_components/
│   │               ├── BlockedAccount.tsx
│   │               ├── BookingForm.tsx
│   │               ├── StaffDashboard.tsx
│   │               └── TimeslotTable.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── App.css               # Global app styles
│   ├── App.test.tsx          # App test file
│   ├── App.tsx               # Main App component
│   ├── index.css             # Global styles
│   ├── index.tsx             # React DOM entry point
│   ├── logo.svg              # Application logo
│   ├── react-app-env.d.ts    # React TypeScript environment definitions
│   ├── reportWebVitals.ts    # Web Vitals monitoring
│   └── setupTests.ts         # Test setup configuration
└── tests/                    # Frontend tests
	├── AccountManagement.test.tsx
	├── AdminAuditRecordsTable.test.tsx
	├── AdminDashboard.test.tsx
	├── AdminPermissionsTable.test.tsx
	├── AdminSystemConfigurationTable.test.tsx
	├── AdminSystemHealthTable.tsx
	├── App.routes.test.tsx
	├── AuthContext.test.tsx
	├── genericPage.test.tsx
	├── Login.test.tsx
	├── ProtectedRoute.test.tsx
	├── RegistrarAccountManagementTable.test.tsx
	├── registrarpages.test.tsx
	├── setup-vitest.ts
	├── Staffpages.test.tsx
	├── test-utils.tsx
	├── TimeslotTable.test.tsx
	└── UserBookings.test.tsx

```


## Notable Libraries

- `recharts` → for charts and graphs
- `axios` → for API calls to backend
- `react-router-dom` → for client-side routing

## Pages Overview

| Page | Description |
|------|-------------|
| AdminAuditRecords.tsx | Admin view for audit records |
| AdminDatabase.tsx | Admin view for database navigation and actions |
| AdminMonitoring.tsx | Admin monitoring dashboard |
| AdminPermissions.tsx | Admin can manage and block user permissions |
| AdminScheduleIntegrity.tsx | Admin page for schedule validation |
| AdminSystemConfig.tsx | Admin system configuration dashboard |
| AdminSystemHealth.tsx | Admin system health dashboard |
| RegistrarAccountManagement.tsx | Registrar account management interface |
| RegistrarClassroomManagement.tsx | Registrar classroom management |
| RegistrarEscalations.tsx | Registrar escalation handling |
| RegistrarStatisticsLogs.tsx | Registrar statistics and logs dashboard |
| RegistrarTimeSlotManagement.tsx | Time slot management for registrar and staff |
| StaffBrowseAvailability.tsx | Staff view to browse availability |
| StaffMyBookings.tsx | Staff view of personal bookings |

