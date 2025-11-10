If you use AI tools different from Github Copilot, or you are not using the automated plugin to copy your Github copilot chats to this repository, you should  use this file to list the AI prompts you used, sorted by date. Wherever possible please also include links to chatlogs.

Sept. 18: I need to implement a classroom booking system. The roles and their descriptions are as follows: Staff: sign in; browse availability; create/cancel own bookings; view own history. Registrar: sign in; maintain classrooms/time slots; handle escalation (manual release or block abusive accounts if needed); view statistics/logs; manage schedule integrity. Admin: sign in; system-level configuration; view audit records and health; does not intervene in daily bookings. Given these roles and information, provide two examples of user stories

Sept. 19: How do I add architecturally significant requirements to my user stories? Give an example

Sept. 19: Comparison between postgresSQL and SQLite, with advantages and disadvantages

Sept. 19: how difficult is it to change a project from typescript to javascript?

Sept. 19: Why might we use Jest over Vitest or vice versa

Sept. 20: What are the trade-offs between choosing typescript or javascript for the frontend of a project?

Sept. 20: What subcategories can I create for Modifiability under a quality attribute requirements tree

Sept. 24: where do you put your test script in a project's files?

Sept. 29: Could you update genericpage to support children?

Sept. 29: Could you add a dropdown menu above the table to select buildings with?

Sept. 29: Could you have the bookings show up for whichever building is currently selected?

Sept. 29: How could I make it so the width of the times column is always the same across buildings?

Sept. 29: How can I automatically make the room columns fit to the length of the room names?

Sept. 29: how could I make a booking stretch across multiple time slots?

Sept. 29: Can you implement the Change Permissions button to bring up a pop up which allows me to change the user's role and edit whether they are disabled or not?

Sept. 29: Could you add the same interface from StaffMyBookings.tsx to a page that opens when the View Bookings button is pressed?

Sept. 29: How do I initialize a React project with TypeScript

Sept. 29: What’s the difference between npm start and npm run dev in a React

Sept. 29: Can you create a login page for me. And how do I make it the default page

Sept. 30: Can you create a different dashboard for each user typescript

Sept. 30: Can you create a page for x for user y (This got repeated a bunch of times with different users and pages)

Oct. 2: @workspace /explain FROM requires either one or three arguments

Oct. 4: Could you add a 'filter by time slot availability' function to StaffBrowseAvailability.tsx?

Oct. 4: Could you add a filter by date feature in StaffBrowseAvailability.tsx in the same format as the other filters?

Oct 4: How do I link the frontend and backend in Docker Compose?

Oct 4: How do I make sure the frontend connects to the backend running on a different port in Docker?

Oct 5: Can you create a form of authentication using JWT that ensures the user is in the database.

Oct. 28: How and where are the backend and frontend linked up currently? Which features are currently linked up?

Oct. 28: Is the backend setup for staff users to be able to cancel bookings? Is the backend setup for staff users being able to view their booking history?

Oct. 28: Could you fully implement the booking history endpoint?

Oct. 28: Can you link up this [booking history] endpoint to the frontend in the same way that User Authentication, Room Booking, and Room Availability Browsing are linked?

Oct. 28: Could you link this [booking cancellation] up to the frontend the same way you just did with the booking history feature?

Oct. 28: Which registrar user features are implemented in the backend and/or frontend respectively?

Oct. 28: How is account management for registrars implemented in the backend?

Oct. 28: Could you link up the backend and frontend for the following features (in the same way you have been with booking history and cancellation): Registrar user: Room/classroom management; Registrar user: Timeslot management; Registrar user: Account management

Oct. 28: Could you locate the implementation for the following features in the backend and frontend (if any): Registrar users: Force release booking; Registrar users: Booking escalation/approval

Oct. 28: Is the registrar feature: Statistics/logs fully implemented in the backend and frontend? Could you link up the backend and frontend for the Statistics/logs feature the same way you have been doing so far?

Oct. 28: Which specific admin features and endpoints are implemented currently? (backend and frontend)



Links to ChatGPT logs:
Oct. 1: https://chatgpt.com/share/68e33a5d-9a20-8002-aa74-fc14af4048b6

Oct. 3: https://chatgpt.com/share/68e2bf65-1254-8002-9450-dc747e737275

Oct. 5: https://chatgpt.com/share/68e3383e-7d78-8002-810b-bc9a83d86412

Oct. 5: https://chatgpt.com/share/68e2bf93-9ca0-8002-b7ff-337ebcc62727

Sept. 30: https://chatgpt.com/c/68de00cb-2d5c-832c-b096-2ac7036d9cdf

Oct. 4: https://chatgpt.com/c/68db12e8-534c-832e-a01b-396fd05ab47b

Oct. 17: Give a comprehensive description of the flow for the staff booking process

Oct. 19: Confirm whether or not the frontend and backend is connected by a REST architecture

Oct. 19: What are the benefits and downsides of using a REST architecture?

Nov 08: Can you display the class size on my bookings here?

Nov 08: Could you sort the bookings displayed by date? I would like it sorted earliest to latest

Nov 08: Is this file being used anywhere?

Nov 09: Can you update the file structure diagram in here to match the current file structure within frontend?

*Implementation 2
Help me implement audit logging in all services such as bookings.service, room.service etc, and change their respective controllers.

What is causing this error in registrar/accountManagement: "ERROR Cannot read properties of undefined (reading 'toLowerCase')"

How would you populate the Admin Permissions page with real user data from the database?

Which parts do I have to remove so that performance metrics and trends no longer show up in System Health for Admin

How would you redirect a blocked user attempting to log in and redirect them to a page that says: "Your account has been blocked..."?

How can you make it so that registrars can only view staff members on the Account Management page?

How can I filter by blocked users?

How do I resolve authentication errors when logging in as Admin and accessing the audit logs page?

How would I remove every instance of the Registrar/HandleEscalations dashboard piece?

Format requirements.md with proper heading and paragraph formatting

Under PostgreSQL database connection status for Database connectivity, put the last checked timestamp as the time when database is initialized successfully

Put a timestamp like in last updated for database connection last checked. do the same for the API endpoints, booking service, and system uptime for their last checked value

How do I remove the hardcoded data from the audit log

Why am I receving type any errors?

Receiving the following errors: Authentication token not found error, please log in again when logged in as Admin and accessing audit table page.

Errors in schema: system config changed should have role admin, role changed should have role registrar, account blocked should have role registrar. They are all showing up as staff currently

When logged in as staff and going to my bookings page, receiving 'not authenticated error' under 'view and manage your current bookings'

Check the API endpoints for authentication and ensure the frontend and backend are matching up for Admin and Staff

Remove authentication requirements for audit logs

