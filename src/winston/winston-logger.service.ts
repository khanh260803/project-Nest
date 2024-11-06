import { createLogger, format, transports } from 'winston';

// Hàm để format stack trace nếu có
const formatStack = (stack?: string) =>
  stack ? stack.replace(/\n\s+/g, '\n  ') : 'No stack trace';

const customFormat = format.printf(({ level, message, timestamp, ...meta }) => {
  const { method, url, stack } = meta;
  return `
[${timestamp}] ${level.toUpperCase()}:
Message: ${message}
Meta:
  - Method: ${method || 'N/A'}
  - URL: ${url || 'N/A'}
  - Stack Trace: 
${formatStack(stack)}
`;
});

// Tạo logger với custom format
export const winstonLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat, // Sử dụng custom format
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});
