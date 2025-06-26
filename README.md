# 📦 logctx

> A lightweight, context-aware logger built on top of [Pino](https://github.com/pinojs/pino), using `async_hooks` and supporting decorators, DI, and easy context propagation across HTTP or Kafka requests.

---

## 🚀 Features

- ✅ Automatically injects context like `userId`, `traceId`, etc., into logs
- ✅ Built with `async_hooks` for request-safe storage
- ✅ Compatible with any Node.js framework (Express, Kafka, etc.)
- ✅ Optional class decorator `@WithLogger()` for automatic logger injection
- ✅ Customizable context shape with zero config by default
- ✅ Built-in support for Pino transports like `pino-pretty`
- ✅ Supports JSON or human-readable log formats via env
- ✅ Optional log-to-file support with file rotation capability
- ✅ Supports a generic logging middleware compatible with any framework

## 📦 Installation

```bash
npm install logctx
````

Or with Yarn:

```bash
yarn add logctx
```

---

## 🛠️ Basic Usage

### 1. Import and use logger

```ts
import { runWithContext, ContextualLogger } from 'logctx';

const logger = new ContextualLogger();

runWithContext({ userId: '123', traceId: 'xyz' }, () => {
  logger.log.info('This will include userId and traceId');
});
```

---

### 2. Use `@WithLogger()` Decorator

```ts
import { WithLogger } from 'logctx';

@WithLogger()
class UserService {
  private log: any;
  doWork() {
    this.log.info('Logged with contextual metadata');
  }
}
```

> ⚠️ Make sure you use a DI container (like `typedi`) or `Container.get(UserService)` so decorators are respected.

---

### 3. Configure Custom Context Getter (Optional)

By default, the logger uses whatever was passed via `runWithContext`.
But you can override this globally:

```ts
import { configureLoggerContext } from 'logctx';

configureLoggerContext(() => ({
  userId: 'fallback-user',
  tenantId: 'default-tenant'
}));
```

---

## ⚙️ Environment Variables
| Variable        | Description                                      | Default          |
| --------------- | ------------------------------------------------ | ---------------- |
| `APP_NAME`      | Name to appear in logs                           | `logctx`         |
| `LOG_LEVEL`     | Logging level (`debug`, `info`, `warn`, `error`) | `info`           |
| `LOG_FORMAT`    | Log output format: `json` or `pretty`            | `json`           |
| `LOG_TO_FILE`   | Enable file logging: `true` or `false`           | `false`          |
| `LOG_FILE_PATH` | File path to store logs (if `LOG_TO_FILE=true`)  | `./logs/app.log` |

---

## 🧠 API Reference

### `runWithContext(context, callback)`

Wraps a function with the provided context for async propagation.

```ts
runWithContext({ userId: 'abc' }, () => {
  logger.log.info('userId will be injected');
});
```

---

### `configureLoggerContext(getterFn)`

Globally defines a fallback context getter if none is set.

```ts
configureLoggerContext(() => ({ tenant: 'main', traceId: 'auto' }));
```

---

### `ContextualLogger`

Provides a `.log` object with `info`, `error`, `warn`, and `debug`.

```ts
const logger = new ContextualLogger();
logger.log.info('message');
```

---

### `@WithLogger()`

Injects `this.log` into any class. Works well with service or controller patterns.

```ts
@WithLogger()
class MyService {
  private log: LoggerType; // optional for type hint
  doSomething() {
    this.log.info('Message with context');
  }
}
```

### With middleware 
Here's how you can integrate logctx into an Express application to enable contextual logging based on headers, query parameters, cookies, and route parameters.

```ts
import { createContextLogger, ContextualLogger } from "logctx";
import express from "express";

const logger = new ContextualLogger();

// Middleware to initialize context logger
function middleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    createContextLogger(req, next, {
        headers: ['x-request-id', 'user-agent'],
        queries: ['queryParam'],
        cookies: ['sessionId'],
        params: ['param1', 'param2'],
    });
    next(); // Important: call next middleware after context setup
}

const app = express();
app.use(middleware);

// Sample route using contextual logger
app.get('/', (req, res) => {
    logger.log.info('Request received');
    res.send('Hello from Express with Contextual Logger!');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

```

## 💡 Use Cases

* Log `userId`, `tenantId`, `traceId` across microservices
* Contextual logging for HTTP, WebSocket, Kafka
* Decorator-based logging without boilerplate
* Enforce consistent metadata across logs
* Switch easily between JSON and pretty logs using environment
* Persist logs to disk for production systems
* Use middleware with any NodeJS frameworks.

---

## 🧪 Example

```ts
import { runWithContext, ContextualLogger } from 'logctx';

const logger = new ContextualLogger();

runWithContext({ userId: 'U001' }, () => {
  logger.log.info('User event started'); // includes userId automatically
});
```

---

## 👨‍💻 Contributing

Pull requests, issues, and suggestions welcome!

```bash
git clone https://github.com/AjayKrP/logctx.git
npm install
npm run build
```

---