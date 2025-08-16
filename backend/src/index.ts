// src/index.ts

import { Hono } from 'hono'
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';
import { cors } from 'hono/cors';
import { uploadRouter } from './routes/upload'; // --- 1. IMPORT the new router

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
    // --- 2. ADD the AWS variables to your app's types ---
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_BUCKET_NAME: string;
    AWS_REGION: string;
  },
  Variables: {
    userId: string
  }
}>();

app.use('/*', cors());

app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);
app.route('/api/v1', uploadRouter); // --- 3. ADD the new route ---

export default app;