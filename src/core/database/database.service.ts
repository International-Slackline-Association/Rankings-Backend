import { Injectable, Inject } from '@nestjs/common';
import { DDBAthleteDetailsRepository } from './dynamodb/athlete.details/athlete.details.repo';

@Injectable()
export class DatabaseService {
    constructor(
        private readonly athleteDetailsRepo: DDBAthleteDetailsRepository,
    ) {}

    public test() {
        return this.athleteDetailsRepo.get('a');
        // return 'test';
    }
}
