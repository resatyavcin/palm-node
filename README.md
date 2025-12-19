# 🌴 palm-node

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

![Logo](https://www.harpercrown.com/cdn/shop/articles/the-palm-tree-symbolism-and-spiritual-meaning-150011.jpg?v=1705950758&width=400)

A lightweight and secure Node.js microservice designed for authentication and authorization. Palm-node provides centralized user identity management, password handling, session control, and 2FA support, offering a scalable and reliable identity foundation for modern applications.

## Features

- Secure password hashing
- JWT-based authentication
- Refresh token rotation
- 2FA via email or SMS
- Role-based authorization
- PostgreSQL integration
- Modular architecture for microservice environments

## Services

### AuthService (`src/auth/auth.service.ts`)

Central authentication service. Manages user registration, login, token generation, and refresh operations.

**Features:**

- **register()**: Creates new user registration. Hashes password with bcrypt and saves to database
- **login()**: Handles user login. Validates password and returns token or temporary token based on 2FA status
- **generateTokens()**: Generates JWT access token and refresh token
- **refreshToken()**: Generates new access token and refresh token using refresh token (token rotation)

**Use Cases:**

- User registration operations
- Login and token acquisition
- Token refresh operations

### TfaService (`src/auth/tfa/tfa.service.ts`)

Two-factor authentication (2FA) management service. Provides TOTP-based 2FA support.

**Features:**

- **generate()**: Creates secret key and QR code for 2FA setup
- **turnOn()**: Enables 2FA and generates recovery codes
- **turnOff()**: Disables 2FA
- **verify2FA()**: Verifies 2FA code during login
- **getStatus()**: Checks user's 2FA status
- **Recovery Codes**: Backup codes that can be used when 2FA code is unavailable

**Security Features:**

- TOTP (Time-based One-Time Password) support
- QR code generation (Google Authenticator compatible)
- SHA-256 hashed recovery codes
- Temporary token usage tracking

**Use Cases:**

- 2FA setup and configuration
- 2FA verification during login
- 2FA management (enable/disable)

### PrismaService (`src/prisma/prisma.service.ts`)

PostgreSQL database connection and management service. Manages database operations through Prisma ORM.

**Features:**

- PostgreSQL connection management
- Prisma adapter usage (connection pooling)
- Automatic connection setup when module initializes

**Use Cases:**

- All database CRUD operations
- Database connection management
- Prisma Client access

### ProtectedService (`src/protected/protected.service.ts`)

Service for protected routes. Currently available as a placeholder.

**Use Cases:**

- Custom operations requiring authentication
- User-specific data operations

### AppService (`src/app.service.ts`)

Main application service. Used for basic application functions.

**Features:**

- **getHello()**: Returns a simple "Hello World" message

**Use Cases:**

- Application health checks
- Simple endpoints

## License

This project is licensed under the **Apache License 2.0**, allowing personal and commercial use with proper notice retention.
