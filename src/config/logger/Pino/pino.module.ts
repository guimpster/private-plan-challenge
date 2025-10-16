import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

const dateTimeFormat = 'yyyy-mm-dd h:MM:ss TT';

const appModule = 'Fastify';
const printContext = (ctx) => (ctx ? `[${ctx}]` : '[FastifyServer]');

const messageFormat = (log, messageKey, logLevel) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const dateFormat = require('dateformat');
  return `[${appModule}] ${log.pid}\t - ${dateFormat(
    log.time,
    dateTimeFormat,
  )}   ${printContext(log.context)} ${log[messageKey]}`;
};

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: dateTimeFormat,
                  messageFormat,
                  ignore: 'pid,hostname,filename,level,time',
                },
              }
            : undefined,
        level: process.env.LOG_LEVEL || 'info',
        autoLogging: false, // disable automatic HTTP logs if needed
      },
    }),
  ],
})
export class PinoModule {}
