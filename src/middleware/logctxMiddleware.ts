import { runWithContext } from '../Context';
import { v4 as uuidv4 } from 'uuid';

interface LogCtxOptions {
    headers?: string[];
    params?: string[];
    queries?: string[];
    cookies?: string[];
}

interface GenericRequest {
    headers?: Record<string, any>;
    query?: Record<string, any>;
    cookies?: Record<string, any>;
    params?: Record<string, any>;
    method?: string;
    path?: string;
    url?: string;
}

/**
 * Middleware to create a context logger for a request.
 * It extracts specified headers, query parameters, and cookies,
 * and runs the next middleware with the context set.
 *
 * @param request - The incoming request object.
 * @param next - The next middleware function to call.
 * @param options - Options to specify which headers, queries, and cookies to include in the context.
 */
export function createContextLogger<T = any>(
    request: T extends GenericRequest ? T : GenericRequest,
    next: () => void,
    options: LogCtxOptions = {}
) {
    const requestId = request.headers?.['x-request-id'] || uuidv4();

    const headerContext = Object.fromEntries(
        (options.headers || []).map((key) => [key, request.headers?.[key.toLowerCase()]])
    );

    const queryContext = Object.fromEntries(
        (options.queries || []).map((key) => [key, request.query?.[key]])
    );

    const cookieContext = Object.fromEntries(
        (options.cookies || []).map((key) => [key, request.cookies?.[key]])
    );

    const paramContext = Object.fromEntries(
        (options.params || []).map((key) => [key, request.params?.[key]])
    );

    const context = {
        requestId: String(requestId),
        method: request.method,
        path: request.path || request.url,
        ...headerContext,
        ...queryContext,
        ...cookieContext,
        ...paramContext,
    };
    console.log('Context created:', context);
    runWithContext(context, () => {
        next();
    });
}
