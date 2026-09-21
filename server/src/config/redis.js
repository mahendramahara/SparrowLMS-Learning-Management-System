const Redis = require('ioredis');
const logger = require('../utils/logger');

let redisClient = null;

const connectRedis = () => {
  try {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: times => {
        if (times > 2) return null;
        return Math.min(times * 50, 300);
      },
    });

    redisClient.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    redisClient.on('error', err => {
      logger.error(`Redis connection error: ${err.message}`);
    });

    redisClient.on('close', () => {
      logger.warn('Redis connection closed');
    });

    return redisClient;
  } catch (error) {
    logger.error(`Redis initialization error: ${error.message}`);
    return null;
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

module.exports = { connectRedis, getRedisClient };
