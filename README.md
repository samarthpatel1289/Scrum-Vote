# Scrum-Vote
The Scrum Voting Platform is a web application that allows a team to quickly and easily vote on tickets using the Fibonacci sequence. The platform provides a simple interface for creating a new room, inviting team members, and creating and voting on tickets.
## Technologies
The platform will be built using the MERN stack, which includes the following technologies:
•	MongoDB: A NoSQL database for storing data
•	Express: A web application framework for Node.js
•	React: A frontend JavaScript library for building user interfaces
•	Node.js: A server-side JavaScript runtime environment
## Features
### Room Creation and Management
•	A user can create a new room by providing the company name and a team name.
•	Upon room creation, a unique URL is generated for the room that can be shared with team members.
•	The creator can manage the room by adding or removing team members.
### Ticket Creation and Voting
•	The creator can create a new ticket by providing a brief description.
•	Once a ticket is created, the team members can vote on it using numbers from the Fibonacci sequence (1, 2, 3, 5, 8, 13, 21, 34, 55, 89).
•	A user can only vote once per ticket.
•	The votes are collected and displayed to all team members.
•	Once all team members have voted, the average vote is calculated and displayed to all team members.
### Ticket Management
•	The creator can end the session and close the room.
•	The creator can add a new ticket to vote on in a specific amount of time.
## User Flow
### Room Creation and Management
1.	The user navigates to the Scrum Voting Platform website.
2.	The user clicks on the "Create New Room" button.
3.	The user enters the company name and team name and clicks the "Create" button.
4.	The platform generates a unique URL for the room and displays it to the user.
5.	The creator shares the URL with team members.
6.	The creator can manage the room by adding or removing team members.
### Ticket Creation and Voting
1.	A team member navigates to the unique URL for the room.
2.	The team member enters their name and clicks the "Join" button.
3.	The team member can see all existing tickets and can vote on them using numbers from the Fibonacci sequence.
4.	The team member can only vote once per ticket.
5.	The team member can see the current vote count for each ticket and the average vote.
6.	Once all team members have voted, the average vote is displayed to all team members.
### Ticket Management
1.	The creator can end the session and close the room.
2.	The creator can add a new ticket to vote on in a specific amount of time.

