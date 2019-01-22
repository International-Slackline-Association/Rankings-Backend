# Rankings-Backend

Server-side client of [isa-rankings.org]

**Technical Overview:**

* The server-side is entirely designed to be `serverless` on AWS.
* Requires knowledge on followings
    * [Webpack]
    * [NestJS]
    * Typescript
    * [Serverless Framework] (with [Serverless-Offline] plugin)
    * AWS DynamoDB (main database)
    * AWS DynamoDB Streams
    * AWS Api Gateway
    * AWS Lambda
    * AWS CloudFormation (infrastructure as a code)
    * AWS IAM Management (user, roles, policies)
    * Redis (read through cache)

---

### Why `serverless`?

* **Pay as you go:** You only pay for the resources you actively use, not when they are sitting idle. Perfect for low|inconsistent traffic applications.
* **Costs:** Extremely **cheap** . This applications costs less than 3 dolar/month.
* **Maintenance & Operation:** You never manage infrastructure or any problem that comes with it. Only write the code and it works. Since its a volunteered project nobody wants to do anything but writing the application code

----

## Architecture Overview

![Architecture]

---

## DynamoDB - (Database Design)

**DynamoDB is designed in such a way (primary keys and sort keys) so that it supports all the query patterns this application needs. It has only a single table with aggregated GSIs, hierarchical SKs.**

In short, it is customized for application's access patterns.

***Overview of the table:***

### Main Table

| PK           | SK_GSI                                              | LSI            | GSI_SK           | ...Attributes |
| ------------ | --------------------------------------------------- | -------------- | ---------------- | ------------- |
| Athlete:{id} | AthleteDetails                                      |                | {normalizedName} | ...           |
| Athlete:{id} | Contest:{discipline}:{id}                           | Contest:{date} | {points}         | ...           |
| Athlete:{id} | Rankings:{year}:{discipline}:{gender}:{ageCategory} |                | {points}         | ...           |
| Contests     | Contest:{discipline}:{id}                           | Contest:{date} |                  | ...           |

**Possible Query Patterns:**

- Get details of athlete
- List contests of an athlete sorted by date
- Get a contest of an athlete
- Get a ranking of athlete
- Get details of a contest
- List details of contests sorted by date


### GSI Table

| GSI                                                 | SK               | PK           | ...Attributes |
| --------------------------------------------------- | ---------------- | ------------ | ------------- |
| AthleteDetails                                      | {normalizedName} | Athlete:{id} | ...           |
| Contest:{discipline}:{id}                           | {points}         | Athlete:{id} | ...           |
| Rankings:{year}:{discipline}:{gender}:{ageCategory} | {points}         | Athlete:{id} | ...           |

**Possible Query Patterns:**
- List details of athlete sorted by name
- List athletes of a contest sorted by points
- List athletes of a ranking sorted by points

---

# Getting Started

To start with, serverless installation must be completed on your local comptuter.

How to: [Installation Guide](https://serverless.com/framework/docs/providers/aws/guide/installation/)

There are 2 environment stages, therefore you should have valid credentials for them. Checkout the `secrets.example.yml` under `serverless` folder.
Replace the values with real ones

> For deployment `aws-cli` should be installed and configured with `Profiles` needed in the `serverless.yml` file. To get your credentials contact to ISA.

### Running on local

First, credentials are obtained from `.env` file. Replace the values in `.env.example` file with real ones depending on the stage you want to run (in `secrets.yml` you can see the stages)

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
[isa-rankings.org]: <https://www.isa-rankings.org>
[Architecture]: <docs/AWS_Architecture.png>
