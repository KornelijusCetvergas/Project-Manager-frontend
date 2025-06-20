Project Task Manager

A project management app built with React (Vite) and Java Spring Boot. Create projects, manage tasks, assign users, and set access levels.
Features

    Create and delete projects

    Add tasks and mark them done

    Assign users to projects

    Role-based access levels: OWNER, EDIT, DO, READ

    Uses JWT tokens for secure authentication

    Uses localStorage to store current user info

    API integration for backend operations

Tech Stack

    Frontend: React.js with Vite

    Backend: Java Spring Boot

    Database: MySQL

    Authentication: JWT tokens

Setup

    Run the backend (Java Spring Boot) server

    Run the frontend (React) app

    Make sure your MySQL database is configured correctly

Access Levels

    OWNER: Full control

    EDIT: Add/edit tasks and users

    DO: Mark tasks done

    READ: View only

API Endpoints

    GET /api/project/all — get all projects

    POST /api/task — create a task

    DELETE /api/project/{id} — delete a project

    PATCH /api/projectuser — update user access

Contribution

Feel free to fork, open issues, and submit pull requests.
