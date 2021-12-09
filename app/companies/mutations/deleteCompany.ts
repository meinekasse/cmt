import { resolver } from "blitz"
import db, { Role } from "db"
import { z } from "zod"

const DeleteCompany = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteCompany),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const userRoles = (await db.user.findFirst({ where: { id: ctx.session.userId } }))?.roles
    if (userRoles?.includes(Role.USER) ?? false) {
      const isOwnerOfCompany = !!(await (
        await db.company.findFirst({ where: { id } }).ownerConnection()
      ).find((o) => o.ownerId === ctx.session.userId))
      if (isOwnerOfCompany) {
        const company = await db.company.deleteMany({
          where: {
            AND: [{ id }, { ownerConnection: { every: { ownerId: ctx.session.userId } } }],
          },
        })
        return company
      }
    } else if (userRoles?.includes(Role.ADMIN) || userRoles?.includes(Role.WORKER)) {
      const company = await db.company.deleteMany({
        where: {
          id,
        },
      })
    } else {
      throw new Error("This is not your company. You can not remove it.")
    }
  }
)
