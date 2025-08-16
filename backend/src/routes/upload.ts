// src/routes/upload.ts

import { Hono } from 'hono';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { verify } from 'hono/jwt';

type Bindings = {
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_BUCKET_NAME: string;
    AWS_REGION: string;
    JWT_SECRET: string; // Added the secret for the middleware
}

// Initialize the router with the complete Bindings
export const uploadRouter = new Hono<{
    Bindings: Bindings,
    Variables: {
        userId: string
    }
}>();

// All routes in this file will require authentication
uploadRouter.use('/*', async (c, next) => {
    const jwt = c.req.header('Authorization');
    if (!jwt) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
    const token = jwt.split(' ')[1];
    try {
        const payload = await verify(token, c.env.JWT_SECRET);
        if (!payload) {
            c.status(401);
            return c.json({ error: "unauthorized" });
        }
        c.set("userId", payload.id as string);
        await next()
    }
    catch (e) {
        c.status(403);
        return c.json({
            message: "You aren't logged in"
        })
    }
});


uploadRouter.post('/upload-url', async (c) => {
    try {
        const s3 = new S3Client({
            region: c.env.AWS_REGION,
            credentials: {
                accessKeyId: c.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: c.env.AWS_SECRET_ACCESS_KEY,
            },
        });

        const { filename } = await c.req.json();
        const safeFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '');

        const command = new PutObjectCommand({
            Bucket: c.env.AWS_BUCKET_NAME,
            Key: safeFilename,
            ACL: 'public-read', // Make the file publicly readable
        });

        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

        return c.json({
            uploadUrl: uploadUrl,
            finalImageUrl: `https://${c.env.AWS_BUCKET_NAME}.s3.${c.env.AWS_REGION}.amazonaws.com/${safeFilename}`
        });

    } catch (error) {
        console.error("Error generating upload URL:", error);
        return c.json({ error: 'Failed to generate upload URL' }, 500);
    }
});