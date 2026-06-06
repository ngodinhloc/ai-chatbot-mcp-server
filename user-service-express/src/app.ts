import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { useExpressServer } from 'routing-controllers';
import './container';
import { UserController } from './modules/users/controllers/user.controller';
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
    controllers: [UserController, HealthCheckController],
    defaultErrorHandler: false,
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
