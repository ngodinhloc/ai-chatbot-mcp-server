import { injectable } from 'tsyringe';
import pino from 'pino';

const pinoLogger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' },
  },
});

@injectable()
export class Logger {
  info(message: string, data?: unknown): void {
    pinoLogger.info(data ?? {}, message);
  }

  error(message: string, data?: unknown): void {
    pinoLogger.error(data ?? {}, message);
  }

  debug(message: string, data?: unknown): void {
    pinoLogger.debug(data ?? {}, message);
  }
}
