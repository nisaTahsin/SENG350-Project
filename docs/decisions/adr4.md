# Connection Between Frontend and Backend

## Status
Accepted

## Context
We need to choose an architecture style to connect our frontend and backend.

## Decision
We are using REST as our architecture style.

**Motivation**: 
- It uses standard HTTP methods, making it easy to understand and implement
- It is stateless and allows for greater scalability in the future
- It decouples the backend and frontend, allowing us to develop and test them independently of each other

**Tradeoffs**:
- Higher processing overhead as all context and authentication data must be sent with every request
- Less flexibility as standardized HTTP methods are being used 
- Lower performance when receiving updates frequently

## Consequences
- Higher latency when many users using the application at once
- Higher processing overhead for each request

**Linked Requirements**:
- [REQ-X-2](https://gitlab.csc.uvic.ca/courses/2025091/SENG350_COSI/teams/group_2_proj/-/issues/50)
- [REQ-S-6](https://gitlab.csc.uvic.ca/courses/2025091/SENG350_COSI/teams/group_2_proj/-/issues/9)
- [REQ-R-4](https://gitlab.csc.uvic.ca/courses/2025091/SENG350_COSI/teams/group_2_proj/-/issues/14)

