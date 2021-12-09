import { resolver } from "blitz"
import db, { Role } from "db"
import { z } from "zod"

const DeleteProduct = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteProduct),
  resolver.authorize(),
  async ({ id }, ctx) => {
    if (
      (await db.user.findFirst({ where: { id: ctx.session.userId } }))?.roles.includes(
        Role.ADMIN
      ) ??
      false
    ) {
      const product = await db.product.deleteMany({ where: { id } })
      return product
    }
    throw new Error("You are not authorized to delete Products")
  }
)
