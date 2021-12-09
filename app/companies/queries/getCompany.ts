import { resolver, NotFoundError } from "blitz"
import db, { Role } from "db"
import { z } from "zod"

const GetCompany = z.object({
  id: z.onumber().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetCompany),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const userRoles = (await db.user.findFirst({ where: { id: ctx.session.userId } }))?.roles
    const company = await db.company.findFirst({
      where: { id },
      select: {
        active: true,
        companyRaportConnection: { select: { raport: true } },
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
    })

    const isOwnerOfCompany =
      !!company?.ownerConnection.find((o) => o.owner.id === ctx.session.userId) ?? false
    if (isOwnerOfCompany || userRoles?.includes(Role.ADMIN) || userRoles?.includes(Role.WORKER)) {
      return company
    }
  }
)
