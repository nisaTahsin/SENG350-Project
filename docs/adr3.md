# Testing and Demo Tools

### Status
Proposed

### Context
We need to choose a testing framework compatible with our system.

### Options
Jest or Vitest.

### Decision
We are Jest for our testing framework

### Motivation
- This is widely compatible with NestJS, our entry layer and backend choice
- Much more documentation and higher user base
- Built in code coverage reports allow us to easily gauge our testing progress

### Consequences
- Slightly slower runtime compared to Vitest
- Not as lightweight
