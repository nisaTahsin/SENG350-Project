# Due Diligence Report

## 1.0 Project Choice Rationale 

We chose this project initially because two of our members know some of the members from group 10. Before finalizing our decision we had a discussion with some of the members of group 10 about the quality of their code and we performed an inspection of the general project structure. Based off of the discussion and inspection we found:

**Project organization:**
From our inspection of the codebase we found that the file structure seemed to be fairly organized.

**Documentation:**
The documentation seemed to be decent in the frontend with a few inconsistencies. However, the backend had thorough documentation, great variable naming, and easily understandable/readable code. The quality of the backend code was a great motivator in choosing this project.

**Tests:**
The testing seemed fairly thorough and ran without issue. 

These factors as well as the presence of some code smells which would be easy to refactor led us to choose this project for refactoring.

### 1.1 Code Quality Evaluation


#### 1.1.1 Comments and Documentation
The project contains generally good comments, especially in the backend. 
Many functions include descriptive comments that clarify the purpose of parameters and return values. 
The backend is structured using idiomatic NestJS patterns and the clear naming conventions help reduce cognitive load. 
While the frontend documentation is uneven, the overall structure remains understandable. 
Architectural explanations are present through the module layout and folder organization, though the project would benefit from a dedicated high-level README describing system interactions.


#### 1.1.2 Evaluation with SonarQube
Using SonarQube, we identified several quality issues consistent with our manual review. 
The most significant finding was duplicated code within the room-management controller, where multiple methods replicated similar logging logic. 
SonarQube also reported elevated cognitive complexity in booking-related logic due to repeated time-validation checks dispersed across several files. 
Additional minor issues such as unused variables and small formatting inconsistencies were noted but were not impactful. 
Overall, SonarQube confirmed that the project is structurally sound but contains refactoring opportunities around duplication and complexity.


#### 1.1.3 Developer Capability 
The original developers demonstrated strong knowledge of both React and NestJS. 
The backend shows consistent separation of concerns, appropriate use of dependency injection and thoughtful DTO validation. 
The breadth and reliability of the test suite further highlight the developers familiarity with good engineering practices. 
Despite some inconsistencies in frontend documentation, the implementation reflects a clear understanding of modern development frameworks. 
The code smells present appear to be normal artefacts of project timelines rather than signs of inexperience.


## 2.0 Refactoring

This section contains the two areas of the code which were refactored along with the rationale and evidence to backup the changes.

### 2.1 Smells Targeted and Rationale

#### 2.1.1 Duplicated Code

##### Issue and Motivation for Change

There is a repeated section of code in the form of room logging functionality in the backend. This smell is an issue because:
- Changing any one instance of this duplicated code means going around and changing all other instances, which is error prone
- The modifiability and maintainability of the project is automatically lowered by not having this repeated code in a method 

##### Solution

The best solution to code duplication is to extract a method. For this smell we extracted the repeated lines into the method `logRoomAction()`.

##### Evidence

**Locations of duplicated code:**
- create() method (lines 53-75 in original)
- update() method (lines 100-127 in original)
- delete() method (lines 146-164 in original)
- uploadCSV() method (lines 201-211 in original)
- deleteAll() method

**Method Signature:**
The extracted method `logRoomAction()` has the following method signature:

```typescript
private async logRoomAction(
    action: string,
    targetId: number | string,
    actorName: string,
    details: string,
    before?: any,
    after?: any
): Promise<void>
```


#### 2.1.2 High Parameter Coupling

##### Issue and Motivation for Change

There is scattered time validation logic throughout the code which results in tight coupling. This smell is an issues because:
- It is difficult to test
- The controller is complex
- The logic is not consistent/centralized.

##### Solution

The solution to this smell is to abstract a common service. Doing so will allow for easier testing, lower complexity, and centralized logic. In this case we added a new service method `validateBookingTimes()`.

##### Evidence

**Locations of tightly coupled code:**
- `src/backend/src/bookings/bookings.service.ts`
- `src/backend/src/bookings/bookings.controller.ts`


**Method Signature:**
The created service method `validateBookingTimes()` has the following method signature:

```typescript
validateBookingTimes(startStr: string, endStr: string): [Date, Date]
```

### 2.1.3 Evidence of Tests

The following output represents the test results before and after refactoring:

```bash
PS C:\group-2-re-10\src\backend> npm run test

> backend@0.0.1 test
> vitest


 DEV  v3.2.4 C:/group-2-re-10/src/backend

 ✓ test/logs.service.spec.ts (7 tests) 435ms
 ✓ test/users.service.spec.ts (15 tests) 411ms
 ✓ test/bookings.service.spec.ts (42 tests) 679ms
 ✓ test/bookings.controller.spec.ts (19 tests) 20ms
 ✓ test/rooms.controller.spec.ts (23 tests) 22ms
 ✓ test/users.controller.spec.ts (14 tests) 18ms
 ✓ test/auth.service.spec.ts (4 tests) 10ms
 ✓ test/roles.guard.spec.ts (7 tests) 10ms
 ✓ test/logs.controller.spec.ts (10 tests) 13ms
 ✓ test/health.controller.spec.ts (4 tests) 8ms
 ✓ test/health.service.spec.ts (5 tests) 9ms
 ✓ test/rooms.service.spec.ts (42 tests) 5462ms
   ✓ RoomsService > findAll > should return all rooms (large number)  754ms
   ✓ RoomsService > findByBuilding > should handle large numbers of rooms  531ms
   ✓ RoomsService > findByCapacity > should handle large numbers of rooms  509ms
   ✓ RoomsService > findByID > should handle large numbers of rooms  1272ms
   ✓ RoomsService > delete > should handle large numbers of rooms  843ms
   ✓ RoomsService > deleteAll > should delete all rooms from the database  782ms

 Test Files  12 passed (12)
      Tests  192 passed (192)
   Start at  10:04:38
   Duration  7.28s (transform 587ms, setup 0ms, collect 14.89s, tests 7.10s, environment 4ms, prepare 1.98s)

 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

