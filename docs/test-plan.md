# Test Plan

## Overview 
The testing strategy for this project will be conducted in progressive phases. In the initial stage, we will prioritize smoke testing to 
validate the stability of core features such as authentication and booking. This will ensure that the system is operational and ready for more detailed evaluation.
Subsequent phases will expand into unit, integration, concurrency, and stress testing, with selective manual testing applied to security and role-based privileges.
The overall goal is to verify that the classroom booking system meets both its functional requirements (e.g., bookings, cancellations, role-specific permissions) and 
non-functional requirements (e.g., concurrency correctness, security, acccuracy, modifiability).
Testing will be iterative, with early tests focusing on correctness and later stages targeting performance and regression after refactoring.

- **Initial Phase:** \
Smoke testing of critical functions such as login and booking workflows.
Unit testing of core components. <br><br>
- **Middle Phase:** \
Stress testing for high-traffic scenarios (300–500 concurrent users).
Manual privilege and security testing. <br><br>
- **Final Phase:** \
Integration and system-wide testing.
Regression testing to ensure stability after refactoring.

## Scenarios
**Scenario 1** - Security “Given user A has a booking, when user B attempts to cancel it, then the system rejects the action and keeps the booking unchanged” \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test type: Integration test \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Create two users, user A books a room, user B tries to cancel via API, expect an error message \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: API returns error message and Database unchanged, User Interface hides or greys out the cancel button for other users. \
<br>**Scenario 2** - Concurrency correctness “Given multiple users attempt to book the same room and time slot simultaneously, when their requests are processed, then exactly one booking is confirmed and all others are rejected” \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test type: Concurrency test(Automated) \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Run parallel clients ie: parallel request with same room, date, timeslot, within milliseconds of each other. Databases have only one row for that timeslot, success response for one client and error/conflict message for others. \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: Exactly one booking persisted, no deadlocks. \
<br>**Scenario 3** - Perfomance “Given the system is under peak usage, when a user searches for available classrooms, then the results are returned within 3 seconds” \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test type: Perfomance test \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Simulate 300+ users querying availability at once and measure response times for search requests. \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: 90% of queries complete within 3 seconds, no timeouts or system crashes occur. \
<br>**Scenario 4** - Modifiability “Given an administrator is logged in, when they update a classroom’s availability hours, then the system applies the changes immediately without requiring downtime" \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test type: System test \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Change a classroom’s close hours in the admin interface while users are actively booking. Attempt to book in the new range. \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: New availability rules are enforced immediately, bookings outside the updated hours are rejected, and in-range bookings succeed.



