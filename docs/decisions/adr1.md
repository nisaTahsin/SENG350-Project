# Frontend Scripting Language
## Status
Proposed

## Context
We need to choose a scripting language for our frontend which will be both reliable and scalable in order to fulfill frontend requirements (e.g. system logic and UI consistency).

**Options**: Either TypeScript or JavaScript with either React or next.js.

## Decision
We are choosing TypeScript with React for our frontend.

**Motivation**: 
- We can use TypeScript for our entry layer and backend as well, which will help keep languages consistent across the project.
- TypeScript has more scalability compared to JavaScript.
- React has less of a learning curve and is ideal for smaller projects.

**Tradeoffs**:
- Scalability & Performance\: TypeScript scales better than JavaScript.
- Developement speed & Learning curve\: TypeScript has a steeper learning curve and choosing it might slow developement speed in comparison to choosing JavaScript.
- Debugging & Refactoring\: TypeScript generally has less runtime errors and errors are easier to trace due to stricter typing compared to JavaScript (which generally has more runtime errors which are more difficult to trace).

## Consequences
- Changing over to JavaScript would be relatively time consuming if it becomes necessary. 
- Since TypeScript is stricter in its typing we should have an easier time debugging/testing the code.
- The learning curve for TypeScript will be steeper but in return we should gain more scalibility and reliability. 

**Linked Requirements**:
- REQ-S-3: Staff must be able to reserve a classroom with a single click. [See Gitlab Issue #4]
- REQ-S-6: When two people compete for the same time slot, only one is given the classroom to ensure no double bookings. [See Gitlab Issue #9]
- REQ-S-7: State of bookings are clearly shown ie: successful bookings are given a success message, and failed ones are given a failure message. [See Gitlab Issue #10]
