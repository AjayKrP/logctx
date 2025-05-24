import { ContextualLogger } from './ContextualLogger';

const sharedLogger = new ContextualLogger();

/**
 * A decorator that adds a logger to the class.
 * The logger can be accessed via the `log` property.
 * @returns A class decorator that adds a logger to the class.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function WithLogger() {
    return function <T extends new (...args: any[]) => any>(OriginalClass: T): T {
        return class extends OriginalClass {
            constructor(...args: any[]) {
                super(...args);
                if (!('log' in this)) {
                    Object.defineProperty(this, 'log', {
                        get() {
                            return sharedLogger.log;
                        },
                        configurable: false,
                        enumerable: false,
                    });
                }
            }
        };
    };
}
