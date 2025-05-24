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

---

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
  log: LoggerType; // optional for type hint
  doSomething() {
    this.log.info('Message with context');
  }
}
```

## 💡 Use Cases

* Log `userId`, `tenantId`, `traceId` across microservices
* Contextual logging for HTTP, WebSocket, Kafka
* Decorator-based logging without boilerplate
* Enforce consistent metadata across logs

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