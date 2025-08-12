import pino from 'pino';
import pinoHttp from 'pino-http';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Ana logger
const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: isDevelopment
        ? {
              target: 'pino-pretty',
              options: {
                  colorize: true,
                  translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
                  ignore: 'pid,hostname',
                  hideObject: true,
              },
          }
        : undefined,
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        },
    },
});

// HTTP middleware logger
export const httpLogger = pinoHttp({
    logger,
    customLogLevel: function (req, res, err) {
        if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn';
        } else if (res.statusCode >= 500 || err) {
            return 'error';
        } else if (res.statusCode >= 300 && res.statusCode < 400) {
            return 'silent';
        }
        return 'info';
    },
    customSuccessMessage: function (req, res) {
        if (res.statusCode === 404) {
            return 'resource not found';
        }
        return `${req.method} [${res.statusCode}] -> ${req.url}`;
    },
    customErrorMessage: function (req, res, err) {
        return `${req.method} ${req.url} - ${err.message}`;
    },
});

export default logger;
