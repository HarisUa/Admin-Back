# Betfan admin backend

> Backend server which works for admin api

This server serves admin request. Using this server admin can do CRUD operations on various CMS contents. This project is been developed using [Nestjs](https://docs.nestjs.com/)

## Getting started

Before starting checkout into `master` branch for Production and `development` branch for Development environment.

You need to install node >= v14 to run server as intended.
### Initial Configuration

Type below command for install dependecies for building/running project

```shell
npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Environment Configurations

We will use [dotenv](https://www.npmjs.com/package/dotenv) package for environment variable configurations.

Note:- Do not commit `.env` file to repository.