
# Database Technology

### Status
Proposed

### Context
We need to store classrooms, bookings, users, and audit logs. Concurrency correctness is a must, and there must be exactly one successful booking.

### Options
Either SQLite or PostgreSQL

### Decision
We are choosing PostgreSQL as the primary database for our project.

### Motivation
- PostgreSQL provides strong concurrency control, ensuring only one booking is successful per room/time slot.
- It supports custom datatypes, functions, and indexing methods.
- It offers scalability and reliability for high-traffic scenarios.
- Data integrity is better maintained compared to SQLite.

### Consequences
- Requires installation and configuration, which is not ideal for very small apps.
- Requires managing database migrations.
- Consumes more memory and CPU compared to SQLite.


