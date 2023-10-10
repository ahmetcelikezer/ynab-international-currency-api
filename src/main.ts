import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const PORT = 3000;

  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}
bootstrap().catch((err) => console.error(err));
