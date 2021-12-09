import { resolver } from "blitz"
import db, { Role } from "db"
import { z } from "zod"

const DeleteUser = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteUser),
  resolver.authorize(),
  async ({ id }, ctx) => {
    if (await db.user.findFirst({ where: { id: ctx.session.userId } })) {
      const user = await db.user.deleteMany({ where: { id } })

      return user
    }
  }
)
