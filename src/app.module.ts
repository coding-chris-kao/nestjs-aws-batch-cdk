import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BasicCommand } from './basic/basic.command';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [BasicCommand],
})
export class AppModule {}
