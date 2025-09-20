# Product Requirements Document


| Table of Contents                                                              |
| ------------------------------------------------------------------------------ |
| [1.0 Overview](prd.md#1.0 Overview)                                            |
| [2.0 Objectives and Goals](prd.md#2.0 Objectives and Goals)                    |
| [3.0 User Stories](prd.md#3.0 User Stories)                                    |
| [4.0 Functional Requirements](prd.md#4.0 Functional Requirements)              |
| [5.0 Quality Attribute Requirements](prd.md#5.0 Quality Attribute Requirements)|
| [6.0 Milestones & Deliverables](prd.md#6.0 Milestones & Deliverables)          |



## 1.0 Overview
<p>The goal of this project is to create a classroom booking application to support University of Victoria(UVic) staff to schedule classrooms and also support the cancellation when needed. Currently, classroom reservations are handled manually by the staff, an application can make it much easier and efficient.
<p>This system helps staff to directly browse available classes, reserve in real time, and only allows one successful booking for the same time slot. The application will also provide separate role-based interfaces for Staff, Registrars, and Administrators, each with different functionality. The application will also prevent double-bookings and view booking history. To ensure reliability and ease of deployment, the system will run in Docker containers and  include automated tests.

## 2.0 Objectives and Goals
<p>The primary objective of the Classroom Booking Tool is to streamline classroom reservations at UVic by providing a reliable, user-friendly, and decentralized booking system. This matters because it reduces administrative burden, increases efficiency and improves classroom utilization.
<p>We will strive to:

- **Guarantee Quality** \
Back all functional and non-functional requirements with acceptance tests, ensuring concurrency correctness, and responsiveness.
- **Improve Efficiency** \
Reduce delays from the current manual scheduling system by providing fast, responsive booking functionality.
- **Ensure Scheduling Integrity** \
Equip registrars with tools to resolve conflicts, manage room schedules and analyze booking patterns to ensure fair classroom allocation.
- **Support Long-Term Maintainability** \
Provide test plans, API specifications to facilitate future improvements and maintenance.
- **Promote Self-Service** \
Helps UVic staff to manage their own bookings, cancellations, and histories without any other intervention. 


## 3.0 User Stories
<p>The system must satisfy the following user stories. Each user story has a GitLab issue associated with it for management purposes. The GitLab issues contain further information on the user stories and their acceptance criteria. 

#### 3.1 Staff User Stories
- S-1: Staff can search classrooms using filters. [See Gitlab Issue #1]
- S-2: Staff can create bookings with conflict resolution. [See Gitlab Issue #6]
- S-3: Staff can view bookings by time to locate and cancel them. [See Gitlab Issue #20]

#### 3.2 Registrar User Stories
- R-1: Registrars can edit open hours of classrooms. [See Gitlab Issue #21]
- R-2: Registrars can view analytics of classrooms. [See Gitlab Issue #22]
- R-3: Registrars can view booking history of all classrooms, release holds and block accounts. [See Gitlab Issue #23]
- R-4: Registrars can view ratio of students compared to maximum capacity of classroom [See Gitlab Issue #24]

#### 3.3 Admin User Story
- A-1: Admins can view operation logs and a health page. [See Gitlab Issue #25]


## 4.0 Functional Requirements
The system must support the following functional requirements. Each requirement has a GitLab issue associated with it for management purposes. 

#### 4.1 Staff Requirements
- REQ-S-1: Staff must be able to sign in and out securely with proper privileges. [See Gitlab Issue #2]
- REQ-S-2: Staff must be allowed to browse availability of classrooms by filtering campus/building/room/date/time slot. [See Gitlab Issue #3]
- REQ-S-3: Staff must be able to reserve a classroom with a single click. [See Gitlab Issue #4]
- REQ-S-4: Staff are able to cancel their own bookings. [See Gitlab Issue #5]
- REQ-S-5: Staff can view their booking history and filter by time of booking. [See Gitlab Issue #8] 
- REQ-S-6: When two people compete for the same time slot, only one is given the classroom to ensure no double bookings. [See Gitlab Issue #9]
- REQ-S-7: State of bookings are clearly shown ie: successful bookings are given a success message, and failed ones are given a failure message. [See Gitlab Issue #10]

#### 4.2 Registrar Requirements
- REQ-R-1: Registrar must be able to sign in and out securely with proper privileges. [See Gitlab Issue #11]
- REQ-R-2: Registrars can maintain classrooms and time slots (ie: capacity of classrooms, when the classroom is available). [See Gitlab Issue #12]
- REQ-R-3: Registrars are able to handle escalation by releasing bookings or blocking abusive accounts found through logs or reports [See Gitlab Issue #13]
- REQ-R-4: Registrars can view system statistics and logs, this should contain at least one chart (displaying daily bookings or top N popular rooms) [See Gitlab Issue #14]
- REQ-R-5: Registrars ensure that rooms are maximized, minimizing half-full classrooms [See Gitlab Issue #15]

#### 4.3 Admin Requirements
- REQ-A-1:  Admin must be able to sign in and out securely with proper privileges. [See Gitlab Issue #16]
- REQ-A-2: Admin can view system health via a basic health page [See Gitlab Issue #17]
- REQ-A-3: Admin are able to access key operation logs, who made what change when [See Gitlab Issue #18]
- REQ-A-4: Admin are capable of system-level configuration, managing roles, design parameters, etc. [See Gitlab Issue #19]


## 5.0 Quality Attribute Requirements
~~~mermaid
flowchart LR
  Utility --> Performance
  Utility --> Accuracy
  Utility --> Visibility
  Utility --> Security
  Utility --> Modifiability
  Performance --> Data-latency
  Performance --> System-Load-Capacity
  Accuracy --> Update-Frequency
  Accuracy --> Consistency
  Visibility --> Internal-Logs
  Visibility --> Booking-State
  Security --> System-Security
  Security --> Data-Integrity
  Modifiability --> Availability-Hours
~~~


## 6.0 Milestones & Deliverables

|Milestone                  | Start date | End date | Duration | Deliverables |
|---------------------------|------------|----------|----------|--------------|
|Design I                   | 09-17-2025 |09-21-2025|  4 days  |<ul><li>Initial system architecture and wireframes.</li><li>Draft of database schema.</li><li>Preliminary API design.</li><li>Review and approval of requirements.</li></ul>
|Implementation I           | 09-22-2025 |10-05-2025| 13 days  |<ul><li>Core features for Staff role implemented (search classrooms, booking, cancellation).</li><li>Basic authentication system.</li><li>Early unit tests for core functionality.</li><li>Initial Docker environment setup.</li></ul>
|Design II                  | 10-06-2025 |10-26-2025| 20 days  |<ul><li>Enhanced designs for Registrar and Admin interfaces.</li><li>Finalized analytics dashboard design.</li><li>Updated architecture with scaling considerations.</li><li>Refined data flow diagrams and updated documentation.</li></ul>
|Implementation II          | 10-27-2025 |11-09-2025| 13 days  |<ul><li>Features for Registrar (analytics, editing schedules, viewing ratios).</li><li>Features for Admin (system health, operation logs, role management).</li><li>Integration of analytics dashboard.</li><li>Expanded automated test coverage.</li></ul>
|Refactoring                | 11-10-2025 |11-23-2025| 13 days  |Code cleanup and optimization.<ul><li>Bug fixing and performance improvements.</li><li>Finalize documentation for maintainability.</li><li>Conduct security and privilege manual testing.</li></ul>
|Reflection and Presentation| 11-24-2025 |11-30-2025| 6 days   |<ul><li>Final project report.</li><li>Demonstration of end-to-end functionality.</li><li>Retrospective and lessons learned.</li><li>Stakeholder presentation.</li></ul>


