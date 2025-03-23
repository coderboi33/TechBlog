import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '@prisma/client/edge'
import { Hono } from 'hono'
import { jwt, verify } from 'hono/jwt';
import { createBlogInput, updateBlogInput } from 'techblog-common';
import { skip } from '@prisma/client/runtime/library';
export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    },
    Variables: {
        userId: string
    }
}>();

blogRouter.use('/*', async (c, next) => {
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
})

blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const body = await c.req.json();
        console.log("Request Body:", body); // Debugging: Log request body

        const { success } = createBlogInput.safeParse(body);
        if (!success) {
            c.status(400); // Use 400 for bad requests instead of 411
            return c.json({
                message: "Inputs not correct",
            });
        }

        const authorId = c.get('userId');
        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: authorId,
                published: false,
            },
        });

        return c.json({
            id: blog.id,
        });
    } catch (e) {
        console.error("Error while creating blog post:", e); // Debugging: Log errors
        c.status(500); // Use 500 for internal server errors
        return c.json({
            message: "Error while creating blog post",
        });
    }
});


blogRouter.put('/', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }
    const authorId = c.get('userId');

    const blog = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content,
            authorId: authorId
        }
    })

    return c.json({
        id: blog.id
    })
})


blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const take = parseInt(c.req.query('take') || '10');
    const skip = parseInt(c.req.query('skip') || '0');

    const blogs = await prisma.post.findMany({
        take: take,
        skip: skip,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            author: {
                select: {
                    name: true
                }
            }
        }
    });

    console.log("Blogs with timestamps:", blogs.map(blog => ({
        id: blog.id,
        title: blog.title,
        createdAt: blog.createdAt,
        author: blog.author.name
    })));

    return c.json({
        blogs
    })
})

blogRouter.get('/current', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        // Extract Authorization headerconst
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
            const userId = payload.id as string;

            console.log('Decoded user ID:', userId);

            // Query database for the user
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                c.status(404); // Not Found
                return c.json({ message: 'User dfdff not found' });
            }

            return c.json({ user });
        } catch (error) {
            console.error('Error fetching current user:', error);
            c.status(500); // Internal Server Error
            return c.json({ message: 'Internal server error' });
        }
    }
    catch (e) {
        c.status(411);
        return c.json({
            message: "Error while getting blog post"
        })
    }
});

blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const id = c.req.param();

    try {
        const blog = await prisma.post.findFirst({
            where: {
                id: id.id
            },
            include: {
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })

        if (!blog) {
            c.status(404);
            return c.json({ message: "Blog post not found" });
        }

        return c.json({
            blog
        });
    }
    catch (e) {
        c.status(411);
        return c.json({
            message: "Error while getting blog post"
        })
    }
})


