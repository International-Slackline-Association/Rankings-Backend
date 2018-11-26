## DynamoDB Design

| PK                                                     | SK_GSI                                              | LSI                                | GSI_SK           | ...Attributes                                                            |
| ------------------------------------------------------ | --------------------------------------------------- | ---------------------------------- | ---------------- | ------------------------------------------------------------------------ |
| Athlete:{id}                                           | AthleteDetails                                      |                                    | {normalizedName} | name, surname, birth, gender, country, continent, ageCategory, createdAt |
| Athlete:{id}                                           | Contest:{year}:{discipline}:{id}                    | Contest:{year}:{discipline}:{date} | {points}         | place                                                                     |
| Athlete:{id}                                           | ContestByDate:{year}:{discipline}:{id}              | ContestByDate:{year}:{date}        | {points}         | place                                                                     |
| Athlete:{id}                                           | Rankings:{year}:{discipline}:{gender}:{ageCategory} |                                    | {points}         | normalizedName, name, surname country, continent                         |
| Contests                                               | Contest:{year}:{discipline}:{id}                    | Contest:{year}:{discipline}:{date} |                  | name, city, country, prize, prizeUnit, category, profile, createdAt      |
| Contests                                               | ContestByDate:{year}:{discipline}:{id}              | ContestByDate:{year}:{date}        |                  | name, city, country, prize, prizeUnit, category, profile, createdAt      |
