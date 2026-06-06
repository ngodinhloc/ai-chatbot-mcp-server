import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { useExpressServer } from 'routing-controllers';
import './container';
import { ChatController } from './modules/chat/controllers/chat.controller';
import { HealthCheckController } from './modules/health/health.controller';
import { notFound } from './common/middleware/not-found';
import { errorHandler } from './common/middleware/error-handler';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  useExpressServer(app, {
    routePrefix: '/api',
    controllers: [ChatController, HealthCheckController],
    defaultErrorHandler: false,
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
