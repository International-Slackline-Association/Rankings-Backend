import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'core/database/database.service';

@Injectable()
export class RankingsService {
  constructor(private readonly db: DatabaseService) {}
}
