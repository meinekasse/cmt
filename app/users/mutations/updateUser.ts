import { resolver } from "blitz"
import db, { Role } from "db"
import { z } from "zod"
import { email } from "../../auth/validations"

export const UpdateUser = z.object({
  id: z.number(),
  name: z.string(),
  surname: z.string(),
  email: email,
  roles: z.enum([Role.USER, Role.ADMIN, Role.WORKER]).array(),
  colormode: z.enum(["light", "dark"]),
})

export default resolver.pipe(
  resolver.zod(UpdateUser),
  resolver.authorize(),
  async ({ id, colormode, ...data }, ctx) => {
    if (await db.user.findFirst({ where: { id: ctx.session.userId } })) {
      const user = await db.user.update({
        where: { id },
        data: { ...data, colorMode: colormode },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          name: true,
          surname: true,
          colorMode: true,
          email: true,
          tokens: true,
          hashedPassword: true,
          roles: true,
        },
      })

      return user
    }
  }
)
