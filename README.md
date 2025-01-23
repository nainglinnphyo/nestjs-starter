# Nest.js Starter Kit

This starter kit provides a foundation for building scalable and maintainable server-side applications using Nest.js. It is designed to seamlessly integrate with Prisma Object-Relational Mapping (ORM) libraries for efficient data handling.

## Features

- **Nest.js Framework**: Utilizes the robust Nest.js framework for building scalable applications with TypeScript.
- **Prisma ORM Integration**: Seamless integration with Prisma ORM for efficient database operations.
- **Custom Exception Handling**: Implemented custom exceptions to handle errors gracefully.
- **Router Module**: the route path for a handler is determined by concatenating the (optional) prefix declared for the controller.
- **Exception Filters**: Added exception filters to centralize error handling and enhance application robustness.
- **Custom Decorators**: Included custom decorator functions to extend functionality and simplify common tasks.

## Prerequisites

- Node.js (version >= 14)
- npm or yarn

## Getting Started

1. Clone the repository:

```
git clone https://github.com/nainglinnphyo/nestjs-starter.git
cd nestjs-starter
```

2. Install Dependencies

```
npm install
# or
yarn install
```

3. Copy the example configuration file and edit with you credentials:

```
cp .env.example .env.development
```

4. migrate and generate type

```
yarn migrate:dev

#in production

yarn migrate:deploy

#and

npx prisma generate
```

5. Start the app

```
yarn start:dev
```

6. View Swagger documentation

Once the application is running, navigate to `/docs` to view the automatically generated Swagger documentation.

7. Docker Support
The Nest.js starter kit is also available on Docker for easier deployment and containerization.

  1. Pull the Docker Image
```
docker pull devvps/nest-starter
```
  2. Run the Docker Container

```
docker run --env-file .env -p 3000:3000  devvps/nest-starter
```
Mount local machine .env and this will start the application in a Docker container, accessible on port 3000.
