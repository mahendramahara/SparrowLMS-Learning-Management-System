const app = require('./app');
const logger = require('./utils/logger');

const port = Number(process.env.PORT) || 5000;
const host = process.env.HOST || 'localhost';

const server = app.listen(port, host, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on ${host}:${port}`);
});

const shutdown = () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = server;
