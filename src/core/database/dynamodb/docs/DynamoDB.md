## DynamoDB Design

### Main Table

| PK           | SK_GSI                                              | LSI            | GSI_SK           | ...Attributes                                                 |
| ------------ | --------------------------------------------------- | -------------- | ---------------- | ------------------------------------------------------------- |
| Athlete:{id} | AthleteDetails                                      |                | {normalizedName} | name, surname, birth, gender, country, ageCategory, createdAt |
| Athlete:{id} | Contest:{discipline}:{id}                           | Contest:{date} | {points}         | place                                                         |
| Athlete:{id} | Rankings:{year}:{discipline}:{gender}:{ageCategory} |                | {points}         | normalizedName, name, surname country, birthdate              |
| Contests     | Contest:{discipline}:{id}                           | Contest:{date} |                  | name, city, country, prize, category, profile, createdAt      |

**Possible Query Patterns:**
- Get details of athlete
- List contests of an athlete sorted by date
- Get a contest of an athlete
- Get a ranking of athlete
- Get details of a contest
- List details of contests sorted by date

---

### GSI Table

| GSI                                                 | SK               | PK           | ...Attributes                                                 |
| --------------------------------------------------- | ---------------- | ------------ | ------------------------------------------------------------- |
| AthleteDetails                                      | {normalizedName} | Athlete:{id} | name, surname, birth, gender, country, ageCategory, createdAt |
| Contest:{discipline}:{id}                           | {points}         | Athlete:{id} | place                                                         |
| Rankings:{year}:{discipline}:{gender}:{ageCategory} | {points}         | Athlete:{id} | normalizedName, name, surname country, birthdate              |

**Possible Query Patterns:**
- List details of athlete sorted by name
- List athletes of a contest sorted by points
- List athletes of a ranking sorted by points
