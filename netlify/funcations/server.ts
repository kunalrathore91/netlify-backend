// server.ts
import serverless from 'serverless-http';
import app from '../../src/api' // adjust path as needed

export const handler = serverless(app);
