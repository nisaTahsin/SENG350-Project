# Refactoring Reflection

## Documentation 7/10
- Project documentation contained incorrect information.  
  - uvic_rooms.csv was documented as being in the `docs` folder but was actually located in `data`.  
  - The backend README.md appeared to be a default NestJS template rather than a description of the project.
- There was no README.md file for the frontend.    
- These issues made it harder for the team to understand the system before refactoring.
- However, the README.md file in the root was well documented, with instructions on how to test the application and what features are present.

---

## Frontend 8/10

### Strengths
- The user-facing interface provides a clear and intuitive workflow for booking rooms.  
  - Filtering by time, room, and capacity is straightforward.  
- Confirmation and failure messages are displayed clearly.  
- Logs and analytics pages update correctly for admin and registrar roles.

### Challenges / Issues Noticed
- Variable names were occasionally vague (`a`, `b`, `rn`, `res`), reducing readability.  
- The lack of comments in most files made their logic harder to follow.

---

## Testing 9/10

### Strengths
- Core features are covered by the test suite such as classroom booking creation/deletion, user management, and logging.
- Test descriptions provided insight into expected behavior.

### Challenges
- Limited explanation and vague variable naming (e.g., `u`) reduced test readability.

---

## Backend 9/10

### Strengths 
- The service modules such as bookings.service and users.service were very well commented.
  - Uses consistently clear variable names.
  - Each step of the operations are explained, making the logical flow easy to understand.
- The controller modules include information about what operation each method is resposible for and what information is returned.
- Clear status codes with accompanying success/error messages.

## Code Smells Identified

### 1. Duplicated Logging Logic (Rooms Controller)
**Location:** `src/backend/src/rooms/rooms.controller.ts`

**Issue**
- Audit logging code was repeated across several methods: `create()`, `update()`, `delete()`, `uploadCSV()`, `deleteAll()`
- Each block used the same multi-step logging pattern.

**Refactoring Challenges**
- Required careful comparison of each repeated block to ensure identical behavior.  
- Increased risk of overlooking subtle variations.  
- Added verification workload due to the large number of copies.

### 2. Tight Coupling (Bookings Module)
**Location:**  
- Originally in `bookings.controller.ts`  
- Moved into `bookings.service.ts`

**Issue**
- Start/end time validation was implemented directly in multiple controller methods.  
- Controllers handled both request processing and business logic, violating the single responsibility principle.  
- Validation logic duplicated across endpoints.

**Refactoring Challenges**
- Required locating and comparing validation implementations across several controllers.  
- Moving logic to different file risked unintended behavioral changes.
