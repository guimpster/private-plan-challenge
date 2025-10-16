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

const pinoConfig = {
  prettyPrint: {
    ignore: 'pid,hostname,filename,level,time',
    translateTime: dateTimeFormat,
    messageFormat,
  },
};

export default pino(pinoConfig);
