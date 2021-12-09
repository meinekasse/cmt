import { paginate, resolver } from "blitz"
import db, { Prisma, Role } from "db"

interface GetCompaniesInput
  extends Pick<Prisma.CompanyFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetCompaniesInput, ctx) => {
    let finalWhere: any = {
      ...where,
      ownerConnection: { every: { ownerId: ctx.session.userId } },
    }
    const userRoles = (
      await db.user.findFirst({ where: { id: ctx.session.userId }, select: { roles: true } })
    )?.roles
    if ((userRoles?.includes(Role.ADMIN) || userRoles?.includes(Role.WORKER)) ?? false) {
      finalWhere = {
        ...where,
      }
    }
    const {
      items: companies,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.company.count({ where: finalWhere }),
      query: (paginateArgs) => db.company.findMany({ ...paginateArgs, where: finalWhere, orderBy }),
    })

    return {
      companies,
      nextPage,
      hasMore,
      count,
    }
  }
)
