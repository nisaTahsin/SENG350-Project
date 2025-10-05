## Overview 
This test plan summarizes implemented test coverage for the React Frontend (Vitest + React Testing Library) and the NestJS Backend (Vitest + @nestjs/testing).
The system under test is a classroom booking platform involving authentication, role-based dashboards, bookings, and administrative workflows.
Testing validates both functional requirements (e.g., booking creation, cancellation, UI rendering) and non-functional quality attributes (accuracy, security, modifiability, reliability, and visibility).
<br><br>
##Phased Testing Strategy
- **Initial Phase:** \
•	Smoke testing of dashboards, routing, and rendering.
•	Unit testing of isolated React components and booking service logic.
•	Input validation and search/filter correctness.
<br><br>

- **Middle Phase:** \
•	Integration of modals, booking operations, and role-based actions.
•	Authentication and authorization behavior validation.
•	Backend integration tests for DI and logic consistency.
<br><br>

- **Final Phase:** \
•	Full-stack end-to-end (E2E) flow validation across frontend + backend.
•	Regression assurance post-refactor.
•	Stress and concurrency testing for booking accuracy and performance.
<br>

**Quality Attribute 1** - _Accuracy_ \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Scenario 1.1 **: “Admin Audit Filter”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;“Given audit logs are displayed, when the user types in the search field, only matching entries remain visible.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: UI Behavior (Unit)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Count rows before/after typing “delete”.\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: Filtered row count < original.\ <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Scenario 1.2** : “Admin System Configuration Editing”\
“Given the admin edits default configuration, the system presents the correct modal with editable fields.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: UI Integration\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Click “Edit” beside “Default Open Time.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: “Edit Configuration” modal heading appears.\ <br>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Scenario 1.3** : “Backend Booking Creation and Validation”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; “Given valid booking input, a record is created; missing input or double booking triggers exceptions.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: Backend Unit\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Call createBooking() with/without valid IDs, repeat for same slot.\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: Valid to created; duplicate to ConflictException; missing tovalidation error.\ <br>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Scenario 1.4** : “Registrar Account Modal’\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; “Given a registrar filters users, the bookings modal for that user opens correctly.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: Frontend Integration\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Search for “ali” toclick “View Bookings.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: “Bookings for [User]” modal appears.\
<br>

**Quality Attribute 2 ** - _Security_ \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Scenario 2.1** : “Account Permissions Modal”\
“Given an admin views user accounts, clicking “Change Permissions” opens a secure role-edit modal.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: Frontend Integration\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Click role change button tocheck modal contents.\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: Role field and “Save” button visible.\ <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Scenario 2.2** : “Admin Role Editing”\
“When an admin updates a user’s role, the table reflects the updated value.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: UI Integration.\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Select “Admin” and click save.\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: Role column updates to “Admin.”\ <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Scenario 2.3**: “Unauthorized Cancellation”\
“When a user attempts to cancel a booking they don’t own, backend denies access.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: E2E (Backend Container)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: User B cancels booking by User A.\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: NotFoundException or forbidden error; record unchanged \ <br>
<br>**Quality Attribute 3** - _Visibility_ \

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
**Scenario 3.1** : “Dashboard Rendering”\
“Given the Admin Dashboard loads, management and audit action cards should be visible.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: Smoke / UI Rendering \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Render and query for headings like “Manage Users,” “Audit Records.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: All key headings present.\ <br>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Scenario 3.2** : “Staff Page Navigation”\
“Given staff navigates between pages, each renders appropriate headings.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: UI Smoke Tests
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Render each page (Browse Availability, My Bookings, Booking History).\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: Each page heading visible (“Browse,” “Bookings,” “History”).\ <br>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Scenario 3.3** : “Health Metrics Visibility”\
“Given system metrics are displayed, uptime and performance info are visible.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: Unit / Smoke Test\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Render table tocheck headings and “Last Updated.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: All sections visible; no render errors.\ <br>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Scenario 3.4 **: “Generic Page Title Visibility”\
“When a generic page is rendered, its title appears clearly.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: UI Utility / Unit\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Render GenericPage with a title prop.\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: Heading displays correctly.\ <br>

**Quality Attribute 4** - _Reliability_ \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Scenario 4.1** : “Booking Lifecycle (Create toCancel)”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;“Given a valid booking flow, cancellation transitions the record to “cancelled.””\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: E2E \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Create booking to call cancel toverify state.\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: Status updated; no residual locks or errors. \ <br>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Scenario 4.2** : “Double-Booking Prevention under Load”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;“When multiple users try booking the same slot, only one succeeds.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: Backend Unit / Concurrency\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Issue two parallel create requests for same slot.\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: One passes, other throws ConflictException.\ <br>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Scenario 4.3 **: “Integration Reliability (DI Check)”\
“When the NestJS module resolves the BookingService, DI setup works properly.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: Backend Integration (DI)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Create booking via TestingModule instance.\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: Successful creation; no DI errors.\ <br>


**Quality Attribute 5** - _Modifiability_ \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Scenario 5.1** : “Frontend Refactor Resilience”\
“When UI components change structure, regression tests remain valid.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: Regression\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Run full Vitest suite after refactor.\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Success: All tests pass; no broken queries or console errors.\ <br>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Scenario 5.2** : “Backend Schema Flexibility”\
“Given future room-capacity logic updates, service handles thresholds gracefully.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: Unit (Extendable Behavior)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Simulate room capacity and threshold limits.\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: Capacity rules validated without breaking existing logic.\
<br>

**Quality Attribute 6** - _Performance_ \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Scenario 6.1 **: “UI Responsiveness”\
“When admin or staff dashboards render, all visible elements appear within 2 seconds.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: Smoke + Render Time (Manual Benchmark)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Time-to-render measurement via testing library.\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: ≤ 2 seconds average render.\ <br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Scenario 6.2** : “Booking Throughput Simulation”\
“When simulating multiple booking requests, the backend remains stable.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: Concurrency Simulation (Backend)\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: 50+ sequential calls to booking service.\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: No crashes; consistent error handling.\

<br>
Quality Attribute 7 : Usability
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Scenario 7.1 **: “Table Accessibility”\
“Given tables (Audit, Permissions, Timeslots), all have valid roles and accessible labels.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: Accessibility / UI Unit \
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How: Query via getByRole('table') or getByRole('row').\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: No missing ARIA roles or unlabelled controls.\
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Scenario 7.2 **: “Interactive Modal Clarity”\
“When modals open (Change Permissions, Config Edit), controls are clearly labelled and actionable.”\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test Type: Frontend Integration\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success: Role fields and save buttons readable and usable.\
<br><br>
##Execution & Coverage
-	** **\
•	Frontend Coverage Target: ≥ 80% statements/branches.
•	Backend Coverage Target: ≥ 90% BookingService, 100% create/cancel/double-booking paths.
•	Tests executed via:
•	npx vitest run   # CI mode
•	npx vitest watch # Dev mode
<br><br>
##Outcome
-	**These test scenarios collectively confirm:**\
•	Accurate and consistent booking behavior across concurrent operations.
•	Secure and reliable handling of user roles and permissions.
•	Visible, responsive UI with accessible components.
•	Maintainable, modifiable architecture 

