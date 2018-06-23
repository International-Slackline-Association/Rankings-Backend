# Rankings-Backend

Server-side client of ISA Rankings

**Technical Overview:**

* The server-side is entirely designed to be `Serverless` on AWS.
* Requires knowledge on followings
    * Required for local development and running
        * [Webpack]
        * [NestJS]
        * Typescript
        * AWS DynamoDB
        * AWS DynamoDB Streams
        * Redis
    * Required for deployment and infrastructure management
        * [Serverless Framework] (with [Serverless-Offline] plugin)
        * AWS Api Gateway
        * AWS Lambda
        * AWS CloudFormation (infrastructure as a code)
        * AWS IAM Management (user, roles, policies)


## Getting Started

Following npm packages are assumed to be installed globally

* typescript

To start with, serverless installation must be completed on your local comptuter.

Howto: [Installation Guide](https://serverless.com/framework/docs/providers/aws/guide/installation/)

> For deployment `aws-cli` should be installed and configured with `Profiles` needed in the `serverless.yml` file. To get your credentials contact to ISA.

### Running on local

Install dependencies

```shell
npm install
```

Start serverless-offline

```shell
npm start
```

API is served at `localhost:3000/`


[NestJS]: <https://github.com/nestjs/nest>
[Serverless-Offline]: <https://github.com/dherault/serverless-offline>
[Webpack]: <https://webpack.js.org/>
[DynamoDB]: <https://aws.amazon.com/dynamodb/>
[Serverless Framework]:<https://serverless.com/framework/docs/providers/aws/guide/quick-start/>