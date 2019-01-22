## DynamoDB Design

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

---

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
