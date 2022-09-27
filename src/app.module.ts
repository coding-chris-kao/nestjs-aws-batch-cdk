import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import { BasicCommand } from './basic/basic.command';

const { combine, timestamp, ms, printf } = format;
const consistentFormat = printf(({ level, message, timestamp, ms }) => {
  if (typeof message === 'object') {
    return `[${level}] ${timestamp} | ${JSON.stringify(message)} - ${ms}`;
  }
  return `[${level}] ${timestamp} | ${message} - ${ms}`;
});

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRoot({
      transports: [
        new transports.Console({
          format: combine(timestamp(), ms(), consistentFormat),
        }),
      ],
    }),
  ],
  providers: [BasicCommand],
})
export class AppModule {}
