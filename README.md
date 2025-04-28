# BREET-BACKEND-API

Breet Backend API is a Node.js-based server application designed to handle shopping cart functionality, product management, and checkout processing. The API ensures efficient management of product inventory, user carts, and concurrent checkout processes using MongoDB for data storage and Redis for caching and distributed locking. This API handles stock quantities, prevents overselling, and optimizes operations to ensure smooth and consistent data at scale.

## Tech Stack

- **Node.js**: A runtime environment for executing JavaScript on the server side.
- **Express.js**: A minimalist web framework for building APIs.
- **MongoDB**: A NoSQL database for storing product and cart data.
- **Redis**: A fast, in-memory data store for caching and distributed locking.

## Core Features

- **User Management**: Allows creation of users and login of users for authorization token.
- **Product Management**: Allows creation, fetching, and update of products in the inventory.
- **Cart Management**: Users can add and remove items from their shopping cart, while ensuring data consistency.
- **Checkout Process**: Ensures accurate stock levels during checkout and prevents overselling.
- **Concurrency Handling**: Uses Redis to lock resources (cart) to handle concurrent requests and prevent race conditions.
- **Atomic Operations**: MongoDB is used to handle atomic updates to product stock and cart data.

## Installation

### 1. Clone the repository - git clone https://github.com/Onlygideon/breet-backend-task.git

### 2. Npm Install

### 3. Environment variables - env.example contains the required 5 env. If redis cloud details is causing an issue, use my tempoary redis details - REDIS_PASSWORD=eUUwCsaZjTcEMuOQ0vOmVZQHnBLEPQnK - REDIS_PORT=10201 - REDIS_URL=redis-10201.c91.us-east-1-3.ec2.redns.redis-cloud.com

### 4. Npm run dev

## Documentation

## Link to postman documentation: [Postman Documentation](https://documenter.getpostman.com/view/15715947/2sB2j1hCgP)
