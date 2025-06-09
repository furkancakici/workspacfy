import pino from 'pino';

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport:
        process.env.NODE_ENV !== 'production'
            ? {
                  target: 'pino-pretty',
                  options: {
                      colorize: true,
                      translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
                      ignore: 'pid,hostname',
                      messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
                      hideObject: true,
                  },
              }
            : undefined,
});

export default logger;
