import pino from 'pino';

/**
 * Logger for the application.
 * @param {string} name - The name of the logger.
 * @returns {pino.Logger} - The logger instance.
 */
export const baseLogger = pino({
    name: process.env.APP_NAME || 'logctx',
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
        },
    },
});
