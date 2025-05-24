// src/ContextualLogger.ts
import { getContext } from './Context';
import { baseLogger } from './Logger';

/**
 * A class that provides a contextual logger.
 * The logger can be used to log messages with additional context.
 * @template T - The type of the context.
 */
export class ContextualLogger<T = any> {
    public get log() {
        const ctx = getContext();
        return {
            /**
             * Logs a message at the TRACE level.
             * @param msg The message to log.
             * @param meta Optional metadata to include in the log.
             * @returns The result of the logging operation.
             */
            trace: (msg: string, meta?: any) => baseLogger.trace({ ...ctx, ...meta }, msg),

            /**
             * Logs a message at the FATAL level.
             * @param msg The message to log.
             * @param meta Optional metadata to include in the log.
             * @returns The result of the logging operation.
             */
            fatal: (msg: string, meta?: any) => baseLogger.fatal({ ...ctx, ...meta }, msg),

            /**
             * Logs a message at the INFO level.
             * @param msg The message to log.
             * @param meta Optional metadata to include in the log.
             * @returns The result of the logging operation.
             */
            info: (msg: string, meta?: any) => baseLogger.info({ ...ctx, ...meta }, msg),

            /**
             * Logs a message at the ERROR level.
             * @param msg The message to log.
             * @param meta Optional metadata to include in the log.
             * @returns The result of the logging operation.
             */
            error: (msg: string, meta?: any) => baseLogger.error({ ...ctx, ...meta }, msg),

            /**
             * Logs a message at the WARN level.
             * @param msg The message to log.
             * @param meta Optional metadata to include in the log.
             * @returns The result of the logging operation.
             */
            warn: (msg: string, meta?: any) => baseLogger.warn({ ...ctx, ...meta }, msg),

            /**
             * Logs a message at the DEBUG level.
             * @param msg The message to log.
             * @param meta Optional metadata to include in the log.
             * @returns The result of the logging operation.
             */
            debug: (msg: string, meta?: any) => baseLogger.debug({ ...ctx, ...meta }, msg),
        };
    }
}
