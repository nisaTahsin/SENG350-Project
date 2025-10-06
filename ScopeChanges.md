# Scope Changes
This document details the changes in scope to the original design and client requirements due to time constraints.  

## Original Scope 
The scope of the project included numerous features for three users: staff, registrar, and admin. 
All users were to login from the same page and, depending on their permissions, complete various tasks described by user stories.
The entire project was to be made from scratch with no previous knowledge of most if not all parts of the development, while relying heavily on AI tools as a substitute for the experience and time required.

_The original scope of the project is detailed fully in the [Project Requirements Document](prd.md)._

## Challenges
The most frequent challenges were those encountered while trying to plan our approach for the project. 
This was mainly due to the aforementioned inexperience of our team. 
While we understand that the lack of guidance may have been intentional in the design of the project, we found that most of our progress was halted/slowed significantly, resulting in an inability to fully fulfill the initial project scope.

Out of all the challenges encountered however, the most time consuming was by far the docker and build tutorial from lab 3.
Two out of five group members spent almost all of our first week trying to get the CI/CD working, and as a result only ended up with a week to complete most of the rest of the implementation. 

## Reduced Scope
Our first general narrowing of the scope involved focusing primarily on staff functionalities. 
At the point in the development process when the scope changes where introduced we had already implemented the UI framework for most of the Admin features, and one of the Registrar features. 
However, since we were constrained by the deadline, we decided not to implement the backend functionality of these features.
The reduced scope will include all Staff features covered in the [Project Requirements Document](prd.md) except for booking history and booking cancellation, but will omit almost all Admin and Registrar features aside from login functionality.

### Ommited Requirements and User Stories
- REQ-R-2: Registrars can maintain classrooms and time slots [See GitLab Issue #12]
- User Story R-2: Registrars can view analytics of classrooms [See GitLab Issue #22]
- REQ-R-4: Registrars can view system statistics and logs [See GitLab Issue #14]
- User Story R-4: Registrars can view ratio of students compared to maximum capacity of classroom [See GitLab Issue #24]
- REQ-R-5: Registrars ensure that rooms are maximized [See GitLab Issue #15]
- REQ-R-3: Registrars are able to handle escalation by releasing bookings or blocking abusive accounts [See GitLab Issue #13]
- User Story R-3: Registrars can view booking history of all classrooms, release holds and block accounts [See GitLab Issue #23]
- User Story R-1: Registrars can edit open hours of classrooms [See GitLab Issue #21]
- REQ-A-3: Admin are able to access key operation logs [See GitLab Issue #18]
- REQ-A-2: Admin can view system health [See GitLab Issue #17]
- User Story A-1: Admins can view operation logs and a health page [See GitLab Issue #25]
- REQ-A-4: Admin are capable of system-level configuration, managing roles, design parameters, etc. [See GitLab Issue #19]

- REQ-S-5: Staff can view their booking history and filter by time of booking [See GitLab Issue #8]
- REQ-S-4: Staff are able to cancel their own bookings [See GitLab Issue #5]
- User Story S-3: Staff can view bookings by time to locate and cancel them [See GitLab Issue #20]

_For a more granular description of the specific features and requirements which were removed from Implementation I, as well as the motivation behind these decisions, see [Changes.md](Changes.md)._
