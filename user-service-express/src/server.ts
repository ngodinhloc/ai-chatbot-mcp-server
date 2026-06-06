import 'reflect-metadata';
import { createApp } from './app';
import { AppDataSource } from './database/data-source';
import { env } from './config/env';

async function bootstrap() {
  await AppDataSource.initialize();
  console.log('Database connected');

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`User service running on port ${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
