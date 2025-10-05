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
The reduced scope will include all Staff features covered in the [Project Requirements Document](prd.md), but will omit almost all Admin and Registrar features.

For a more granular description of the specific features and requirements which were removed from Implementation I, as well as the motivation behind these decisions, see [Changes.md](Changes.md).
