import { injectable } from 'tsyringe';
import { JsonController, Get } from 'routing-controllers';
import { AppDataSource } from '../../database/data-source';

@injectable()
@JsonController('/health')
export class HealthCheckController {
  @Get('/')
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: AppDataSource.isInitialized ? 'connected' : 'disconnected',
    };
  }
}
