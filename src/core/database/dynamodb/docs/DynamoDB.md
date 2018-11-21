## DynamoDB Design

| PK           | SK_GSI                           | LSI                                | GSI_SK           | ...Attributes                                                                    |
| ------------ | -------------------------------- | ---------------------------------- | ---------------- | -------------------------------------------------------------------------------- |
| Athlete:{id} | AthleteDetails                   |                                    | {normalizedName} | name, surname, birth, gender, country, continent, ageCategory, createdAt         |
| Athlete:{id} | Contest:{year}:{discipline}:{id} | Contest:{year}:{discipline}:{date} | {point}          | rank                                                                             |
| Athlete:{id} | Rankings:{year}:{discipline}     |                                    | {point}          | gender, country, continent, ageCategory                                          |
| Contests     | Contest:{year}:{id}              | Contest:{year}:{date}              | {normalizedName} | name, city, country, totalPrize, prizeUnit, categories[], disciplines[], profile, createdAt |
| Contests     | Contest:{year}:{discipline}:{id} | Contest:{year}:{discipline}:{date} |                  | name, city, country, prize, prizeUnit, size                                                 |
