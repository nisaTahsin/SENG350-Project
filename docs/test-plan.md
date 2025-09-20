# Test Plan

## Overview (re-write in more formal language)
We will prioritize smoke testing initially (logging in functionality).
Stress testing for scenarios in the performance category, and unit testing for everything else. We will also use manual testing for security privileges. 
In the next implementation phase we will aim to do integration and system testing. 

## Phases
- Initial Phase: \
Smoke testing of critical functions such as login and booking workflows.
Unit testing of core components.
- Middle Phase: \
Stress testing for high-traffic scenarios (300–500 concurrent users).
Manual privilege and security testing.
- Final Phase: \
Integration and system-wide testing.
Regression testing to ensure stability after refactoring.

## Scenarios
**Scenario 1** - Security “Unauthorized users cannot cancel another user’s booking” \
Test type: Integration \
How: Create two users, user A books a room, user B tries to cancel via API, expect an error message \
Success: API returns error message and Database unchanged, User Interface hides or greys out the cancel button for other users. \
**Scenario 2** - Concurrency correctness “Two or more users tries to book the same room simultaneously, exactly one booking is created” \
Test type: Concurrency test(Automated) \
How: Run parallel clients ie: parallel request with same room, date, timeslot, within milliseconds of each other. Databases have only one row for that timeslot, success response for one client and error/conflict message for others. \
Success: Exactly one booking persisted, no deadlocks. \



