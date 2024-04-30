# Backend EasyTask

## Project Description 📝

The `Backend EasyTask` repository contains the backend part of the EasyTask application, which is planned to be a Kanban board for organizing tasks. The project is currently under construction.

## Current Features 🖍️

- **User Registration and Login**: Allows users to register and log in, ensuring data integrity through extensive validation.
- **JWT-Based Authentication**: Manages secure sessions and authenticates requests using HTTP-only JSON Web Tokens.
- **Email Verification**: Sends verification emails at registration and allows users to resend these emails as needed.
- **Password Management**: Enables users to reset forgotten passwords and set new ones through a secure, token-based process.
- **Session Management**: Checks and manages user sessions to maintain secure access control.
- **Data Validation**: Uses Joi to rigorously validate all incoming data, ensuring correctness and security.
- **Testing**: Implements both unit and integration testing.

## Tech Stack 🖥️

- **Express** - A web application framework for Node.js, making it easier to create HTTP servers.
- **MongoDB** - A NoSQL database used for storing application data.
- **Mongoose** - A library for MongoDB object modeling in Node.js.
- **JWT (JSON Web Tokens)** - Used for authorization and information exchange between parties.
- **Joi** - A library for input validation, useful for checking the correctness of data sent to the server.
- **Nodemailer** - A module for Node.js that allows easy email sending.
- **Supertest** - A library for testing HTTP servers, commonly used for integration testing in Node.js applications.
- **Jest** -  used for unit and integration testing in Node.js applications.


## Architecture 🏛️
Backend EasyTask is designed using the Model-View-Controller (MVC) architectural pattern.

## Frontend

https://github.com/ArturPawelski/FE-easyTask
