import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function bootstrap() {
  await CommandFactory.run(AppModule, {
    errorHandler: (error: any) => {
      if (error?.code === 'commander.help') {
        return;
      } else if (error?.code === 'commander.unknownCommand') {
        return;
      }
      console.error(error);
    },
  });
}

bootstrap();
