import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function bootstrap() {
  await CommandFactory.run(AppModule, {
    errorHandler: (error: any) => {
      if (/commander\..+/.test(error?.code)) {
        return;
      }
      console.error(error);
    },
  });
}

bootstrap();
