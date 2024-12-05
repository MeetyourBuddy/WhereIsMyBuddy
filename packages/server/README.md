# Where is my buddy server

A robust backend service built with NestJS and MongoDB, providing RESTful APIs and database operations.

## Tech Stack

- [NestJS](https://nestjs.com/) - A progressive Node.js framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- [TypeScript](https://www.typescriptlang.org/) - Programming language

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6.0 or higher)
- npm

## Environment Variables

Create a `.env` file in the root directory:

Obtain the following environment variables from the project owner:

```env
MONGO_URI
JWT_REFRESH_SECRET
JWT_ACCESS_SECRET
CORS_ORIGIN
PORT
```

## Installation

Navigate to the './packages/server/' directory and install the dependencies:

```bash
npm install
# or
yarn install
```

## Running the Server

To start the server in development mode:

```bash
npm run start:dev
# or
yarn start:dev
```

To start the server in production mode:

```bash
npm run start:prod
# or
yarn start:prod
```
