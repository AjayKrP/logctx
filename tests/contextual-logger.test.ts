import { ContextualLogger } from '../src/ContextualLogger';
import { runWithContext } from '../src/Context';
import { baseLogger } from '../src/Logger';
import { WithLogger } from '../src/WithLogger';

describe('ContextualLogger', () => {
    let logger: ContextualLogger;

    beforeEach(() => {
        logger = new ContextualLogger();
    });

    it('should log messages with context', () => {
        const spy = jest.spyOn(baseLogger, 'info');

        runWithContext({ userId: 'abc123' }, () => {
            logger.log.info('Hello from context-aware log');
        });

        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({ userId: 'abc123' }),
            'Hello from context-aware log'
        );
    });
});

describe('WithLogger Decorator', () => {
    interface WithLog {
        log: {
            info: (...args: any[]) => void;
            [key: string]: any;
        };
    }

    class TestClass {
        log: any;
    }

    const DecoratedClass = WithLogger()(TestClass);

    it('should add a log property to the class', () => {
        const instance = new DecoratedClass() as WithLog;
        expect(instance).toHaveProperty('log');
        expect(typeof instance.log.info).toBe('function');
    });

    it('should log messages with context when using runWithContext', () => {
        const instance = new DecoratedClass();
        const logSpy = jest.spyOn(baseLogger, 'info');

        runWithContext({ userId: 'testUser' }, () => {
            instance.log.info('Test message with context');
        });

        expect(logSpy).toHaveBeenCalledWith(
            expect.objectContaining({ userId: 'testUser' }),
            'Test message with context'
        );
    });

    it('should not override existing log property', () => {
        class AnotherTestClass {
            log = { info: jest.fn() };
        }

        const Decorated = WithLogger()(AnotherTestClass);
        const instance = new Decorated();

        instance.log.info('Test message');
        expect(instance.log.info).toHaveBeenCalledWith('Test message');
    });

    it('should not override existing log property with non-function type', () => {
        class AnotherTestClass {
            log = { info: 'Not a function' };
        }

        const Decorated = WithLogger()(AnotherTestClass);
        const instance = new Decorated();

        expect(typeof instance.log.info).toBe('string');
    });

    it('should not override existing log property with non-object type', () => {
        class AnotherTestClass {
            log = 'Not an object';
        }

        const Decorated = WithLogger()(AnotherTestClass);
        const instance = new Decorated();

        expect(typeof instance.log).toBe('string');
    });
});
