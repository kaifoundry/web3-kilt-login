import { createLogger, transports, format } from 'winston';
import * as path from 'path';
import { fileURLToPath } from 'url';

// const logFilePath = path.join(__dirname, 'logs', 'app.log');
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const logFilePath = path.join(__dirname, 'logs', 'app.log');

export const logger = createLogger({
  level: 'info',
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    }),
  ),
  transports: [
    new transports.Console(),

    // new transports.File({
    //   filename: logFilePath,
    //   level: 'info',
    //   format: format.combine(format.timestamp(), format.json()),
    // }),
  ],
});
