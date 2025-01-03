# Quest

**Microservice Architecture Showcase**

This project demonstrates the implementation of a microservice architecture for a web application. While database storage and API communication have not been integrated, the project aims to illustrate my knowledge of core concepts and structure of microservices. The microservices for this project were written in python, and a communication pipe to the frontend html was built using ZeroMQ and WebSockets

**Project Overview**
Quest is a website designed with a focus towards users with ADHD, taking a more 'gamified' approach to traditional to-do lists. 
Features:
- to-do list tasks are called Quests
- Homepage has a list of achievements that users can actively see progress towards, much like when playing a game
- Users can see a log of all completed quests along with some stats

**Microservices**
1) Username/Password generator - Generates a random username and password at the click of a button
2) Datetime - Returns the current date and time
3) Statistics - Calculates the average time taken to complete quests and the average number of quests completed per day
4) Achievements - Calculates and shows the progress towards completing an achievement

**Architecture Overview**
+-------------------+    +------------------+    +---------------------+   +---------------------+ 
|Credential Service |    | Stats Service    |    | Achievement Service |   |  DateTime Service   |
+-------------------+    +------------------+    +---------------------+   +---------------------+
        |                       |                          |                          |
        |                       |                          |                          |
        v                       v                          v                          v
                +---------------------------------------------------------------+
                |       Communication Bridge via WebSockets and ZeroMQ          |
                +---------------------------------------------------------------+
                                               |
                                               |
                                               v
                +---------------------------------------------------------------+
                |                    Frontend Application                       |
                +---------------------------------------------------------------+
