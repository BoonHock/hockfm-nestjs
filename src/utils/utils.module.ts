import { Module } from '@nestjs/common';

@Module({})
export class UtilsModule {
  static getKlTimeNow(): Date {
    const klTime = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'ASIA/KUALA_LUMPUR' }),
    );
    return klTime;
  }
}
