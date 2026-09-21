require('dotenv').config({ path: '.env.test' });

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key';
process.env.DATABASE_URL = 'mongodb://localhost:27017/sparrow_lms_test';
