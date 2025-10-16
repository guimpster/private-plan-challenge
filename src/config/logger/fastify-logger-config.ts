import pino from 'pino';

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

// export default pino({
//   level: process.env.LOG_LEVEL ?? 'debug',
//   transport: {
//     target: 'pino-pretty',
//     options: {
//       colorize: true,
//       translateTime: dateTimeFormat,
//       ignore: 'hostname,filename,level',
//       messageFormat: (log, messageKey) => {
//         // If you want *your* date formatting, use dateformat here instead of translateTime:
//         // const ts = dateFormat(new Date(log.time), dateTimeFormat);
//         const ts = log.time; // already translated by translateTime
//         const ctx = (log as any).context;
//         return `[${appModule}] ${log.pid}\t - ${ts}   ${printContext(ctx)} ${log[messageKey]}`;
//       },
//     },
//   },
// });

export const fastifyPinoLogger = pino({
  level: process.env.LOG_LEVEL ?? 'debug',
  formatters: {
    // add a derived field that the transport can print
    log(obj) {
      const ctx = obj.context ? `[${obj.context}]` : '[FastifyServer]';
      return { ...obj, contextStr: ctx };
    },
  },
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: dateTimeFormat,
      // don't ignore fields you reference
      ignore: 'hostname',
      // must be a STRING when used via transport
      messageFormat: '[Fastify] {pid}\t - {time}   {contextStr} {msg}',
    },
  },
})