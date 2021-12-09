import { resolver } from "blitz"
import db, { Currency, Role } from "db"
import { z } from "zod"

const CreateProduct = z.object({
  modelname: z.string(),
  modelserial: z.string(),
  price: z.number(),
  currency: z.enum([Currency.CHF, Currency.EUR]),
  worktimehours: z.optional(z.number()),
  worktimeminutes: z.optional(z.number()),
})

export default resolver.pipe(
  resolver.zod(CreateProduct),
  resolver.authorize(),
  async (input, ctx) => {
    if (
      (await db.user.findFirst({ where: { id: ctx.session.userId } }))?.roles.includes(
        Role.ADMIN
      ) ??
      false
    ) {
      const product = await db.product.create({
        data: input,
      })

      return product
    } else {
      throw new Error("You are not authorized to create products")
    }
  }
)
