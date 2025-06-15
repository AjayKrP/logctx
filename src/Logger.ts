import pino from 'pino';
import path from 'path';
import fs from 'fs';

// Set default log directory
const logDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const format = (process.env.LOG_FORMAT || 'json').toLowerCase();
const toFile = process.env.LOG_TO_FILE === 'true';
const logLevel = process.env.LOG_LEVEL || 'info';

let destination: pino.DestinationStream | undefined;
let transport: pino.TransportMultiOptions | undefined;

// 1. Log to pretty format for dev
if (format === 'pretty') {
    transport = {
        targets: [
            {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                },
            },
        ],
    };
}
// 2. Log to file (JSON format)
else if (toFile) {
    const logFile = path.join(logDir, 'app.log');
    destination = pino.destination({ dest: logFile, sync: false });
}

export const baseLogger = pino(
    {
        name: process.env.APP_NAME || 'logctx',
        level: logLevel,
        ...(transport ? { transport } : {}),
    },
    destination // optional second param for log file
);
