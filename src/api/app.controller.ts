import {
    Get,
    Controller,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    root() {
        // throw new HttpException(
        //     {
        //         status: HttpStatus.FORBIDDEN,
        //         error: 'This is a custom message',
        //     },
        //     403,
        // );
        return this.appService.root();
    }
}
