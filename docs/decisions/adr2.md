
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
- Offers scalability and reliability for high-traffic scenarios.
- Data integrity is better maintained compared to SQLite.

### Tradeoffs
- Scalability & Performance\: PostgreSQL scales to many users and large datasets. SQLite is simpler but not suitable for simultaneous multi-user booking scenarios.
- Data integrity & Reliability\: PostgreSQL supports constraints, foreign keys, and transactional guarantees. SQLite is lightweight but provides weaker guarantees in multi-user environments.
- Concurrency correctness\: PostgreSQL enforces row locking, ensuring correctness under concurrent booking attempts. SQLite is prone to system likely to have delays or conflicts because many concurrent writes are waiting on each other to finish and cannot be reliable.


### Consequences
- Requires installation and configuration, which is not ideal for very small apps.
- Requires managing database migrations.
- Consumes more memory and CPU compared to SQLite.

### Linked Requirements
- [REQ-R-2: Maintain classrooms and time slots](https://gitlab.csc.uvic.ca/courses/2025091/SENG350_COSI/teams/group_2_proj/-/issues/12)
- [REQ-A-3: Access audit logs](https://gitlab.csc.uvic.ca/courses/2025091/SENG350_COSI/teams/group_2_proj/-/issues/18)
- [REQ-S-6: No double bookings](https://gitlab.csc.uvic.ca/courses/2025091/SENG350_COSI/teams/group_2_proj/-/issues/9)









