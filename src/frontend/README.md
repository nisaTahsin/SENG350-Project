This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Project Structure

```
frontend/
├── public/                  # Static assets (index.html, favicon, images, title updates)
├── src/
│   ├── components/          # Reusable React components (admin & registrar dashboards)
│   ├── contexts/            # React contexts for state management
│   ├── pages/               # Application pages for routing
│   │   ├── AccountManagement.tsx
│   │   ├── AdminAuditRecordsTable.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminSystemConfigurationTable.tsx
│   │   ├── AdminSystemHealthTable.tsx
│   │   ├── BlockedAccount.tsx
│   │   ├── BookingForm.tsx
│   │   ├── Dashboard.css
│   │   ├── ErrorBoundary.tsx
│   │   ├── GenericPage.css
│   │   ├── GenericPage.tsx
│   │   ├── Login.css
│   │   ├── Login.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── RegistrarAccountManagementTable.tsx
│   │   ├── RegistrarDashboard.tsx
│   │   ├── RegistrarClassroomManagement.tsx
│   │   ├── RegistrarEscalations.tsx
│   │   ├── RegistrarScheduleIntegrity.tsx
│   │   ├── RegistrarStatisticsLogs.tsx
│   │   ├── RegistrarTimeSlotManagement.tsx
│   │   ├── StaffBrowseAvailability.tsx
│   │   ├── StaffDashboard.tsx
│   │   ├── StaffMyBookings.tsx
│   │   ├── TimeslotTable.tsx
│   │   └── UserBookings.tsx
│   ├── App.css               # Global app styles
│   ├── App.test.tsx          # App test file
│   ├── App.tsx               # Main App component
│   ├── index.css             # Global styles
│   ├── index.tsx             # React DOM entry point
│   ├── logo.svg              # Application logo
│   ├── react-app-env.d.ts    # React TypeScript environment definitions
│   ├── reportWebVitals.ts    # Web Vitals monitoring
│   └── setupTests.ts         # Test setup configuration
├── .gitignore                # React base ignores
├── Dockerfile                # Docker setup
├── README.md                 # Project documentation
├── package.json              # Project dependencies
├── package-lock.json         # Locked dependencies
└── tsconfig.json             # TypeScript configuration

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

