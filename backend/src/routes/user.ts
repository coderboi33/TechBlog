import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signinInput, signupInput } from 'techblog-common';
import bcrypt from 'bcryptjs';

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    },
    Variables: {
        userId: string
    }
}>();




userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
        data: {
            email: body.email,
            password: hashedPassword,
            name: body.name
        }
    })
    console.log(user);
    const token = await sign({ id: user.id }, c.env.JWT_SECRET)

    return c.json({
        jwt: token
    })
})




userRouter.post('/signin', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }

    const user = await prisma.user.findUnique({
        where: {
            email: body.email
        }
    });
    if (!user) {
        c.status(403);
        return c.json({
            error: "User not found!!"
        })
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
        c.status(403);
        return c.json({
            error: "Invalid credentials!!",
        });
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET)

    return c.json({
        jwt: token
    })

})

userRouter.post('/signout', async (c) => {

    return c.json({
        message: "Successfully signed out"
    });
})


