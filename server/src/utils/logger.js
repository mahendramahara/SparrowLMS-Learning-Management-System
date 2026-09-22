const winston = require('winston');

const isProduction = process.env.NODE_ENV === 'production';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'sparrowlms-server' },
  transports: [
    new winston.transports.Console({
      format: isProduction
        ? winston.format.json()
        : winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  ],
});

if (!isProduction) {
  const fs = require('fs');
  const path = require('path');
  const logDir = path.join(process.cwd(), 'logs');

  try {
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    logger.add(new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }));
    logger.add(new winston.transports.File({ filename: path.join(logDir, 'combined.log') }));
  } catch {
    logger.warn('Could not create log directory — file logging disabled');
  }
}

module.exports = logger;
