# Booking Subsystem - Element Catalog

| Element               | Type       | Responsibilities  |
|-----------------------|------------|-------------------------|
| BookingController     | Component  | Exposes REST endpoints for creating, updating, cancelling, and fetching bookings (all/by room/by user) |
| BookingService        | Component  | Handles business logic, manages booking persistence, checks conflicts and permissions |
| Booking               | Entity     | Represents a booking record |
| User                  | Entity     | Represents a user; persisted in Database |
| Room                  | Entity     | Represents a room; persisted in Database |
| Timeslot              | Entity     | Represents a timeslot; persisted in Database |
| Database              | Component  | Stores bookings, users, rooms, and timeslots |
| BookingUI             | Component  | Interacts with BookingController endpoints for creating and viewing bookings |


## Diagram Legend

| Symbol | Meaning |
|---------|----------|
| Rectangle with `<<component>>` | **Component** - functional element providing behavior (controller, service, or UI) |
| Rectangle with `<<module>>` | **Module** - logical grouping of related components (e.g., NestJS module, React feature) |
| Rectangle with `<<entity>>` | **Entity** - database model |
| Arrow | **Dependency** - indicates “uses” or “calls” relationship between components |
| Cylinder | **Database** - represents data persistence layer |


## Reasoning
See [adr4.md](docs/decisions/adr4.md)
