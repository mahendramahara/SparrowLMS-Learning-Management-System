const dns = require('node:dns');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const dnsServers = (process.env.MONGODB_DNS_SERVERS || '1.1.1.1,8.8.8.8')
  .split(',')
  .map(server => server.trim())
  .filter(Boolean);

if (dnsServers.length > 0) {
  dns.setServers(dnsServers);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      serverSelectionTimeoutMS: Number(process.env.DATABASE_TIMEOUT_MS) || 5000,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', err => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    return null;
  }
};

module.exports = connectDB;
