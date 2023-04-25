import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // let obj = {
    //   stage: process.env.STAGE,
    //   type: 'postgres',
    //   autoLoadEntities: true,
    //   synchronize: true,
    //   host: this.configService.get('DB_HOST'),
    //   port: this.configService.get('DB_PORT'),
    //   username: this.configService.get('DB_USERNAME'),
    //   password: this.configService.get('DB_PASSWORD'),
    //   database: this.configService.get('DB_DATABASE'),
    // };
    return `Hello ${process.env.STAGE}`;
    // return JSON.stringify(obj);
  }
}
