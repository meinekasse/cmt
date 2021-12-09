import { resolver, NotFoundError } from "blitz"
import db, { Role } from "db"
import { z } from "zod"

const GetUser = z.object({
  id: z.onumber().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetUser), resolver.authorize(), async ({ id }, ctx) => {
  if (await db.user.findFirst({ where: { id: ctx.session.userId } })) {
    const user = await db.user.findFirst({
      where: { id },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        surname: true,
        email: true,
        tokens: true,
        hashedPassword: true,
        roles: true,
        colorMode: true,
      },
    })

    if (!user) throw new NotFoundError()

    return user
  }
})
