import { AsyncLocalStorage } from 'async_hooks';

/**
 * ContextManager is a utility class that provides a way to manage context
 * across asynchronous calls using AsyncLocalStorage.
 *
 * @template T The type of the context.
 */
let store: AsyncLocalStorage<any> = new AsyncLocalStorage();
let getDefaultContext = () => ({});

/*
* Configure the default context getter function.
* This function is used to provide a default context when no context is set.
* It should return an object that represents the default context.
*
* @param contextGetter - A function that returns the default context object.
*/
export function configureLoggerContext<T extends () => {}>(contextGetter: () => T) {
    getDefaultContext = contextGetter;
}

/**
 * Runs a callback function with a specific context.
 * The context is set using AsyncLocalStorage, allowing the callback to access
 * the context throughout its execution.
 *
 * @param context - The context to run the callback with.
 * @param callback - The callback function to execute with the provided context.
 * @template T - The type of the context.
*/
export function runWithContext<T>(context: T, callback: () => void) {
    store.run(context, callback);
}

/**
 * Retrieves the current context from the AsyncLocalStorage.
 * If no context is set, it returns the default context provided by `getDefaultContext`.
 *
 * @returns The current context or the default context if none is set.
 */
export function getContext() {
    return store.getStore() || getDefaultContext();
}
