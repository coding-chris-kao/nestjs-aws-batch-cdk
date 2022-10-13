import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { BasicCommand } from './basic/basic.command';
import { winstonModuleFactory } from './common/winston.factory';

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRootAsync({
      useFactory: winstonModuleFactory,
    }),
  ],
  providers: [BasicCommand],
})
export class AppModule {}
