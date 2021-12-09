import { resolver } from "blitz"
import db, { Currency, Role } from "db"
import { z } from "zod"

const UpdateProduct = z.object({
  id: z.number(),
  modelname: z.string(),
  modelserial: z.string(),
  price: z.number(),
  currency: z.enum([Currency.CHF, Currency.EUR]),
  worktimehours: z.number(),
  worktimeminutes: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateProduct),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    if (
      (await db.user.findFirst({ where: { id: ctx.session.userId } }))?.roles.includes(
        Role.ADMIN
      ) ??
      false
    ) {
      const product = await db.product.update({
        where: { id },
        data,
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          currency: true,
          modelname: true,
          modelserial: true,
          raports: {
            select: {
              id: true,
              createdBy: true,
              createdAt: true,
              updatedAt: true,
              tasktype: true,
              taskname: true,
              taskdescription: true,
              companyRaportConnection: {
                select: {
                  company: {
                    select: {
                      active: true,
                      createdAt: true,
                      updatedAt: true,
                      email: true,
                      phone: true,
                      id: true,
                      name: true,
                      city: true,
                      street: true,
                      country: true,
                      postalcode: true,
                      streetnumber: true,
                      ownerConnection: {
                        select: {
                          owner: {
                            select: {
                              id: true,
                              createdAt: true,
                              updatedAt: true,
                              name: true,
                              surname: true,
                              email: true,
                              roles: true,
                              sessions: true,
                              tokens: true,
                            },
                          },
                        },
                      },
                      type: true,
                      webpage: true,
                    },
                  },
                },
              },
            },
          },
          price: true,
          worktimehours: true,
          worktimeminutes: true,
        },
      })

      return product
    }
    throw new Error("You are not Authorized to update products")
  }
)
