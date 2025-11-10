# UVic Classroom Booking System Requirements

## Staff Requirements

### REQ-S-1: Secure Authentication
Staff must be able to sign in and out securely with proper privileges.

This requirement states that staff should be able to securely sign in and out of the system with proper privileges.

### REQ-S-2: Browse Classroom Availability
Staff must be allowed to browse availability of classrooms by filtering campus/building/room/date/time slot.

This staff requirement means that staff can navigate through different classrooms, checking availability, by filtering through campus/building/room/date/time slot.

### REQ-S-3: Single-Click Reservation
Staff must be able to reserve a classroom with a single click.

This requirement means that once a staff member has found a classroom they would like to book, they are able to book the class with a single click.

### REQ-S-4: Cancel Own Bookings
Staff are able to cancel their own bookings.

This requirement allows staff members who, for whatever reason and so long as it's before the booking time, are able to cancel their own bookings.

### REQ-S-5: View Booking History
Staff can view their booking history and filter by time of booking.

This requirement means that staff should be able to view their current and past bookings and filter by the time of the booking.

### REQ-S-6: Prevent Double Bookings
When two people compete for the same time slot, only one is given the classroom to ensure no double bookings.

Only one staff member should be able to reserve a classroom for the same time slot to prevent double bookings.

### REQ-S-7: Clear Booking Status
State of bookings are clearly shown ie: successful bookings are given a success message, and failed ones are given a failure message.

The system should clearly indicate the result of booking attempts, showing success or failure messages.

## Registrar Requirements

### REQ-R-1: Secure Authentication
Registrar must be able to sign in and out securely with proper privileges.

Registrars must be able to securely sign in and out with proper privileges to access higher privileges functions.

### REQ-R-2: Maintain Classrooms and Time Slots
Registrars can maintain classrooms and time slots.

Registrars should be able to maintain classrooms and manage time slots, including capacity and availability.

### REQ-R-3: Handle Escalations
Registrars are able to handle escalation by releasing bookings or blocking abusive accounts.

Registrars must handle escalations by releasing bookings or blocking accounts that violate system policies.

### REQ-R-4: View System Statistics and Logs
Registrars can view system statistics and logs.

Registrars should be able to view system statistics and logs, including charts of daily bookings or popular rooms.

### REQ-R-5: Maximize Room Usage
Registrars ensure that rooms are maximized.

Registrars can ensure efficient room usage, minimizing underutilized or half-full classrooms.

## Administrator Requirements

### REQ-A-1: Secure Authentication
Admin must be able to sign in and out securely with proper privileges.

Admins must be able to securely sign in and out with correct privileges to manage system-level functions.

### REQ-A-2: View System Health
Admin can view system health.

Admins should be able to view overall system health on a basic dashboard or health page.

### REQ-A-3: Access Operation Logs
Admin are able to access key operation logs.

Admins must have access to logs showing who made changes, when, and what was modified.

### REQ-A-4: System Configuration
Admin are capable of system-level configuration, managing roles, design parameters, etc.

Admins should be able to configure system-level settings, manage roles, and adjust design parameters.

## Extended Requirements

### REQ-EX-1: AI Agent Integration (MCP)
AI Agent (MCP) can autonomously book rooms.

Integrate a Model Context Protocol (MCP) capability that allows an AI agent to interact directly with the booking system. The agent can query room availability, apply constraints (e.g., time, capacity, equipment), and automatically create or modify bookings within authorized limits.

### REQ-EX-2: External API Integration
External API endpoint for third-party integrations.

Expose a secure REST API that external systems can use to access room availability, booking data, and scheduling endpoints.

