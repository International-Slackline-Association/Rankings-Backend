import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'core/database/database.service';

@Injectable()
export class AppService {
  constructor(private readonly db: DatabaseService) {
    this.db = db;
  }

  root() {
    return this.db.test();
    // return 'Hello World!';
  }
}
