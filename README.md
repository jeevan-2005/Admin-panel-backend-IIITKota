# Express.js Backend Project

This project is an Express.js-based backend that provides core functionalities for handling announcements, events, and admin access. It features user authentication using JWT and two-factor authentication (2FA) via email OTP. The system distinguishes between two user roles: **Admin** and **SuperAdmin**, each with specific access and modification rights.

## Features

### 1. **/announcement Route**
- Retrieves and returns announcement data from the database in a predefined JSON format.
  
### 2. **/event Route**
- Retrieves and returns event data from the database in a predefined JSON format.
  
### 3. **/admin Route (Admin Panel)**
- **Admin Role**: Can view, add, edit, and delete entries in the Announcements table. Any changes will be reflected on the `/announcement` route.
- **SuperAdmin Role**: Has all Admin privileges, with additional control over the Events table. Changes are reflected on both `/announcement` and `/event` routes.

### 4. **User Authentication & Security**
- **JWT**: Implements robust authentication using JSON Web Tokens.
- **Password Hashing**: User passwords are hashed using bcrypt for enhanced security.
- **2FA**: Two-factor authentication via email OTP for secure login.
- **Role-based Access Control**: Two user roles (Admin and SuperAdmin) with distinct privileges.

## Tech Stack

- **Node.js**
- **Express.js**
- **bcrypt** (for password hashing)
- **JWT** (for user authentication)
- **nodemailer** (for email-based 2FA)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jeevan-2005/Admin-panel-backend-IIITKota.git
   ```
2. Install the dependencies:
    ```bash
    npm install
    ```
3. Create a .env file in the root directory and configure the following environment variables:
    ```bash
    PORT=your_port_number
    MONGO_URL=your_mongo_url
    CORS_ORIGIN=your_cors_origins
    
    ACCESS_TOKEN_SECRET=your_access_token_secret
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
        
    ACCESS_TOKEN_EXPIRE=your_access_token_expire
    REFRESH_TOKEN_EXPIRE=your_refresh_token_expire
    
    ACTIVATION_TOKEN_SECRET=your_activation_token_secret
    
    SMPT_HOST=your_smpt_host
    SMTP_PORT=your_smpt_port
    SMTP_SERVICE=your_smpt_service
    SMTP_USER=your_smpt_user
    SMTP_PASSWORD=your_smpt_password
    ```
4. Start the development server:
    ```bash
    npm run dev
    ```

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.
