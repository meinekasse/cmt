import { paginate, resolver } from "blitz"
import db, { Prisma, Role } from "db"

interface GetUsersInput
  extends Pick<Prisma.UserFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetUsersInput, ctx) => {
    const {
      items: users,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.user.count({ where }),
      query: (paginateArgs) => db.user.findMany({ ...paginateArgs, where, orderBy }),
    })
    const isAdmin =
      (await db.user.findFirst({ where: { id: ctx.session.userId } }))?.roles.includes(
        Role.ADMIN
      ) ?? false
    const result = {
      users: isAdmin ? users : null,
      nextPage: isAdmin ? nextPage : null,
      hasMore: isAdmin ? hasMore : null,
      count: isAdmin ? count : null,
    }
    return result
  }
)
