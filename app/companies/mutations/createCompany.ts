import { resolver, validateZodSchema } from "blitz"
import db, { Country } from "db"
import { z } from "zod"
import { email } from "../../auth/validations"

const CreateCompany = z.object({
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
  resolver.zod(CreateCompany),
  resolver.authorize(),
  async (company, ctx) => {
    const { userId } = ctx.session
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const companyOwnerConnection = await db.companyOwner.create({
      data: {
        company: {
          create: {
            ...company,
          },
        },
        owner: { connect: { id: userId } },
      },
      select: { company: true, owner: true },
    })

    return companyOwnerConnection.company
  }
)
