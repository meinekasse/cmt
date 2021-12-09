import { resolver } from "blitz"
import db, { Country, Role } from "db"
import { z } from "zod"
import { email } from "../../auth/validations"

const UpdateCompany = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(["GmbH", "Einzelfirma"]),
  phone: z.string(),
  email: email,
  webpage: z.optional(z.string()),
  street: z.string(),
  streetnumber: z.string(),
  country: z.enum([Country.CH, Country.DE]),
  postalcode: z.string(),
  city: z.string(),
})
export default resolver.pipe(
  resolver.zod(UpdateCompany),
  resolver.authorize(),
  async (company, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const c = await (
      (await db.company
        .findFirst({
          where: { id: company.id },
          select: { ownerConnection: { select: { owner: true } } },
        })
        .ownerConnection()) || ctx.session.roles.some((r) => r === Role.ADMIN)
    ).every((oC) => oC.ownerId === ctx.session.userId)

    if (c) {
      const companyUpdated = await db.company.update({
        where: { id: company.id },
        data: {
          ...company,
        },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          webpage: true,
          active: true,
          createdAt: true,
          updatedAt: true,
          type: true,
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
          companyRaportConnection: { select: { raport: true } },
        },
      })
      return companyUpdated
    } else {
      throw new Error("You can not update this company, it doesnt belong to you.")
    }
  }
)
