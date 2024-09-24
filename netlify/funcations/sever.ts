// server.ts
import serverless from 'serverless-http';
import app from './../../src/api';  // adjust path as needed

module.exports.handler = serverless(app);
