require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/database');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key';

beforeAll(async () => {
  await connectDB();
}, 20000);

afterAll(async () => {
  await mongoose.disconnect();
});

