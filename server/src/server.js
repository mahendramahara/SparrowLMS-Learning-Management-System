const app = require('./app');
const logger = require('./utils/logger');

const port = Number(process.env.PORT) || 5000;
const host = process.env.HOST || 'localhost';

const server = host
  ? app.listen(port, host, () => logger.info(`Server running on ${host}:${port}`))
  : app.listen(port, () => logger.info(`Server running on port ${port}`));

const shutdown = () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = server;
