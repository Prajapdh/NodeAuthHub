# NodeAuthHub
This project is an Express.js backend application designed to handle user authentication, session management, and product information management, with support for MongoDB database interactions and user validation.

## Technologies/Libraries Used
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js**: A minimal and flexible Node.js web application framework that handles routes, sessions, and middleware integration.
- **Mongoose**: MongoDB object modeling tool designed to work in an asynchronous environment for handling data models.
- **Passport.js**: Authentication middleware for Node.js, supporting local and Discord OAuth strategies.
- **bcrypt**: A library to help you hash passwords securely.
- **express-session**: Middleware to manage sessions using session cookies and persistent data stores.
- **express-validator**: Middleware for validating and sanitizing string inputs.
- **cookie-parser**: Middleware to parse cookies attached to the client request object.
- **connect-mongo**: Middleware to store session data in MongoDB to ensure sessions are not lost when the server restarts.

## Project Functionality
- **User Management**: Implements CRUD operations for user management, supports local array-based user management as well as MongoDB integration.
- **Session Management**: Utilizes cookies and MongoDB to manage sessions, ensuring persistent sessions across server restarts.
- **Authentication**: Includes local username and password authentication as well as Discord OAuth, with user session initialization and management.
- **Product Management**: Handles product listing and restricts access based on user session validation and authentication status.

## How to Run the Project
1. Ensure that MongoDB is installed and running on your local machine.
2. Clone the repository and navigate to the project directory.
3. Install dependencies:
   ```bash
   npm install
4. Set environment variables in a .env file:
    ```bash
    DATABASE_URL=your_mongodb_connection_string
    DISCORD_CLIENT_ID=your_discord_client_id
    DISCORD_CLIENT_SECRET=your_discord_client_secret
    DISCORD_REDIRECT_URI=your_redirect_uri
5. Start the server:
    ```bash
    node index.js
6. The server should be running on 'http://localhost:3000'.
