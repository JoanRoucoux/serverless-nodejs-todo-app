# Serverless Todo App - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/) and based on the repository [serverless-todo](https://github.com/s-barrah/serverless-todo) of Sidney Barrah.

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Architecture

![serverless-nodejs-todo-app](https://user-images.githubusercontent.com/21682157/141646223-199307e4-2dc1-4862-8441-af56db1c698c.jpg)

## Installation

You will need the following packages installed locally,

- AWS CLI
- Node JS (8 or higher)
- NPM

## Local Development

Before starting local development you will need to run a couple of commands in separate bash windows,

```bash
npm install -g serverless
npm install
serverless dynamodb install
```

This will install DynamoDB locally.

Note: If you're running `aws` for the first time, run `aws configure` once to avoid errors.

You will need to setup environment variables, to do this create a `.env` file.

You can start the local DynamoDB, migrate tables and simulate lambda and API endpoints locally using
the following command.

```bash
serverless offline start
```

Open a browser and go to the url [http://localhost:8008/shell](http://localhost:8008/shell) to access the web shell for dynamodb local.

See more information on [DynamoDB Local](https://www.npmjs.com/package/serverless-dynamodb-local) advanced options and configuration.

#### Local Endpoints

`POST create todo -`
[http://localhost:3000/dev/todo/create](http://localhost:3000/dev/todo/create)

`POST delete todo -`
[http://localhost:3000/dev/todo/delete](http://localhost:3000/dev/todo/delete)

`POST Get todo -`
[http://localhost:3000/dev/todo](http://localhost:3000/dev/todo)

`POST update todo -`
[http://localhost:3000/dev/todo/update](http://localhost:3000/dev/todo/update)

You can deploy the entire service via CloudFormation by running the following command.

```bash
serverless deploy
```

#### Remote Endpoints

`POST create todo -`
[https://API_GATEWAY_ID.eu-west-3.amazonaws.com/dev/todo/create](https://API_GATEWAY_ID.eu-west-3.amazonaws.com/dev/todo/create)

`POST delete todo -`
[https://API_GATEWAY_ID.eu-west-3.amazonaws.com/dev/todo/delete](https://API_GATEWAY_ID.eu-west-3.amazonaws.com/dev/todo/delete)

`POST Get todo -`
[https://API_GATEWAY_ID.eu-west-3.amazonaws.com/dev/todo](https://API_GATEWAY_ID.eu-west-3.amazonaws.com/dev/todo)

`POST update todo -`
[https://API_GATEWAY_ID.eu-west-3.amazonaws.com/dev/todo/update](https://API_GATEWAY_ID.eu-west-3.amazonaws.com/dev/todo/update)

Once you finished interacting with the services, you can delete the stack by running this command.

```bash
serverless remove
```
