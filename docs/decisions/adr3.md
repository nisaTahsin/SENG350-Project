# Testing and Demo Tools

## Status
Proposed

## Context
We need to choose a testing framework compatible with our system.

**Options**: Jest or Vitest.

## Decision
We are using Jest for our testing framework

**Motivation**: 
- This is widely compatible with NestJS, our entry layer and backend choice
- Much more documentation and higher user base
- Built in code coverage reports allow us to easily gauge our testing progress

**Tradeoffs**:
-Slower runmtime compared to Vistest
-Some modern features are easier to integrate with Vitest
-Not as leightweight

## Consequences
- Slightly slower runtime compared to Vitest
- Not as lightweight

**Linked Requirements**:
- [REQ-S-1](https://gitlab.csc.uvic.ca/courses/2025091/SENG350_COSI/teams/group_2_proj/-/issues/2)
- [REQ-S-6](https://gitlab.csc.uvic.ca/courses/2025091/SENG350_COSI/teams/group_2_proj/-/issues/9)
- [REQ-R-4](https://gitlab.csc.uvic.ca/courses/2025091/SENG350_COSI/teams/group_2_proj/-/issues/14)

