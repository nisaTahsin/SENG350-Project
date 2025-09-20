# Test Plan

## Overview (re-write first paragraph in more formal language)
We will prioritize smoke testing initially (logging in functionality).
Stress testing for scenarios in the performance category, and unit testing for everything else. We will also use manual testing for security privileges. 
In the next implementation phase we will aim to do integration and system testing. 

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
**Scenario 1** - Security “Unauthorized users cannot cancel another user’s booking” \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test type: Integration \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Create two users, user A books a room, user B tries to cancel via API, expect an error message \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: API returns error message and Database unchanged, User Interface hides or greys out the cancel button for other users. \
<br>**Scenario 2** - Concurrency correctness “Two or more users tries to book the same room simultaneously, exactly one booking is created” \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test type: Concurrency test(Automated) \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Run parallel clients ie: parallel request with same room, date, timeslot, within milliseconds of each other. Databases have only one row for that timeslot, success response for one client and error/conflict message for others. \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: Exactly one booking persisted, no deadlocks. \



